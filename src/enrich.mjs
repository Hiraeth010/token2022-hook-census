/**
 * enrich.mjs — per-mint detail for rows the enumeration step found.
 *
 * The upgrade-authority columns are the reason this census exists, so they are the most
 * carefully hedged. Three outcomes are kept strictly distinct and must never be collapsed:
 *
 *   upgradeable: true   measured — a live key can replace the hook's code
 *   upgradeable: false  measured — the authority is burned, or the loader has no upgrade path
 *   upgradeable: null   NOT MEASURED — render as `not covered`, never as safe
 */

import { getAccountInfo, getProgramAccountsOrThrow } from './rpc.mjs';
import { extraAccountMetasPda, metaplexMetadataPda, METAPLEX_METADATA_PROGRAM } from './crypto.mjs';
import {
  parseTokenMetadata, parseMetadataPointer, parseMetaplexMetadata,
  parseExtraAccountMetaList, parseUpgradeableProgram, parseProgramData, parseLoaderV4State,
  findExtension, EXT_TOKEN_METADATA, EXT_METADATA_POINTER,
  LOADERS, BPF_UPGRADEABLE_LOADER, LOADER_V4, TOKEN_2022_PROGRAM, ACCOUNT_TYPE_OFFSET,
} from './tlv.mjs';
import { b58encode } from './crypto.mjs';

/** Read an account through the cache. Returns `{ value, slot }`, or null if the fetch failed. */
async function cachedAccount(address, cache) {
  const hit = cache ? await cache.getAccount(address) : null;
  if (hit) return { value: hit.value, slot: hit.slot };
  const res = await getAccountInfo(address);
  if (!res) return null;
  if (cache) await cache.putAccount(address, res.value, res.slot);
  return res;
}

// ---------------------------------------------------------------------------
// Hook program upgradeability
// ---------------------------------------------------------------------------

/**
 * Determine whether a hook program's code can still be replaced, and by whom.
 *
 * Returns an object whose `upgradeable` field is true / false / null, where null always
 * means "we could not measure this" and carries a `note` explaining why.
 */
export async function inspectHookProgram(programId, { cache } = {}) {
  const base = {
    programId,
    loader: null,
    executable: null,
    upgradeable: null,
    upgradeAuthority: null,
    lastDeploySlot: null,
    programDataAddress: null,
    note: null,
  };

  const res = await cachedAccount(programId, cache);
  if (!res) return { ...base, note: 'RPC fetch failed — not covered' };

  if (!res.value) {
    // The mint names a hook program that does not exist on this cluster. Transfers that
    // route through it cannot succeed; this is a measured fact, not a gap.
    return { ...base, executable: false, note: 'hook program account does not exist on mainnet' };
  }

  const owner = res.value.owner;
  const loader = LOADERS[owner] ?? `unknown-loader(${owner})`;
  const out = { ...base, loader, executable: res.value.executable === true };

  if (owner === BPF_UPGRADEABLE_LOADER) {
    let data;
    try { data = Buffer.from(res.value.data[0], 'base64'); } catch { return { ...out, note: 'undecodable program account' }; }

    const prog = parseUpgradeableProgram(data);
    if (!prog) return { ...out, note: 'program account did not parse as UpgradeableLoaderState::Program' };

    out.programDataAddress = prog.programDataAddress;
    const pdRes = await cachedAccount(prog.programDataAddress, cache);
    if (!pdRes) return { ...out, note: 'ProgramData fetch failed — upgradeability not covered' };
    if (!pdRes.value) return { ...out, note: 'ProgramData account missing — upgradeability not covered' };

    let pdData;
    try { pdData = Buffer.from(pdRes.value.data[0], 'base64'); } catch { return { ...out, note: 'undecodable ProgramData' }; }

    const pd = parseProgramData(pdData);
    if (!pd) return { ...out, note: 'ProgramData did not parse — upgradeability not covered' };

    return {
      ...out,
      upgradeable: pd.upgradeAuthority !== null,
      upgradeAuthority: pd.upgradeAuthority,
      lastDeploySlot: pd.lastDeploySlot === null ? null : Number(pd.lastDeploySlot),
      note: pd.upgradeAuthority === null ? 'upgrade authority burned — immutable' : null,
    };
  }

  if (owner === LOADER_V4) {
    let data;
    try { data = Buffer.from(res.value.data[0], 'base64'); } catch { return { ...out, note: 'undecodable loader-v4 account' }; }
    const st = parseLoaderV4State(data);
    if (!st) return { ...out, note: 'loader-v4 state did not parse — upgradeability not covered' };
    return {
      ...out,
      upgradeable: st.status !== 'finalized',
      upgradeAuthority: st.authority,
      lastDeploySlot: Number(st.lastDeploySlot),
      note: `loader-v4 status: ${st.status}`,
    };
  }

  if (owner === 'BPFLoader2111111111111111111111111111111111' ||
      owner === 'BPFLoader1111111111111111111111111111111111') {
    // These loaders have no upgrade instruction at all, so the code is fixed.
    // Deploy slot is genuinely unavailable from the account, so it stays null.
    return { ...out, upgradeable: false, note: 'non-upgradeable loader — code is fixed; deploy slot not recoverable from account' };
  }

  if (owner === 'NativeLoader1111111111111111111111111111111') {
    return { ...out, upgradeable: false, note: 'native program' };
  }

  return { ...out, note: `unrecognised program owner ${owner} — upgradeability not covered` };
}

// ---------------------------------------------------------------------------
// ExtraAccountMetaList
// ---------------------------------------------------------------------------

/**
 * Derive ["extra-account-metas", mint] under the hook program and read it.
 * `exists: false` is a measurement; `exists: null` means we could not look.
 */
export async function inspectExtraAccountMetaList(mint, hookProgramId, { cache } = {}) {
  const pda = extraAccountMetasPda(mint, hookProgramId);
  if (!pda) return { address: null, exists: null, note: 'PDA derivation failed — not covered' };

  const res = await cachedAccount(pda.address, cache);
  if (!res) return { address: pda.address, bump: pda.bump, exists: null, note: 'RPC fetch failed — not covered' };
  if (!res.value) {
    return {
      address: pda.address, bump: pda.bump, exists: false, owner: null, list: null,
      note: 'no ExtraAccountMetaList account at the derived PDA',
    };
  }

  let data;
  try { data = Buffer.from(res.value.data[0], 'base64'); } catch {
    return { address: pda.address, bump: pda.bump, exists: true, list: null, note: 'undecodable account data' };
  }

  const list = parseExtraAccountMetaList(data);
  return {
    address: pda.address,
    bump: pda.bump,
    exists: true,
    owner: res.value.owner,
    dataLength: data.length,
    list,
    note: list?.discriminatorMatches === false
      ? 'account exists at the PDA but its TLV discriminator is not the transfer-hook Execute discriminator'
      : null,
  };
}

// ---------------------------------------------------------------------------
// Name / symbol
// ---------------------------------------------------------------------------

/**
 * Resolve a name and symbol, recording which of the three possible sources it came from.
 * Returns `{ name, symbol, uri, source, updateAuthority }` with source 'token-metadata-extension',
 * 'metadata-pointer', 'metaplex', or 'none'.
 */
export async function resolveMetadata(mint, extensions, { cache } = {}) {
  const none = { name: null, symbol: null, uri: null, source: 'none', updateAuthority: null };

  // 1. TokenMetadata stored inside the mint itself — authoritative and free.
  const inline = findExtension({ entries: extensions }, EXT_TOKEN_METADATA);
  if (inline) {
    const md = parseTokenMetadata(inline.value);
    if (md) {
      return {
        name: md.name, symbol: md.symbol, uri: md.uri,
        source: 'token-metadata-extension', updateAuthority: md.updateAuthority,
      };
    }
  }

  // 2. MetadataPointer aimed somewhere other than the mint.
  const ptr = findExtension({ entries: extensions }, EXT_METADATA_POINTER);
  if (ptr) {
    const p = parseMetadataPointer(ptr.value);
    if (p?.metadataAddress && p.metadataAddress !== mint) {
      const res = await cachedAccount(p.metadataAddress, cache);
      if (res?.value) {
        let data = null;
        try { data = Buffer.from(res.value.data[0], 'base64'); } catch { /* fall through */ }
        if (data) {
          if (res.value.owner === METAPLEX_METADATA_PROGRAM) {
            const mp = parseMetaplexMetadata(data);
            if (mp) return { name: mp.name, symbol: mp.symbol, uri: mp.uri, source: 'metadata-pointer', updateAuthority: mp.updateAuthority };
          }
          // A token-metadata-interface account: 8-byte discriminator + u32 length, then the struct.
          const md = data.length > 12 ? parseTokenMetadata(data.subarray(12)) : null;
          if (md) return { name: md.name, symbol: md.symbol, uri: md.uri, source: 'metadata-pointer', updateAuthority: md.updateAuthority };
        }
      }
    }
  }

  // 3. Metaplex PDA.
  const pda = metaplexMetadataPda(mint);
  if (pda) {
    const res = await cachedAccount(pda.address, cache);
    if (res?.value) {
      try {
        const mp = parseMetaplexMetadata(Buffer.from(res.value.data[0], 'base64'));
        if (mp) return { name: mp.name, symbol: mp.symbol, uri: mp.uri, source: 'metaplex', updateAuthority: mp.updateAuthority };
      } catch { /* fall through to none */ }
    }
  }

  return none;
}

// ---------------------------------------------------------------------------
// Holder count
// ---------------------------------------------------------------------------

/**
 * Count Token-2022 token accounts holding a non-zero balance of `mint`.
 *
 * Needs getProgramAccounts. Two queries because a Token-2022 token account may or may not
 * carry extensions: plain accounts are exactly 165 bytes, extended ones are longer and
 * carry AccountType::Account (2) at offset 165.
 *
 * Returns null when GPA is unavailable — the census then prints `not covered`, never 0.
 */
export async function getHolderCountToken2022(mint) {
  const AMOUNT_OFFSET = 64;
  try {
    const [plain, extended] = await Promise.all([
      getProgramAccountsOrThrow(TOKEN_2022_PROGRAM, {
        dataSlice: { offset: AMOUNT_OFFSET, length: 8 },
        filters: [{ dataSize: 165 }, { memcmp: { offset: 0, bytes: mint } }],
      }, { timeoutMs: 120_000 }),
      getProgramAccountsOrThrow(TOKEN_2022_PROGRAM, {
        dataSlice: { offset: AMOUNT_OFFSET, length: 8 },
        filters: [
          { memcmp: { offset: 0, bytes: mint } },
          { memcmp: { offset: ACCOUNT_TYPE_OFFSET, bytes: b58encode(Uint8Array.from([2])) } },
        ],
      }, { timeoutMs: 120_000 }),
    ]);

    let nonZero = 0;
    let total = 0;
    for (const acc of [...plain, ...extended]) {
      total++;
      const buf = Buffer.from(acc.account.data[0], 'base64');
      if (buf.length >= 8 && buf.readBigUInt64LE(0) > 0n) nonZero++;
    }
    return { holders: nonZero, tokenAccounts: total, method: 'getProgramAccounts' };
  } catch (err) {
    console.error(`[enrich] holder count for ${mint} unavailable: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Row assembly
// ---------------------------------------------------------------------------

/**
 * Build one census row. `classification` comes from enumerate.classifyAccount.
 * Every field that could not be measured is explicitly null with a note, so the renderer
 * can print `not covered` rather than an implied pass.
 */
export async function buildRow(mint, classification, {
  cache, includeHolders = false, discoveredBy = 'unknown', log = () => {},
} = {}) {
  const hook = classification.hook;
  const extensions = classification.extensions.map((e) => ({ type: e.type, name: e.name, length: e.length }));

  log(`  enriching ${mint}`);

  const metadata = await resolveMetadata(mint, classification.extensions, { cache });

  let hookProgram;
  if (hook?.programId) {
    hookProgram = await inspectHookProgram(hook.programId, { cache });
  } else {
    hookProgram = {
      programId: null, loader: null, executable: null, upgradeable: null,
      upgradeAuthority: null, lastDeploySlot: null, programDataAddress: null,
      note: 'TransferHook extension present but program_id is null — no program is invoked on transfer',
    };
  }

  const extraAccountMetas = hook?.programId
    ? await inspectExtraAccountMetaList(mint, hook.programId, { cache })
    : { address: null, exists: null, note: 'no hook program id — PDA undefined' };

  let holders = null;
  if (includeHolders) holders = await getHolderCountToken2022(mint);

  return {
    mint,
    name: metadata.name,
    symbol: metadata.symbol,
    metadataSource: metadata.source,
    metadataUri: metadata.uri,
    metadataUpdateAuthority: metadata.updateAuthority,

    hookProgramId: hook?.programId ?? null,
    hookAuthority: hook?.authority ?? null,
    hookAuthorityCanRepoint: hook?.authority !== null && hook?.authority !== undefined,

    hookProgramUpgradeable: hookProgram.upgradeable,
    hookProgramUpgradeAuthority: hookProgram.upgradeAuthority,
    hookProgramLastDeploySlot: hookProgram.lastDeploySlot,
    hookProgramLoader: hookProgram.loader,
    hookProgramExecutable: hookProgram.executable,
    hookProgramDataAddress: hookProgram.programDataAddress,
    hookProgramNote: hookProgram.note,

    supply: classification.base.supply.toString(),
    decimals: classification.base.decimals,
    mintAuthority: classification.base.mintAuthority,
    freezeAuthority: classification.base.freezeAuthority,

    holderCount: holders ? holders.holders : null,
    holderCountMethod: holders ? holders.method : 'not covered — requires getProgramAccounts',

    extensions,
    extensionCount: extensions.length,
    tlvTruncated: classification.tlvTruncated,

    extraAccountMetaList: {
      address: extraAccountMetas.address,
      exists: extraAccountMetas.exists,
      accountCount: extraAccountMetas.list?.count ?? null,
      discriminatorMatches: extraAccountMetas.list?.discriminatorMatches ?? null,
      accounts: extraAccountMetas.list?.accounts ?? null,
      note: extraAccountMetas.note,
    },

    discoveredBy,
    observedAt: new Date().toISOString(),
  };
}
