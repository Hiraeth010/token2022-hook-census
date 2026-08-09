/**
 * tlv.mjs — byte-level parsers. Pure functions, no I/O, no network.
 *
 * Layouts were read off the current spl-token-2022 interface source rather than
 * assumed; see METHOD.md for the citations. The short version, for a Mint that
 * carries extensions:
 *
 *   [0   .. 82 )  base Mint
 *   [82  .. 165)  padding, so the account cannot be confused with a 165-byte token Account
 *   [165 .. 166)  AccountType discriminator  (0 Uninitialized, 1 Mint, 2 Account)
 *   [166 .. end)  TLV entries: u16 LE type, u16 LE length, `length` bytes of value
 *
 * A 82-byte account is a legacy mint with no extensions and therefore no hook.
 *
 * Convention shared with chain.mjs: these return null on malformed input rather than
 * throwing or guessing. A null here means "could not parse", which the renderer must
 * surface as `not covered` — never as a pass.
 */

import { createHash } from 'node:crypto';
import { b58encode } from './crypto.mjs';

export const TOKEN_2022_PROGRAM = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
export const TOKEN_LEGACY_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

export const MINT_BASE_LEN = 82;
export const BASE_ACCOUNT_LENGTH = 165;
export const ACCOUNT_TYPE_OFFSET = 165;
export const TLV_START_OFFSET = 166;

export const ACCOUNT_TYPE = { 0: 'uninitialized', 1: 'mint', 2: 'account' };

/**
 * ExtensionType discriminants, `#[repr(u16)]`, in declaration order.
 * Source: solana-program/token-2022 interface/src/extension/mod.rs.
 */
export const EXTENSION_NAMES = {
  0: 'Uninitialized',
  1: 'TransferFeeConfig',
  2: 'TransferFeeAmount',
  3: 'MintCloseAuthority',
  4: 'ConfidentialTransferMint',
  5: 'ConfidentialTransferAccount',
  6: 'DefaultAccountState',
  7: 'ImmutableOwner',
  8: 'MemoTransfer',
  9: 'NonTransferable',
  10: 'InterestBearingConfig',
  11: 'CpiGuard',
  12: 'PermanentDelegate',
  13: 'NonTransferableAccount',
  14: 'TransferHook',
  15: 'TransferHookAccount',
  16: 'ConfidentialTransferFeeConfig',
  17: 'ConfidentialTransferFeeAmount',
  18: 'MetadataPointer',
  19: 'TokenMetadata',
  20: 'GroupPointer',
  21: 'TokenGroup',
  22: 'GroupMemberPointer',
  23: 'TokenGroupMember',
  24: 'ConfidentialMintBurn',
  25: 'ScaledUiAmount',
  26: 'Pausable',
  27: 'PausableAccount',
  28: 'PermissionedBurn',
};

export const EXT_TRANSFER_HOOK = 14;
export const EXT_TOKEN_METADATA = 19;
export const EXT_METADATA_POINTER = 18;

export function extensionName(type) {
  return EXTENSION_NAMES[type] ?? `Unknown(${type})`;
}

const buf = (data) => (Buffer.isBuffer(data) ? data : Buffer.from(data));

/** A 32-byte pubkey field where all-zero means "none" (MaybeNull / OptionalNonZeroPubkey). */
function maybeNullPubkey(b, offset) {
  const slice = b.subarray(offset, offset + 32);
  if (slice.length !== 32) return undefined;
  return slice.every((x) => x === 0) ? null : b58encode(slice);
}

/** A COption<Pubkey>: u32 LE tag then 32 bytes. Used by the legacy base mint layout. */
function cOptionPubkey(b, offset) {
  if (offset + 36 > b.length) return undefined;
  const tag = b.readUInt32LE(offset);
  if (tag === 0) return null;
  return b58encode(b.subarray(offset + 4, offset + 36));
}

// ---------------------------------------------------------------------------
// Base mint
// ---------------------------------------------------------------------------

/**
 * Parse the 82-byte base Mint that prefixes every SPL mint, legacy or Token-2022.
 * `supply` is returned as a BigInt because a u64 supply overflows Number.
 */
export function parseMintBase(data) {
  const b = buf(data);
  if (b.length < MINT_BASE_LEN) return null;
  return {
    mintAuthority: cOptionPubkey(b, 0),
    supply: b.readBigUInt64LE(36),
    decimals: b[44],
    isInitialized: b[45] === 1,
    freezeAuthority: cOptionPubkey(b, 46),
  };
}

/**
 * Which kind of Token-2022 account this is.
 * Returns 'legacy-mint' for an exactly-82-byte account (no extensions, no discriminator).
 */
export function accountKind(data) {
  const b = buf(data);
  if (b.length === MINT_BASE_LEN) return 'legacy-mint';
  if (b.length <= ACCOUNT_TYPE_OFFSET) return 'unknown';
  return ACCOUNT_TYPE[b[ACCOUNT_TYPE_OFFSET]] ?? 'unknown';
}

// ---------------------------------------------------------------------------
// TLV walk
// ---------------------------------------------------------------------------

/**
 * Walk the extension TLV region of a mint account.
 *
 * Returns `{ accountKind, entries, truncated }`. `truncated` is true when a declared
 * TLV length runs past the end of the account — that means we did NOT see the whole
 * extension set, and the caller must treat the extension list as incomplete rather
 * than as a complete list that happens to be short.
 */
export function parseMintExtensions(data) {
  const b = buf(data);
  const kind = accountKind(b);

  if (kind === 'legacy-mint') {
    return { accountKind: kind, entries: [], truncated: false };
  }
  if (kind !== 'mint') return null;

  const entries = [];
  let offset = TLV_START_OFFSET;
  let truncated = false;

  while (offset + 4 <= b.length) {
    const type = b.readUInt16LE(offset);
    const length = b.readUInt16LE(offset + 2);

    // Type 0 with the rest of the buffer zeroed is trailing pre-allocated space,
    // not a real extension. Stop cleanly.
    if (type === 0 && length === 0) break;

    const valueStart = offset + 4;
    const valueEnd = valueStart + length;
    if (valueEnd > b.length) {
      truncated = true;
      break;
    }

    entries.push({
      type,
      name: extensionName(type),
      length,
      offset: valueStart,
      value: b.subarray(valueStart, valueEnd),
    });
    offset = valueEnd;
  }

  return { accountKind: kind, entries, truncated };
}

/** Find one extension's raw value, or null when the mint does not carry it. */
export function findExtension(parsed, type) {
  if (!parsed?.entries) return null;
  return parsed.entries.find((e) => e.type === type) ?? null;
}

// ---------------------------------------------------------------------------
// TransferHook (extension type 14)
// ---------------------------------------------------------------------------

/**
 * TransferHook { authority: MaybeNull<Address>, program_id: MaybeNull<Address> } — 64 bytes.
 *
 * Both fields are all-zero-means-null. A null `programId` is meaningful and is NOT the
 * same as no extension: it means the extension is present but currently points at no
 * program, so transfers do not call out. A non-null `authority` can set it to a real
 * program later, which is itself a mutability risk worth recording.
 */
export function parseTransferHook(value) {
  const b = buf(value);
  if (b.length < 64) return null;
  return {
    authority: maybeNullPubkey(b, 0),
    programId: maybeNullPubkey(b, 32),
  };
}

/** MetadataPointer { authority, metadata_address } — 64 bytes, both all-zero-means-null. */
export function parseMetadataPointer(value) {
  const b = buf(value);
  if (b.length < 64) return null;
  return {
    authority: maybeNullPubkey(b, 0),
    metadataAddress: maybeNullPubkey(b, 32),
  };
}

// ---------------------------------------------------------------------------
// TokenMetadata (extension type 19) — borsh, variable length
// ---------------------------------------------------------------------------

const MAX_STR = 1 << 16; // guard against a corrupt length prefix allocating wildly

function borshString(b, offset) {
  if (offset + 4 > b.length) return null;
  const len = b.readUInt32LE(offset);
  if (len > MAX_STR || offset + 4 + len > b.length) return null;
  const raw = b.subarray(offset + 4, offset + 4 + len);
  // Metaplex pads fixed-width strings with NULs; strip them so names compare cleanly.
  return { value: raw.toString('utf8').replace(/\0+$/, ''), next: offset + 4 + len };
}

/**
 * TokenMetadata: update_authority (OptionalNonZeroPubkey, 32), mint (32),
 * name/symbol/uri (borsh strings), additional_metadata (Vec<(String, String)>).
 */
export function parseTokenMetadata(value) {
  const b = buf(value);
  if (b.length < 64) return null;

  const updateAuthority = maybeNullPubkey(b, 0);
  const mint = b58encode(b.subarray(32, 64));

  const name = borshString(b, 64);
  if (!name) return null;
  const symbol = borshString(b, name.next);
  if (!symbol) return null;
  const uri = borshString(b, symbol.next);
  if (!uri) return null;

  const additional = [];
  let off = uri.next;
  if (off + 4 <= b.length) {
    const count = b.readUInt32LE(off);
    off += 4;
    for (let i = 0; i < count && off < b.length; i++) {
      const k = borshString(b, off);
      if (!k) break;
      const v = borshString(b, k.next);
      if (!v) break;
      additional.push([k.value, v.value]);
      off = v.next;
    }
  }

  return {
    updateAuthority,
    mint,
    name: name.value,
    symbol: symbol.value,
    uri: uri.value,
    additionalMetadata: additional,
  };
}

// ---------------------------------------------------------------------------
// Metaplex Token Metadata account
// ---------------------------------------------------------------------------

/**
 * Metaplex MetadataV1: key(1) | update_authority(32) | mint(32) | name | symbol | uri
 * | seller_fee_basis_points(2) | creators Option<Vec<Creator>> | primary_sale_happened(1)
 * | is_mutable(1) | ...
 *
 * `isMutable` is best-effort: if the tail cannot be walked we return null for it rather
 * than defaulting to false, because a false there would read as "immutable" — a pass we
 * did not measure.
 */
export function parseMetaplexMetadata(data) {
  const b = buf(data);
  if (b.length < 66) return null;
  if (b[0] !== 4) return null; // MetadataV1

  const updateAuthority = b58encode(b.subarray(1, 33));
  const mint = b58encode(b.subarray(33, 65));

  const name = borshString(b, 65);
  if (!name) return null;
  const symbol = borshString(b, name.next);
  if (!symbol) return null;
  const uri = borshString(b, symbol.next);
  if (!uri) return null;

  let off = uri.next;
  let isMutable = null;
  let primarySaleHappened = null;
  if (off + 2 <= b.length) {
    off += 2; // seller_fee_basis_points
    if (off < b.length) {
      const hasCreators = b[off];
      off += 1;
      if (hasCreators === 1 && off + 4 <= b.length) {
        const n = b.readUInt32LE(off);
        off += 4 + n * 34; // Creator = address(32) + verified(1) + share(1)
      }
      if (off + 1 < b.length) {
        primarySaleHappened = b[off] === 1;
        isMutable = b[off + 1] === 1;
      }
    }
  }

  return { updateAuthority, mint, name: name.value, symbol: symbol.value, uri: uri.value, primarySaleHappened, isMutable };
}

// ---------------------------------------------------------------------------
// ExtraAccountMetaList
// ---------------------------------------------------------------------------

/**
 * The TLV discriminator on an ExtraAccountMetaList account is the 8-byte SplDiscriminate
 * hash of "spl-transfer-hook-interface:execute" (the list is keyed by the instruction it
 * resolves accounts for). Computed rather than hardcoded so it stays checkable.
 */
export const EXTRA_ACCOUNT_META_LIST_DISCRIMINATOR = createHash('sha256')
  .update('spl-transfer-hook-interface:execute')
  .digest()
  .subarray(0, 8);

export const EXTRA_ACCOUNT_META_LEN = 35;

/** Human label for ExtraAccountMeta.discriminator, which selects how address_config resolves. */
function metaKind(disc) {
  if (disc === 0) return 'literal-pubkey';
  if (disc === 1) return 'pda-of-hook-program';
  if (disc >= 128) return `pda-of-account-at-index-${disc - 128}`;
  return `reserved(${disc})`;
}

/**
 * ExtraAccountMetaList account:
 *   [0..8)   TLV discriminator
 *   [8..12)  u32 LE value length
 *   [12..16) u32 LE count
 *   [16..)   count * 35-byte ExtraAccountMeta { discriminator u8, address_config [u8;32],
 *                                               is_signer u8, is_writable u8 }
 */
export function parseExtraAccountMetaList(data) {
  const b = buf(data);
  if (b.length < 16) return null;

  const discriminator = b.subarray(0, 8);
  const discriminatorMatches = discriminator.equals(EXTRA_ACCOUNT_META_LIST_DISCRIMINATOR);
  const valueLength = b.readUInt32LE(8);
  const count = b.readUInt32LE(12);

  // A corrupt or non-conforming account must not make us invent entries.
  const maxPossible = Math.floor((b.length - 16) / EXTRA_ACCOUNT_META_LEN);
  const readable = Math.min(count, maxPossible);

  const accounts = [];
  for (let i = 0; i < readable; i++) {
    const o = 16 + i * EXTRA_ACCOUNT_META_LEN;
    const disc = b[o];
    const config = b.subarray(o + 1, o + 33);
    accounts.push({
      index: i,
      kind: metaKind(disc),
      // address_config is only a literal pubkey when discriminator === 0; for the PDA
      // variants it is packed seed config, so we expose the raw hex instead of pretending.
      address: disc === 0 ? b58encode(config) : null,
      addressConfigHex: disc === 0 ? null : config.toString('hex'),
      isSigner: b[o + 33] === 1,
      isWritable: b[o + 34] === 1,
    });
  }

  return {
    discriminatorMatches,
    valueLength,
    count,
    accountsParsed: accounts.length,
    truncated: readable < count,
    accounts,
  };
}

// ---------------------------------------------------------------------------
// Program upgradeability
// ---------------------------------------------------------------------------

export const LOADERS = {
  BPFLoaderUpgradeab1e11111111111111111111111: 'bpf-upgradeable',
  BPFLoader2111111111111111111111111111111111: 'bpf-v2-immutable',
  BPFLoader1111111111111111111111111111111111: 'bpf-v1-immutable',
  LoaderV411111111111111111111111111111111111: 'loader-v4',
  NativeLoader1111111111111111111111111111111: 'native',
};

export const BPF_UPGRADEABLE_LOADER = 'BPFLoaderUpgradeab1e11111111111111111111111';
export const LOADER_V4 = 'LoaderV411111111111111111111111111111111111';

/**
 * UpgradeableLoaderState::Program — bincode enum tag 2 (u32 LE) then the ProgramData address.
 */
export function parseUpgradeableProgram(data) {
  const b = buf(data);
  if (b.length < 36) return null;
  if (b.readUInt32LE(0) !== 2) return null;
  return { programDataAddress: b58encode(b.subarray(4, 36)) };
}

/**
 * UpgradeableLoaderState::ProgramData — tag 3 (u32 LE), last_deploy slot (u64 LE),
 * then Option<Pubkey> upgrade_authority as a 1-byte bincode tag plus 32 bytes.
 *
 * `upgradeAuthority: null` here means the authority was explicitly burned — the program
 * is immutable. That is a genuine measured result, not a gap.
 */
export function parseProgramData(data) {
  const b = buf(data);
  if (b.length < 45) return null;
  if (b.readUInt32LE(0) !== 3) return null;

  const lastDeploySlot = b.readBigUInt64LE(4);
  const tag = b[12];
  if (tag !== 0 && tag !== 1) return null;

  return {
    lastDeploySlot,
    upgradeAuthority: tag === 1 ? b58encode(b.subarray(13, 45)) : null,
  };
}

export const LOADER_V4_STATUS = { 0: 'retracted', 1: 'deployed', 2: 'finalized' };

/**
 * LoaderV4State: slot (u64 LE), authority_address_or_next_version (32), status (u64 LE).
 * `finalized` is loader-v4's equivalent of a burned upgrade authority.
 */
export function parseLoaderV4State(data) {
  const b = buf(data);
  if (b.length < 48) return null;
  const status = Number(b.readBigUInt64LE(40));
  const statusName = LOADER_V4_STATUS[status] ?? `unknown(${status})`;
  return {
    lastDeploySlot: b.readBigUInt64LE(0),
    authority: statusName === 'finalized' ? null : b58encode(b.subarray(8, 40)),
    status: statusName,
  };
}
