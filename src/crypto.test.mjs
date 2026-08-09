/**
 * crypto.test.mjs — base58 and PDA derivation.
 *
 * The PDA fixtures below were produced by this implementation and then verified against
 * mainnet: the Metaplex metadata PDA for USDC was fetched from RPC, found to be owned by
 * the Metaplex Token Metadata program, and its embedded mint field equalled the USDC mint.
 * A wrong on-curve test or a wrong sha256 input would not have produced a live account.
 * Offline from here on — `node --test` needs no network.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  b58encode, b58decode, isPubkey, isOnCurve,
  findProgramAddress, createProgramAddress,
  extraAccountMetasPda, metaplexMetadataPda, METAPLEX_METADATA_PROGRAM,
} from './crypto.mjs';

const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SYSTEM = '11111111111111111111111111111111';
const TOKEN_2022 = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';

test('base58 round-trips real pubkeys', () => {
  for (const k of [USDC, SYSTEM, TOKEN_2022, METAPLEX_METADATA_PROGRAM]) {
    const bytes = b58decode(k);
    assert.equal(bytes.length, 32, `${k} must decode to 32 bytes`);
    assert.equal(b58encode(bytes), k);
  }
});

test('base58 preserves leading zero bytes as leading ones', () => {
  // The system program is 32 zero bytes and must not collapse to a shorter string.
  assert.ok(b58decode(SYSTEM).every((b) => b === 0));
  assert.equal(b58encode(new Uint8Array(32)), SYSTEM);
});

test('base58 rejects characters outside the alphabet', () => {
  assert.equal(b58decode('0OIl'), null);       // the four excluded look-alikes
  assert.equal(b58decode('not valid!'), null);
  assert.equal(b58decode(''), null);
});

test('isPubkey accepts 32-byte values and rejects the rest', () => {
  assert.equal(isPubkey(USDC), true);
  assert.equal(isPubkey('abc'), false);
  assert.equal(isPubkey('0OIl'), false);
});

test('isOnCurve accepts a real wallet-derived key', () => {
  // USDC's mint address is an ordinary ed25519 public key, so it lies on the curve.
  assert.equal(isOnCurve(b58decode(USDC)), true);
});

test('isOnCurve rejects a known PDA', () => {
  // Every PDA is off-curve by construction; if this returned true, findProgramAddress
  // would loop past valid bumps and derive the wrong address.
  const pda = metaplexMetadataPda(USDC);
  assert.equal(isOnCurve(b58decode(pda.address)), false);
});

test('isOnCurve handles wrong-length input without throwing', () => {
  assert.equal(isOnCurve(new Uint8Array(31)), false);
  assert.equal(isOnCurve(null), false);
});

test('metaplexMetadataPda matches the value verified against mainnet', () => {
  // Verified: this address exists on mainnet, is owned by metaqbxx..., and its metadata
  // account's `mint` field equals the USDC mint.
  const pda = metaplexMetadataPda(USDC);
  assert.equal(pda.address, '5x38Kp4hvdomTCnCrAny4UtMUt5rQBdB6px2K1Ui45Wq');
  assert.equal(pda.bump, 255);
});

test('associated token account derivation matches the canonical algorithm', () => {
  // Cross-check against a third program's well-known derivation, so the test does not
  // only exercise Metaplex-shaped seeds.
  const ATA_PROGRAM = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
  const TOKEN_LEGACY = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
  const owner = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
  const ata = findProgramAddress(
    [b58decode(owner), b58decode(TOKEN_LEGACY), b58decode(USDC)],
    ATA_PROGRAM,
  );
  assert.equal(ata.address, 'FGETo8T8wMcN2wCjav8VK6eh3dLk63evNDPxzLSJra8B');
  assert.equal(ata.bump, 254);
});

test('extraAccountMetasPda uses the documented seed and is deterministic', () => {
  const a = extraAccountMetasPda(USDC, TOKEN_2022);
  const b = extraAccountMetasPda(USDC, TOKEN_2022);
  assert.equal(a.address, b.address);
  assert.ok(a.bump >= 0 && a.bump <= 255);
  assert.equal(isOnCurve(b58decode(a.address)), false);

  // Same mint under a different hook program must give a different PDA, otherwise the
  // census would attribute one program's account list to another.
  const other = extraAccountMetasPda(USDC, METAPLEX_METADATA_PROGRAM);
  assert.notEqual(a.address, other.address);
});

test('extraAccountMetasPda returns null on a malformed mint instead of guessing', () => {
  assert.equal(extraAccountMetasPda('not-a-key', TOKEN_2022), null);
});

test('createProgramAddress returns null when the hash lands on the curve', () => {
  // Sweep bumps for a fixed seed: at least one must be rejected as on-curve, which is
  // exactly the case findProgramAddress has to skip past.
  let rejected = 0;
  for (let bump = 255; bump >= 200; bump--) {
    if (createProgramAddress(['seed', Uint8Array.from([bump])], TOKEN_2022) === null) rejected++;
  }
  assert.ok(rejected > 0, 'expected at least one on-curve rejection in a 56-bump sweep');
});

test('createProgramAddress rejects an over-long seed', () => {
  assert.equal(createProgramAddress([new Uint8Array(33)], TOKEN_2022), null);
});
