/**
 * crypto.mjs — base58 + ed25519 on-curve test + program-derived-address derivation.
 *
 * Implemented from scratch so the census has no dependency surface: a stranger can run
 * `node src/census/cli.mjs` on a clean checkout with nothing installed. The PDA derivation
 * is load-bearing (it is how we locate each mint's ExtraAccountMetaList), so it is tested
 * against fixtures in crypto.test.mjs.
 *
 * Convention shared with chain.mjs: return null on bad input rather than throwing.
 */

import { createHash } from 'node:crypto';

const B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const B58_MAP = new Map([...B58_ALPHABET].map((c, i) => [c, i]));

/** Encode bytes to base58. */
export function b58encode(bytes) {
  if (!bytes || bytes.length === 0) return '';
  const input = Uint8Array.from(bytes);

  let zeros = 0;
  while (zeros < input.length && input[zeros] === 0) zeros++;

  // Repeated division of the big-endian byte string by 58.
  const digits = [];
  for (let i = zeros; i < input.length; i++) {
    let carry = input[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  let out = '1'.repeat(zeros);
  for (let i = digits.length - 1; i >= 0; i--) out += B58_ALPHABET[digits[i]];
  return out;
}

/** Decode base58 to Uint8Array. Returns null on an invalid character. */
export function b58decode(str) {
  if (typeof str !== 'string' || str.length === 0) return null;

  let zeros = 0;
  while (zeros < str.length && str[zeros] === '1') zeros++;

  const bytes = [];
  for (let i = zeros; i < str.length; i++) {
    const val = B58_MAP.get(str[i]);
    if (val === undefined) return null;
    let carry = val;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  const out = new Uint8Array(zeros + bytes.length);
  for (let i = 0; i < bytes.length; i++) out[zeros + i] = bytes[bytes.length - 1 - i];
  return out;
}

/** True if `s` decodes to exactly 32 bytes — i.e. looks like a pubkey. */
export function isPubkey(s) {
  const d = b58decode(s);
  return d !== null && d.length === 32;
}

// ---------------------------------------------------------------------------
// ed25519 field arithmetic, only enough to decide "is this 32-byte value a valid
// compressed Edwards point". Solana's find_program_address rejects any candidate
// that IS on the curve, because such an address could have a matching private key.
// ---------------------------------------------------------------------------

const P = (1n << 255n) - 19n;
// d = -121665 / 121666 (mod p)
const D = 37095705934669439343138083508754565189542113879843219016388785533085940283555n;
// sqrt(-1) mod p
const SQRT_M1 = 19681161376707505956807079304988542015446066515923890162744021073123829784752n;

function mod(a) {
  const r = a % P;
  return r < 0n ? r + P : r;
}

/** Modular exponentiation (square-and-multiply). */
function powMod(base, exp) {
  let result = 1n;
  let b = mod(base);
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % P;
    b = (b * b) % P;
    e >>= 1n;
  }
  return result;
}

function bytesToFieldLE(bytes) {
  let n = 0n;
  for (let i = 31; i >= 0; i--) n = (n << 8n) | BigInt(bytes[i]);
  return n;
}

/**
 * True when the 32 bytes decompress to a point on ed25519.
 *
 * Mirrors curve25519-dalek's CompressedEdwardsY::decompress: clear the sign bit to get y,
 * then x^2 = (y^2 - 1) / (d*y^2 + 1) must be a quadratic residue.
 */
export function isOnCurve(bytes) {
  if (!bytes || bytes.length !== 32) return false;

  const y = mod(bytesToFieldLE(bytes) & ((1n << 255n) - 1n)); // clear sign bit
  const y2 = (y * y) % P;
  const u = mod(y2 - 1n);          // numerator
  const v = mod(D * y2 + 1n);      // denominator

  if (v === 0n) return false;

  // Candidate root: x = u * v^3 * (u * v^7)^((p-5)/8)
  const v2 = (v * v) % P;
  const v3 = (v2 * v) % P;
  const v4 = (v2 * v2) % P;
  const v7 = (v3 * v4) % P;
  const uv3 = (u * v3) % P;
  const uv7 = (u * v7) % P;

  let x = (uv3 * powMod(uv7, (P - 5n) / 8n)) % P;

  const check = (vx2) => mod(vx2 - u) === 0n;
  const vx2 = (v * ((x * x) % P)) % P;

  if (check(vx2)) return true;                    // correct root
  if (mod(vx2 + u) === 0n) return true;           // off by sqrt(-1); still a valid point
  // Some implementations need the explicit sqrt(-1) multiply before rejecting.
  x = (x * SQRT_M1) % P;
  return check((v * ((x * x) % P)) % P);
}

const PDA_MARKER = Buffer.from('ProgramDerivedAddress', 'utf8');

/**
 * Compute a program address for a fixed bump. Returns null if the result lands on the
 * curve (the caller must try the next bump).
 */
export function createProgramAddress(seeds, programId) {
  const pid = typeof programId === 'string' ? b58decode(programId) : programId;
  if (!pid || pid.length !== 32) return null;

  const parts = [];
  for (const s of seeds) {
    const buf = typeof s === 'string' ? Buffer.from(s, 'utf8') : Buffer.from(s);
    if (buf.length > 32) return null;
    parts.push(buf);
  }
  parts.push(Buffer.from(pid), PDA_MARKER);

  const hash = createHash('sha256').update(Buffer.concat(parts)).digest();
  if (isOnCurve(hash)) return null;
  return b58encode(hash);
}

/**
 * Solana's findProgramAddress: walk bumps 255 -> 0 and take the first off-curve hash.
 * Returns `{ address, bump }`, or null if no bump works (cryptographically improbable).
 */
export function findProgramAddress(seeds, programId) {
  for (let bump = 255; bump >= 0; bump--) {
    const address = createProgramAddress([...seeds, Uint8Array.from([bump])], programId);
    if (address) return { address, bump };
  }
  return null;
}

/** The transfer-hook interface's extra-account-metas PDA for a mint. */
export const EXTRA_ACCOUNT_METAS_SEED = 'extra-account-metas';

export function extraAccountMetasPda(mint, hookProgramId) {
  const mintBytes = b58decode(mint);
  if (!mintBytes || mintBytes.length !== 32) return null;
  return findProgramAddress([EXTRA_ACCOUNT_METAS_SEED, mintBytes], hookProgramId);
}

export const METAPLEX_METADATA_PROGRAM = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

/** Metaplex Token Metadata PDA: ["metadata", metaplex_program, mint]. */
export function metaplexMetadataPda(mint) {
  const mintBytes = b58decode(mint);
  const progBytes = b58decode(METAPLEX_METADATA_PROGRAM);
  if (!mintBytes || !progBytes) return null;
  return findProgramAddress(['metadata', progBytes, mintBytes], METAPLEX_METADATA_PROGRAM);
}
