/**
 * tlv.test.mjs — the parser is the thing most likely to be silently wrong, so it is
 * tested two independent ways:
 *
 *  1. Synthetic fixtures built by an encoder written directly from the spec below. The
 *     encoder is deliberately NOT shared with the parser — if both drifted the same way
 *     the test would pass while the data was wrong, so they are written separately.
 *  2. Golden fixtures: real mainnet account bytes captured in fixtures.json, asserted
 *     against values that are independently checkable on any block explorer.
 *
 * No network access — `node --test` must pass offline.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

import {
  parseMintBase, parseMintExtensions, parseTransferHook, parseMetadataPointer,
  parseTokenMetadata, parseMetaplexMetadata, parseExtraAccountMetaList,
  parseUpgradeableProgram, parseProgramData, parseLoaderV4State,
  accountKind, extensionName, findExtension,
  EXT_TRANSFER_HOOK, EXT_TOKEN_METADATA, EXT_METADATA_POINTER,
  EXTRA_ACCOUNT_META_LIST_DISCRIMINATOR,
  MINT_BASE_LEN, ACCOUNT_TYPE_OFFSET, TLV_START_OFFSET, TOKEN_2022_PROGRAM,
} from './tlv.mjs';
import { b58decode, b58encode } from './crypto.mjs';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures.json', import.meta.url), 'utf8'));

// ---------------------------------------------------------------------------
// Independent encoder, written from the spec, not from the parser.
// ---------------------------------------------------------------------------

const KEY_A = 'So11111111111111111111111111111111111111112';
const KEY_B = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
const KEY_C = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const key = (s) => Buffer.from(b58decode(s));

/** COption<Pubkey>: u32 LE tag + 32 bytes. */
function encodeCOption(pubkey) {
  const b = Buffer.alloc(36);
  if (pubkey) { b.writeUInt32LE(1, 0); key(pubkey).copy(b, 4); }
  return b;
}

/** 82-byte base mint. */
function encodeMintBase({ mintAuthority = null, supply = 0n, decimals = 0, initialized = true, freezeAuthority = null }) {
  const b = Buffer.alloc(MINT_BASE_LEN);
  encodeCOption(mintAuthority).copy(b, 0);
  b.writeBigUInt64LE(supply, 36);
  b[44] = decimals;
  b[45] = initialized ? 1 : 0;
  encodeCOption(freezeAuthority).copy(b, 46);
  return b;
}

/** One TLV entry: u16 LE type, u16 LE length, value. */
function encodeTlv(type, value) {
  const head = Buffer.alloc(4);
  head.writeUInt16LE(type, 0);
  head.writeUInt16LE(value.length, 2);
  return Buffer.concat([head, value]);
}

/** Assemble a full Token-2022 mint account: base | pad to 165 | AccountType | TLVs. */
function encodeMintAccount(baseOpts, tlvs, { accountType = 1, trailingZeros = 0 } = {}) {
  const parts = [
    encodeMintBase(baseOpts),
    Buffer.alloc(ACCOUNT_TYPE_OFFSET - MINT_BASE_LEN), // padding
    Buffer.from([accountType]),
    ...tlvs,
  ];
  if (trailingZeros > 0) parts.push(Buffer.alloc(trailingZeros));
  return Buffer.concat(parts);
}

/** MaybeNull<Address>: 32 bytes, all zero means none. */
const maybeNull = (k) => (k ? key(k) : Buffer.alloc(32));

const encodeTransferHook = (authority, programId) => Buffer.concat([maybeNull(authority), maybeNull(programId)]);

function borshStr(s) {
  const body = Buffer.from(s, 'utf8');
  const len = Buffer.alloc(4);
  len.writeUInt32LE(body.length, 0);
  return Buffer.concat([len, body]);
}

function encodeTokenMetadata({ updateAuthority, mint, name, symbol, uri, additional = [] }) {
  const count = Buffer.alloc(4);
  count.writeUInt32LE(additional.length, 0);
  return Buffer.concat([
    maybeNull(updateAuthority), key(mint),
    borshStr(name), borshStr(symbol), borshStr(uri),
    count, ...additional.flatMap(([k2, v]) => [borshStr(k2), borshStr(v)]),
  ]);
}

// ---------------------------------------------------------------------------
// Base mint
// ---------------------------------------------------------------------------

test('parseMintBase reads authorities, supply and decimals', () => {
  const data = encodeMintBase({ mintAuthority: KEY_A, supply: 123456789n, decimals: 9, freezeAuthority: KEY_B });
  const p = parseMintBase(data);
  assert.equal(p.mintAuthority, KEY_A);
  assert.equal(p.freezeAuthority, KEY_B);
  assert.equal(p.supply, 123456789n);
  assert.equal(p.decimals, 9);
  assert.equal(p.isInitialized, true);
});

test('parseMintBase distinguishes a burned authority (COption None) from a real key', () => {
  const p = parseMintBase(encodeMintBase({ mintAuthority: null, freezeAuthority: null }));
  assert.equal(p.mintAuthority, null);
  assert.equal(p.freezeAuthority, null);
});

test('parseMintBase keeps a u64 supply exact (would lose precision as a Number)', () => {
  const big = 18_446_744_073_709_551_615n; // u64::MAX
  const p = parseMintBase(encodeMintBase({ supply: big }));
  assert.equal(p.supply, big);
  assert.equal(typeof p.supply, 'bigint');
});

test('parseMintBase returns null on a short buffer rather than guessing', () => {
  assert.equal(parseMintBase(Buffer.alloc(40)), null);
});

// ---------------------------------------------------------------------------
// TLV walk
// ---------------------------------------------------------------------------

test('accountKind classifies an exactly-82-byte account as a legacy mint', () => {
  assert.equal(accountKind(encodeMintBase({})), 'legacy-mint');
});

test('accountKind reads the discriminator at offset 165', () => {
  assert.equal(accountKind(encodeMintAccount({}, [], { accountType: 1 })), 'mint');
  assert.equal(accountKind(encodeMintAccount({}, [], { accountType: 2 })), 'account');
});

test('parseMintExtensions walks multiple TLV entries in order', () => {
  const data = encodeMintAccount({ decimals: 6 }, [
    encodeTlv(3, key(KEY_A)),                              // MintCloseAuthority, 32 bytes
    encodeTlv(EXT_TRANSFER_HOOK, encodeTransferHook(KEY_A, KEY_B)),
    encodeTlv(EXT_METADATA_POINTER, Buffer.concat([maybeNull(KEY_A), maybeNull(KEY_C)])),
  ]);
  const p = parseMintExtensions(data);
  assert.equal(p.accountKind, 'mint');
  assert.equal(p.truncated, false);
  assert.deepEqual(p.entries.map((e) => e.type), [3, EXT_TRANSFER_HOOK, EXT_METADATA_POINTER]);
  assert.deepEqual(p.entries.map((e) => e.length), [32, 64, 64]);
  // First entry's value starts right after the account-type byte plus its own 4-byte header.
  assert.equal(p.entries[0].offset, TLV_START_OFFSET + 4);
});

test('parseMintExtensions returns an empty extension list for a legacy 82-byte mint', () => {
  const p = parseMintExtensions(encodeMintBase({}));
  assert.equal(p.accountKind, 'legacy-mint');
  assert.deepEqual(p.entries, []);
});

test('parseMintExtensions stops at trailing zero padding without inventing an extension', () => {
  const data = encodeMintAccount({}, [encodeTlv(EXT_TRANSFER_HOOK, encodeTransferHook(KEY_A, KEY_B))], { trailingZeros: 64 });
  const p = parseMintExtensions(data);
  assert.equal(p.entries.length, 1);
  assert.equal(p.truncated, false);
});

test('parseMintExtensions flags truncation when a declared length runs past the buffer', () => {
  // Declare a 64-byte TransferHook but supply only 10 bytes of value.
  const head = Buffer.alloc(4);
  head.writeUInt16LE(EXT_TRANSFER_HOOK, 0);
  head.writeUInt16LE(64, 2);
  const data = Buffer.concat([
    encodeMintBase({}), Buffer.alloc(ACCOUNT_TYPE_OFFSET - MINT_BASE_LEN), Buffer.from([1]),
    head, Buffer.alloc(10),
  ]);
  const p = parseMintExtensions(data);
  assert.equal(p.truncated, true, 'a truncated TLV must be reported, not silently dropped');
  assert.equal(p.entries.length, 0);
});

test('parseMintExtensions returns null for a token account rather than parsing it as a mint', () => {
  assert.equal(parseMintExtensions(encodeMintAccount({}, [], { accountType: 2 })), null);
});

test('extensionName labels unknown discriminants instead of throwing', () => {
  assert.equal(extensionName(EXT_TRANSFER_HOOK), 'TransferHook');
  assert.equal(extensionName(9999), 'Unknown(9999)');
});

// ---------------------------------------------------------------------------
// TransferHook
// ---------------------------------------------------------------------------

test('parseTransferHook reads authority and program_id', () => {
  const p = parseTransferHook(encodeTransferHook(KEY_A, KEY_B));
  assert.equal(p.authority, KEY_A);
  assert.equal(p.programId, KEY_B);
});

test('parseTransferHook maps an all-zero field to null, not to the system program', () => {
  const p = parseTransferHook(encodeTransferHook(null, null));
  assert.equal(p.authority, null);
  assert.equal(p.programId, null);
  // The all-zero pubkey base58-encodes to the system program id; conflating the two would
  // report "hook calls the system program" for what is actually "no hook program set".
  assert.notEqual(p.programId, '11111111111111111111111111111111');
});

test('parseTransferHook keeps a live authority visible when program_id is null', () => {
  // This is the armed-but-unloaded case: no program runs today, but one key can set one.
  const p = parseTransferHook(encodeTransferHook(KEY_A, null));
  assert.equal(p.authority, KEY_A);
  assert.equal(p.programId, null);
});

test('parseTransferHook returns null on a short value', () => {
  assert.equal(parseTransferHook(Buffer.alloc(63)), null);
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

test('parseTokenMetadata reads borsh strings and additional metadata pairs', () => {
  const value = encodeTokenMetadata({
    updateAuthority: KEY_A, mint: KEY_C,
    name: 'Test Token', symbol: 'TEST', uri: 'https://example.com/t.json',
    additional: [['a', '1'], ['b', '2']],
  });
  const p = parseTokenMetadata(value);
  assert.equal(p.name, 'Test Token');
  assert.equal(p.symbol, 'TEST');
  assert.equal(p.uri, 'https://example.com/t.json');
  assert.equal(p.updateAuthority, KEY_A);
  assert.equal(p.mint, KEY_C);
  assert.deepEqual(p.additionalMetadata, [['a', '1'], ['b', '2']]);
});

test('parseTokenMetadata reports a null update authority when it is zeroed', () => {
  const p = parseTokenMetadata(encodeTokenMetadata({
    updateAuthority: null, mint: KEY_C, name: 'X', symbol: 'X', uri: '',
  }));
  assert.equal(p.updateAuthority, null);
});

test('parseTokenMetadata refuses a bogus length prefix instead of over-reading', () => {
  const bad = Buffer.concat([maybeNull(KEY_A), key(KEY_C), Buffer.from([0xff, 0xff, 0xff, 0x7f])]);
  assert.equal(parseTokenMetadata(bad), null);
});

test('parseMetadataPointer reads both fields with null handling', () => {
  const p = parseMetadataPointer(Buffer.concat([maybeNull(null), maybeNull(KEY_C)]));
  assert.equal(p.authority, null);
  assert.equal(p.metadataAddress, KEY_C);
});

test('parseMetaplexMetadata strips NUL padding from fixed-width strings', () => {
  const data = Buffer.concat([
    Buffer.from([4]), key(KEY_A), key(KEY_C),
    borshStr('Padded Name'.padEnd(32, '\0')),
    borshStr('PAD'.padEnd(10, '\0')),
    borshStr('https://x'.padEnd(200, '\0')),
    Buffer.from([0, 0]),   // seller_fee_basis_points
    Buffer.from([0]),      // creators: None
    Buffer.from([0]),      // primary_sale_happened
    Buffer.from([1]),      // is_mutable
  ]);
  const p = parseMetaplexMetadata(data);
  assert.equal(p.name, 'Padded Name');
  assert.equal(p.symbol, 'PAD');
  assert.equal(p.uri, 'https://x');
  assert.equal(p.isMutable, true);
});

test('parseMetaplexMetadata rejects a non-MetadataV1 key byte', () => {
  const data = Buffer.concat([Buffer.from([7]), key(KEY_A), key(KEY_C), borshStr('n'), borshStr('s'), borshStr('u')]);
  assert.equal(parseMetaplexMetadata(data), null);
});

// ---------------------------------------------------------------------------
// ExtraAccountMetaList
// ---------------------------------------------------------------------------

test('ExtraAccountMetaList discriminator is sha256("spl-transfer-hook-interface:execute")[0..8]', () => {
  const expected = createHash('sha256').update('spl-transfer-hook-interface:execute').digest().subarray(0, 8);
  assert.deepEqual(Buffer.from(EXTRA_ACCOUNT_META_LIST_DISCRIMINATOR), expected);
});

function encodeExtraAccountMetaList(metas, { discriminator = EXTRA_ACCOUNT_META_LIST_DISCRIMINATOR, count = null } = {}) {
  const body = Buffer.concat(metas.map((m) => {
    const b = Buffer.alloc(35);
    b[0] = m.discriminator;
    Buffer.from(m.addressConfig).copy(b, 1);
    b[33] = m.isSigner ? 1 : 0;
    b[34] = m.isWritable ? 1 : 0;
    return b;
  }));
  const header = Buffer.alloc(8);
  header.writeUInt32LE(4 + body.length, 0);           // value length
  header.writeUInt32LE(count ?? metas.length, 4);     // count
  return Buffer.concat([Buffer.from(discriminator), header, body]);
}

test('parseExtraAccountMetaList reads count and per-account flags', () => {
  const data = encodeExtraAccountMetaList([
    { discriminator: 0, addressConfig: key(KEY_A), isSigner: false, isWritable: false },
    { discriminator: 1, addressConfig: Buffer.alloc(32, 7), isSigner: false, isWritable: true },
    { discriminator: 129, addressConfig: Buffer.alloc(32, 9), isSigner: true, isWritable: false },
  ]);
  const p = parseExtraAccountMetaList(data);
  assert.equal(p.discriminatorMatches, true);
  assert.equal(p.count, 3);
  assert.equal(p.accountsParsed, 3);
  assert.equal(p.truncated, false);

  assert.equal(p.accounts[0].kind, 'literal-pubkey');
  assert.equal(p.accounts[0].address, KEY_A);

  // A PDA-config entry must NOT be presented as if it were a pubkey.
  assert.equal(p.accounts[1].kind, 'pda-of-hook-program');
  assert.equal(p.accounts[1].address, null);
  assert.equal(p.accounts[1].isWritable, true);

  assert.equal(p.accounts[2].kind, 'pda-of-account-at-index-1');
  assert.equal(p.accounts[2].isSigner, true);
});

test('parseExtraAccountMetaList flags a count larger than the buffer instead of fabricating entries', () => {
  const data = encodeExtraAccountMetaList(
    [{ discriminator: 0, addressConfig: key(KEY_A), isSigner: false, isWritable: false }],
    { count: 50 },
  );
  const p = parseExtraAccountMetaList(data);
  assert.equal(p.count, 50);
  assert.equal(p.accountsParsed, 1);
  assert.equal(p.truncated, true);
});

test('parseExtraAccountMetaList reports a wrong discriminator rather than rejecting outright', () => {
  const data = encodeExtraAccountMetaList([], { discriminator: Buffer.alloc(8, 1) });
  const p = parseExtraAccountMetaList(data);
  assert.equal(p.discriminatorMatches, false);
});

// ---------------------------------------------------------------------------
// Program upgradeability — the columns the census exists for
// ---------------------------------------------------------------------------

function encodeUpgradeableProgram(programDataAddress) {
  const b = Buffer.alloc(36);
  b.writeUInt32LE(2, 0);
  key(programDataAddress).copy(b, 4);
  return b;
}

function encodeProgramData(slot, upgradeAuthority) {
  const b = Buffer.alloc(45);
  b.writeUInt32LE(3, 0);
  b.writeBigUInt64LE(slot, 4);
  if (upgradeAuthority) { b[12] = 1; key(upgradeAuthority).copy(b, 13); } else { b[12] = 0; }
  return b;
}

test('parseUpgradeableProgram extracts the ProgramData address', () => {
  const p = parseUpgradeableProgram(encodeUpgradeableProgram(KEY_B));
  assert.equal(p.programDataAddress, KEY_B);
});

test('parseUpgradeableProgram rejects a non-Program enum tag', () => {
  const b = Buffer.alloc(36);
  b.writeUInt32LE(1, 0); // Buffer, not Program
  assert.equal(parseUpgradeableProgram(b), null);
});

test('parseProgramData reports a LIVE upgrade authority', () => {
  const p = parseProgramData(encodeProgramData(300_000_000n, KEY_A));
  assert.equal(p.upgradeAuthority, KEY_A);
  assert.equal(p.lastDeploySlot, 300_000_000n);
});

test('parseProgramData reports a BURNED upgrade authority as null', () => {
  const p = parseProgramData(encodeProgramData(250n, null));
  assert.equal(p.upgradeAuthority, null, 'Option::None must mean immutable, and must be distinguishable from unmeasured');
  assert.equal(p.lastDeploySlot, 250n);
});

test('parseProgramData returns null on an invalid Option tag rather than assuming immutable', () => {
  const b = encodeProgramData(1n, null);
  b[12] = 9; // neither 0 nor 1
  assert.equal(parseProgramData(b), null, 'an unparseable authority must be unmeasured, never a pass');
});

function encodeLoaderV4(slot, authority, status) {
  const b = Buffer.alloc(48);
  b.writeBigUInt64LE(slot, 0);
  key(authority).copy(b, 8);
  b.writeBigUInt64LE(BigInt(status), 40);
  return b;
}

test('parseLoaderV4State treats finalized as immutable and clears the authority', () => {
  const p = parseLoaderV4State(encodeLoaderV4(999n, KEY_A, 2));
  assert.equal(p.status, 'finalized');
  assert.equal(p.authority, null);
});

test('parseLoaderV4State keeps the authority for a deployed (still upgradeable) program', () => {
  const p = parseLoaderV4State(encodeLoaderV4(999n, KEY_A, 1));
  assert.equal(p.status, 'deployed');
  assert.equal(p.authority, KEY_A);
});

// ---------------------------------------------------------------------------
// Golden fixtures — real mainnet bytes
// ---------------------------------------------------------------------------

test('golden: PYUSD mainnet mint parses with the expected extension set', () => {
  const f = fixtures.accounts.pyusd;
  assert.equal(f.owner, TOKEN_2022_PROGRAM);
  const data = Buffer.from(f.dataBase64, 'base64');

  const p = parseMintExtensions(data);
  assert.equal(p.accountKind, 'mint');
  assert.equal(p.truncated, false);

  const types = p.entries.map((e) => e.type);
  // Independently checkable on any explorer that lists Token-2022 extensions.
  assert.deepEqual(types, [3, 12, 1, 4, 16, EXT_TRANSFER_HOOK, EXT_METADATA_POINTER, EXT_TOKEN_METADATA]);

  const base = parseMintBase(data);
  assert.equal(base.decimals, 6);
  assert.equal(typeof base.supply, 'bigint');
});

test('golden: PYUSD carries a TransferHook whose program_id is null but whose authority is live', () => {
  const data = Buffer.from(fixtures.accounts.pyusd.dataBase64, 'base64');
  const entry = findExtension(parseMintExtensions(data), EXT_TRANSFER_HOOK);
  assert.ok(entry, 'PYUSD must carry extension 14');
  assert.equal(entry.length, 64);

  const hook = parseTransferHook(entry.value);
  assert.equal(hook.programId, null, 'no hook program is attached today');
  assert.equal(hook.authority, '2apBGMsS6ti9RyF5TwQTDswXBWskiJP2LD4cUEDqYJjk');
});

test('golden: PYUSD TokenMetadata extension yields the real name and symbol', () => {
  const data = Buffer.from(fixtures.accounts.pyusd.dataBase64, 'base64');
  const entry = findExtension(parseMintExtensions(data), EXT_TOKEN_METADATA);
  const md = parseTokenMetadata(entry.value);
  assert.equal(md.name, 'PayPal USD');
  assert.equal(md.symbol, 'PYUSD');
  assert.equal(md.mint, fixtures.accounts.pyusd.address);
  assert.ok(md.uri.startsWith('https://token-metadata.paxos.com/'));
});

test('golden: BonkEarn has a transfer FEE but no transfer HOOK', () => {
  // Guards against the easy mistake of treating "has Token-2022 extensions" as "has a hook".
  const data = Buffer.from(fixtures.accounts.bonkearn.dataBase64, 'base64');
  const p = parseMintExtensions(data);
  assert.deepEqual(p.entries.map((e) => e.type), [1]);
  assert.equal(findExtension(p, EXT_TRANSFER_HOOK), null);
});

test('golden: legacy USDC is not a Token-2022 account at all', () => {
  const f = fixtures.accounts.usdc_legacy;
  assert.notEqual(f.owner, TOKEN_2022_PROGRAM);
  const data = Buffer.from(f.dataBase64, 'base64');
  assert.equal(data.length, MINT_BASE_LEN);
  assert.equal(accountKind(data), 'legacy-mint');
});
