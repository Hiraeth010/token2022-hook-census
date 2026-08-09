/**
 * enumerate.test.mjs — pure parts of the enumeration layer.
 *
 * Offline: no network, no RPC. Covers account classification (the gate every candidate
 * passes through) and the pubkey-window miner used against hook-program accounts.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  classifyAccount, pubkeyWindows, candidateHookOffsets,
  MINT_ACCOUNT_TYPE_B58, TRANSFER_HOOK_TLV_HEADER, TRANSFER_HOOK_TLV_HEADER_B58,
  accountKeysOf,
} from './enumerate.mjs';
import { b58decode, b58encode } from './crypto.mjs';
import { TOKEN_2022_PROGRAM, MINT_BASE_LEN, ACCOUNT_TYPE_OFFSET } from './tlv.mjs';

const KEY_A = 'So11111111111111111111111111111111111111112';
const KEY_B = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
const key = (s) => Buffer.from(b58decode(s));

function mintAccount(tlvs = [], { owner = TOKEN_2022_PROGRAM, accountType = 1 } = {}) {
  const data = Buffer.concat([
    Buffer.alloc(MINT_BASE_LEN),
    Buffer.alloc(ACCOUNT_TYPE_OFFSET - MINT_BASE_LEN),
    Buffer.from([accountType]),
    ...tlvs,
  ]);
  return { owner, data: [data.toString('base64'), 'base64'], executable: false };
}

function tlv(type, value) {
  const head = Buffer.alloc(4);
  head.writeUInt16LE(type, 0);
  head.writeUInt16LE(value.length, 2);
  return Buffer.concat([head, value]);
}

const hookValue = (authority, programId) => Buffer.concat([
  authority ? key(authority) : Buffer.alloc(32),
  programId ? key(programId) : Buffer.alloc(32),
]);

// ---------------------------------------------------------------------------
// memcmp filter encoding
// ---------------------------------------------------------------------------

test('memcmp filter bytes are base58-encoded, not raw', () => {
  // A raw "1" here would filter on the wrong bytes and silently return nothing.
  assert.deepEqual([...b58decode(MINT_ACCOUNT_TYPE_B58)], [1]);
  assert.deepEqual([...b58decode(TRANSFER_HOOK_TLV_HEADER_B58)], [...TRANSFER_HOOK_TLV_HEADER]);
});

test('TransferHook TLV header encodes type 14 and length 64 little-endian', () => {
  assert.deepEqual([...TRANSFER_HOOK_TLV_HEADER], [14, 0, 64, 0]);
});

test('candidateHookOffsets starts at the TLV region and grows with depth', () => {
  const d1 = candidateHookOffsets(1);
  const d2 = candidateHookOffsets(2);
  assert.ok(d1.includes(166), 'the first extension sits at offset 166');
  assert.ok(d2.length > d1.length);
  assert.deepEqual(d2, [...d2].sort((a, b) => a - b), 'offsets must be sorted');
  assert.equal(new Set(d2).size, d2.length, 'offsets must be deduplicated');
});

// ---------------------------------------------------------------------------
// classifyAccount
// ---------------------------------------------------------------------------

test('classifyAccount reports a missing account as absent, not as unhooked', () => {
  assert.deepEqual(classifyAccount(null), { kind: 'absent' });
});

test('classifyAccount rejects accounts owned by another program', () => {
  const c = classifyAccount(mintAccount([], { owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }));
  assert.equal(c.kind, 'not-token-2022');
});

test('classifyAccount rejects a Token-2022 token account', () => {
  assert.equal(classifyAccount(mintAccount([], { accountType: 2 })).kind, 'not-a-mint');
});

test('classifyAccount marks a mint with no TransferHook as hooked:false', () => {
  const c = classifyAccount(mintAccount([tlv(3, key(KEY_A))]));
  assert.equal(c.kind, 'mint');
  assert.equal(c.hooked, false);
});

test('classifyAccount extracts the hook and records its TLV offset', () => {
  const c = classifyAccount(mintAccount([tlv(14, hookValue(KEY_A, KEY_B))]));
  assert.equal(c.hooked, true);
  assert.equal(c.hook.authority, KEY_A);
  assert.equal(c.hook.programId, KEY_B);
  assert.equal(c.hookTlvOffset, 166);
});

test('classifyAccount keeps hooked:true when program_id is null but authority is live', () => {
  // The dominant real-world shape: extension present, no program attached, key retained.
  const c = classifyAccount(mintAccount([tlv(14, hookValue(KEY_A, null))]));
  assert.equal(c.hooked, true);
  assert.equal(c.hook.programId, null);
  assert.equal(c.hook.authority, KEY_A);
});

// ---------------------------------------------------------------------------
// pubkeyWindows
// ---------------------------------------------------------------------------

test('pubkeyWindows finds an embedded pubkey at an arbitrary offset', () => {
  const data = Buffer.concat([Buffer.alloc(11, 0xab), key(KEY_A), Buffer.alloc(7, 0xcd)]);
  assert.ok(pubkeyWindows(data).has(KEY_A));
});

test('pubkeyWindows skips all-zero windows so nothing decodes to the System Program', () => {
  const windows = pubkeyWindows(Buffer.alloc(128));
  assert.equal(windows.size, 0);
  assert.ok(!windows.has('11111111111111111111111111111111'));
});

test('pubkeyWindows respects stride and can therefore miss unaligned keys', () => {
  // Documents a real trade-off: a stride above 1 is cheaper and incomplete.
  const data = Buffer.concat([Buffer.alloc(3, 0xff), key(KEY_A)]);
  assert.ok(pubkeyWindows(data, { stride: 1 }).has(KEY_A));
  assert.ok(!pubkeyWindows(data, { stride: 8 }).has(KEY_A));
});

test('pubkeyWindows returns nothing for data shorter than a pubkey', () => {
  assert.equal(pubkeyWindows(Buffer.alloc(31, 1)).size, 0);
});

test('pubkeyWindows deduplicates a key that appears twice', () => {
  const data = Buffer.concat([key(KEY_A), key(KEY_A)]);
  const w = pubkeyWindows(data);
  assert.equal([...w].filter((k) => k === KEY_A).length, 1);
});

// ---------------------------------------------------------------------------
// accountKeysOf
// ---------------------------------------------------------------------------

test('accountKeysOf includes address-lookup-table addresses', () => {
  // A hooked mint referenced only through an ALT would be invisible without this.
  const tx = {
    transaction: { message: { accountKeys: [{ pubkey: KEY_A }, 'ignored-non-pubkey-shape'] } },
    meta: { loadedAddresses: { writable: [KEY_B], readonly: [] } },
  };
  const keys = accountKeysOf(tx);
  assert.ok(keys.includes(KEY_A));
  assert.ok(keys.includes(KEY_B), 'lookup-table addresses must be harvested too');
});

test('accountKeysOf tolerates a malformed transaction without throwing', () => {
  assert.deepEqual(accountKeysOf(null), []);
  assert.deepEqual(accountKeysOf({}), []);
});
