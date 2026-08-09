/**
 * scan.mjs — orchestration.
 *
 * Picks the strongest enumeration method the endpoint will actually serve, records which
 * one was used, and refuses to describe a partial result as anything else. The coverage
 * block it emits is the most important part of the output: it states in one sentence what
 * the dataset does and does not license a reader to claim.
 */

import { readFile } from 'node:fs/promises';
import { getSlot, rpcUrl } from './rpc.mjs';
import { Cache, ScanState } from './cache.mjs';
import {
  probeGpa, gpaFullMintScan, gpaOffsetSweep, checkCandidates,
  sampleProgramTransactions, candidateHookOffsets, gpaHookProgramCandidates,
} from './enumerate.mjs';
import { fetchJupiterToken2022Candidates } from './jupiter.mjs';
import { buildRow } from './enrich.mjs';

export const CENSUS_VERSION = 1;

/** Endpoint host only — never the full URL, which may carry an API key. */
function endpointHost() {
  try {
    const u = new URL(rpcUrl());
    return { host: u.host, isDefaultPublic: u.host === 'api.mainnet-beta.solana.com' };
  } catch {
    return { host: 'unparseable', isDefaultPublic: false };
  }
}

/**
 * The one-sentence honesty statement attached to every dataset.
 * `complete` is true only for the full getProgramAccounts scan.
 */
function coverageStatement(methods, complete, jupiterCoverage) {
  if (complete) {
    return 'COMPLETE. Every Token-2022 mint carrying extensions was enumerated via ' +
      'getProgramAccounts and its TLV parsed locally, so the set of hooked mints is exhaustive ' +
      'as of the stated slot.';
  }

  if (jupiterCoverage) {
    const j = jupiterCoverage;
    return 'PARTIAL FOR MAINNET, COMPLETE FOR A NAMED SUB-POPULATION.\n\n' +
      `Every one of the ${j.token2022InList} Token-2022 mints in Jupiter's verified token list ` +
      `was checked against RPC (${j.mintsSuccessfullyParsed} parsed successfully` +
      `${j.candidatesUnfetched ? `, ${j.candidatesUnfetched} could not be fetched and are unmeasured` : ''}), ` +
      `and ${j.carryingTransferHook} carry a TransferHook extension. Within that list the count ` +
      'is a real denominator, and a proportion computed from it is meaningful.\n\n' +
      'That list is NOT the chain. Jupiter\'s verified set is a curated subset — it excludes ' +
      'unverified, illiquid, new and delisted tokens, which is exactly where an undisclosed hook ' +
      'is most likely to sit. So this dataset still CANNOT support "there are N hooked mints on ' +
      'mainnet", and a mint\'s absence from it is still not evidence that it has no hook. ' +
      `Rows found outside the list (via ${methods.filter((m) => m !== 'jupiter-verified-list').join(', ') || 'other methods'}) ` +
      'are additive finds, not a sample of anything.';
  }

  return 'PARTIAL. This dataset enumerates hooked mints only within the reach of the methods ' +
    `actually run (${methods.join(', ')}). It CANNOT support any statement of the form ` +
    '"there are N hooked mints on mainnet", nor any claim that a mint absent from this list ' +
    'has no transfer hook. It is a lower bound on a biased sample, not a population count.';
}

/**
 * Run the census.
 *
 * @param {object} opts
 * @param {string} opts.cacheDir      where raw RPC responses are cached
 * @param {number} opts.maxSignatures signatures pulled per sampling root
 * @param {number} opts.maxTransactions transactions fetched per sampling root
 * @param {number} opts.frontierRounds how many times to expand into newly-found hook programs
 * @param {boolean} opts.includeHolders attempt holder counts (needs getProgramAccounts)
 */
export async function runCensus({
  cacheDir,
  statePath,
  seedsPath,
  maxSignatures = 1000,
  maxTransactions = 150,
  frontierRounds = 2,
  includeHolders = false,
  refreshSignatures = false,
  useJupiter = true,
  gpaSweepDepth = 2,
  log = console.log,
} = {}) {
  const startedAt = new Date().toISOString();
  const cache = new Cache(cacheDir);
  await cache.init();

  const state = new ScanState(statePath);
  await state.load();

  const seeds = JSON.parse(await readFile(seedsPath, 'utf8'));
  const exclude = new Set(seeds.excludeFromCandidates ?? []);

  const endpoint = endpointHost();
  const startSlot = await getSlot();
  log(`[census] endpoint host: ${endpoint.host}${endpoint.isDefaultPublic ? ' (default public RPC)' : ''}`);
  log(`[census] start slot: ${startSlot ?? 'unavailable'}`);

  const methodsUsed = [];
  const methodNotes = [];
  const hookedByMint = new Map();  // mint -> { classification, discoveredBy }
  let complete = false;
  let candidatesChecked = 0;
  let candidatesFailed = [];
  const samplingDetail = [];

  // --- Method A / B: getProgramAccounts -----------------------------------
  log('[census] probing getProgramAccounts availability...');
  const gpa = await probeGpa();

  if (gpa.available) {
    log('[census] getProgramAccounts is available — running the complete scan');
    const full = await gpaFullMintScan({ cache, log });
    if (full) {
      methodsUsed.push('gpa-full');
      complete = true;
      for (const h of full.hooked) hookedByMint.set(h.mint, { classification: h.classification, discoveredBy: 'gpa-full' });
      candidatesChecked += full.scanned;
      methodNotes.push({
        method: 'gpa-full',
        complete: true,
        detail: `Enumerated every Token-2022 account with AccountType::Mint at offset 165 (${full.scanned} accounts) and parsed each TLV region locally.`,
      });
    } else {
      log('[census] full GPA failed after the probe succeeded — trying the offset sweep');
      const sweep = await gpaOffsetSweep({ cache, maxDepth: gpaSweepDepth, log });
      if (sweep) {
        methodsUsed.push('gpa-offset-sweep');
        for (const h of sweep.hooked) hookedByMint.set(h.mint, { classification: h.classification, discoveredBy: 'gpa-offset-sweep' });
        methodNotes.push({
          method: 'gpa-offset-sweep',
          complete: false,
          detail: `Swept ${sweep.offsetsSwept.length} candidate TLV offsets. Complete only for mints whose TransferHook TLV begins at one of those offsets; a mint carrying a variable-length extension before its hook is unreachable this way.`,
          offsetsSwept: sweep.offsetsSwept,
        });
      }
    }
  } else {
    log(`[census] getProgramAccounts unavailable: ${gpa.reason}`);
    methodNotes.push({
      method: 'gpa-full',
      complete: false,
      attempted: true,
      blocked: true,
      detail: `Endpoint refused getProgramAccounts on the Token-2022 program${gpa.refusal ? ' (structural refusal, not a transient error)' : ''}. Reason reported: ${gpa.reason}`,
    });
  }

  // --- Method D: seed verification ----------------------------------------
  if (!complete) {
    const seedAddrs = (seeds.candidateMints ?? []).map((c) => c.address).filter((a) => !exclude.has(a));
    if (seedAddrs.length) {
      log(`[census] verifying ${seedAddrs.length} seed candidates`);
      const res = await checkCandidates(seedAddrs, { cache, log });
      candidatesChecked += res.results.size;
      candidatesFailed.push(...res.failed);
      let found = 0;
      for (const [addr, r] of res.results) {
        if (r.classification?.kind === 'mint' && r.classification.hooked) {
          hookedByMint.set(addr, { classification: r.classification, discoveredBy: 'seed-verify' });
          found++;
        }
      }
      methodsUsed.push('seed-verify');
      methodNotes.push({
        method: 'seed-verify',
        complete: false,
        detail: `Checked ${res.results.size} manually-collected candidate addresses; ${found} of them carry a TransferHook. Coverage is exactly this list and nothing more.`,
      });
      log(`[census] seed-verify: ${found} hooked of ${res.results.size} checked`);
    }
  }

  // --- Method E: Jupiter verified list ------------------------------------
  // A defined, nameable population. Not the whole chain, but a real denominator, which is
  // something none of the other partial methods can offer.
  let jupiterCoverage = null;
  if (!complete && useJupiter) {
    const jup = await fetchJupiterToken2022Candidates({ cache, log });
    if (!jup) {
      methodNotes.push({
        method: 'jupiter-verified-list',
        complete: false,
        attempted: true,
        blocked: true,
        detail: 'Jupiter token list could not be fetched; this method contributed nothing to the dataset.',
      });
    } else {
      const addrs = jup.candidates.filter((a) => !exclude.has(a));
      log(`[census] checking ${addrs.length} Token-2022 mints from Jupiter's verified list`);
      const res = await checkCandidates(addrs, { cache, log });
      candidatesChecked += res.results.size;
      candidatesFailed.push(...res.failed);

      let hooked = 0;
      let checkedMints = 0;
      for (const [addr, r] of res.results) {
        if (r.classification?.kind !== 'mint') continue;
        checkedMints++;
        if (r.classification.hooked) {
          if (!hookedByMint.has(addr)) {
            hookedByMint.set(addr, { classification: r.classification, discoveredBy: 'jupiter-verified-list' });
          }
          hooked++;
        }
      }

      // The denominator is only honest if unfetched candidates are excluded from it.
      jupiterCoverage = {
        endpoint: jup.endpoint,
        listFetchedAt: jup.fetchedAt,
        verifiedTokensInList: jup.totalInList,
        token2022InList: jup.token2022Count,
        candidatesRequested: addrs.length,
        candidatesFetched: res.results.size,
        candidatesUnfetched: res.failed.length,
        mintsSuccessfullyParsed: checkedMints,
        carryingTransferHook: hooked,
      };

      methodsUsed.push('jupiter-verified-list');
      methodNotes.push({
        method: 'jupiter-verified-list',
        complete: false,
        boundedPopulation: true,
        detail: `Took the ${jup.token2022Count} Token-2022 mints out of ${jup.totalInList} tokens in Jupiter's verified list and checked each one against RPC with our own parser. ${hooked} of ${checkedMints} successfully-parsed mints carry a TransferHook extension. Jupiter supplies ONLY the list of addresses to check — every published field comes from our own getMultipleAccounts call. This is COMPLETE with respect to Jupiter's verified list and says nothing about mints outside it.`,
        coverage: jupiterCoverage,
      });
      log(`[census] jupiter-verified-list: ${hooked} hooked of ${checkedMints} mints parsed`);
    }
  }

  // --- Method F: getProgramAccounts against hook programs ------------------
  // Public endpoints refuse GPA on Token-2022 but serve it for ordinary custom programs,
  // so a known hook program's own accounts can be enumerated and mined for mint references.
  const hookProgramScans = [];
  if (!complete) {
    const seededPrograms = (seeds.candidateHookPrograms ?? []).map((p) => p.address);
    const discoveredPrograms = [...new Set(
      [...hookedByMint.values()].map((v) => v.classification.hook?.programId).filter(Boolean),
    )];
    const programs = [...new Set([...seededPrograms, ...discoveredPrograms])];

    for (const prog of programs) {
      const scan = await gpaHookProgramCandidates(prog, { cache, log });
      if (!scan.available) {
        hookProgramScans.push({
          hookProgramId: prog, available: false,
          scanLimitExceeded: scan.scanLimitExceeded, reason: scan.reason,
        });
        continue;
      }

      const fresh = scan.candidates.filter((a) => !exclude.has(a) && !hookedByMint.has(a));
      let found = 0;
      if (fresh.length) {
        log(`[census] testing ${fresh.length} pubkey candidates mined from ${prog}`);
        const res = await checkCandidates(fresh, { cache, log });
        candidatesChecked += res.results.size;
        candidatesFailed.push(...res.failed);
        for (const [addr, r] of res.results) {
          if (r.classification?.kind === 'mint' && r.classification.hooked) {
            hookedByMint.set(addr, { classification: r.classification, discoveredBy: `gpa-hook-program:${prog}` });
            found++;
          }
        }
      }
      hookProgramScans.push({
        hookProgramId: prog, available: true,
        programAccounts: scan.accountsSeen,
        pubkeyCandidates: scan.candidates.length,
        candidateListTruncated: scan.truncated,
        newHookedMints: found,
      });
      log(`[census] gpa-hook-program ${prog}: ${found} new hooked mints`);
    }

    if (hookProgramScans.length) {
      methodsUsed.push('gpa-hook-program');
      const blocked = hookProgramScans.filter((s) => !s.available);
      methodNotes.push({
        method: 'gpa-hook-program',
        complete: false,
        detail: `Ran getProgramAccounts against ${hookProgramScans.length} hook program(s) — permitted for ordinary custom programs even where it is refused for Token-2022 — then slid a 32-byte window across each account's data and tested every distinct pubkey it yielded. Complete for the accounts of the programs listed below; silent about any mint whose hook program stores no reference to it.${blocked.length ? ` ${blocked.length} program(s) could not be enumerated.` : ''}`,
        scans: hookProgramScans,
      });
    }
  }

  // --- Method C: transaction sampling with frontier expansion --------------
  if (!complete) {
    const roots = (seeds.samplingRoots ?? []).map((r) => r.address);
    const visitedRoots = new Set();
    let frontier = [...roots];

    for (let round = 0; round < frontierRounds && frontier.length; round++) {
      log(`[census] sampling round ${round + 1}: ${frontier.length} root(s)`);
      const nextFrontier = [];

      for (const root of frontier) {
        if (visitedRoots.has(root)) continue;
        visitedRoots.add(root);

        const sample = await sampleProgramTransactions(root, {
          maxSignatures, maxTransactions, cache, refreshSignatures, log,
        });
        samplingDetail.push({ round: round + 1, ...sample, accountKeys: undefined, accountKeyCount: sample.accountKeys.length });

        const candidates = sample.accountKeys.filter((a) => !exclude.has(a) && !hookedByMint.has(a));
        if (!candidates.length) continue;

        log(`[census] testing ${candidates.length} harvested accounts from ${root}`);
        const res = await checkCandidates(candidates, { cache, log });
        candidatesChecked += res.results.size;
        candidatesFailed.push(...res.failed);

        for (const [addr, r] of res.results) {
          if (r.classification?.kind === 'mint' && r.classification.hooked) {
            hookedByMint.set(addr, { classification: r.classification, discoveredBy: `tx-sample:${root}` });
            const hookProg = r.classification.hook?.programId;
            // A newly-seen hook program is a dense source of more hooked mints, so it
            // becomes a root for the next round.
            if (hookProg && !visitedRoots.has(hookProg)) nextFrontier.push(hookProg);
          }
        }
        log(`[census] running total: ${hookedByMint.size} hooked mints`);
      }
      frontier = [...new Set(nextFrontier)];
    }

    if (samplingDetail.length) {
      methodsUsed.push('tx-sample');
      const slots = samplingDetail.map((s) => s.slotRange).filter(Boolean);
      const covered = slots.length
        ? { min: Math.min(...slots.map((s) => s.min)), max: Math.max(...slots.map((s) => s.max)) }
        : null;
      // How much chain time a root's signature page actually spanned. For a very busy
      // program this collapses to a second or two, which is the single most important
      // limitation of this method and must be stated, not buried.
      const spans = samplingDetail
        .filter((s) => s.slotRange)
        .map((s) => ({ root: s.programId, slots: s.slotRange.max - s.slotRange.min + 1, signatures: s.signaturesSeen }));
      // Warn whenever a substantial signature page collapses into a handful of slots.
      // At ~0.4s per slot, 50 slots is about 20 seconds of chain history — nowhere near
      // enough to call the sampling representative of a program's lifetime.
      const narrow = spans.filter((s) => s.signatures >= 100 && s.slots <= 50);

      methodNotes.push({
        method: 'tx-sample',
        complete: false,
        detail: 'Sampled transaction history of the Token-2022 program and of each hook program discovered, harvested every account key referenced, and tested each. Discovery is proportional to recent transfer activity, so dormant hooked mints are systematically missed.',
        slotWindowWarning: narrow.length
          ? `Signature paging returns transactions newest-first and contiguously, so on a high-traffic program a full page covers only a moment of chain time. ${narrow.map((s) => `\`${s.root}\` returned ${s.signatures} signatures spanning just ${s.slots} slot(s)`).join('; ')}. At roughly 0.4s per slot this is a window of seconds, not days. Discovery from such a root is therefore close to negligible and must not be read as broad coverage of the program's history.`
          : null,
        slotSpans: spans,
        slotRangeCovered: covered,
        roots: samplingDetail.map((s) => ({
          root: s.programId, round: s.round, signaturesSeen: s.signaturesSeen,
          transactionsSampled: s.transactionsSampled, failedTransactions: s.failedTransactions,
          slotRange: s.slotRange, accountsHarvested: s.accountKeyCount,
        })),
      });
    }
  }

  // --- Enrichment ---------------------------------------------------------
  log(`[census] enriching ${hookedByMint.size} hooked mints`);
  const rows = [];
  for (const [mint, { classification, discoveredBy }] of hookedByMint) {
    const row = await buildRow(mint, classification, { cache, includeHolders, discoveredBy, log });
    rows.push(row);
  }
  rows.sort((a, b) => (b.supply ?? '').length - (a.supply ?? '').length || a.mint.localeCompare(b.mint));

  const endSlot = await getSlot();

  const notCovered = [];
  if (!complete) {
    notCovered.push('Population enumeration: no complete list of hooked mints was obtained. The row count is a lower bound.');
  }
  if (!includeHolders || rows.every((r) => r.holderCount === null)) {
    notCovered.push('Holder counts: require getProgramAccounts on Token-2022 filtered by mint. Rendered as `not covered`, never as 0.');
  }
  if (candidatesFailed.length) {
    notCovered.push(`${candidatesFailed.length} candidate account(s) could not be fetched and are unmeasured — they are neither confirmed nor excluded.`);
  }
  const undeployedLoaders = rows.filter((r) => r.hookProgramUpgradeable === null && r.hookProgramId);
  if (undeployedLoaders.length) {
    notCovered.push(`${undeployedLoaders.length} hook program(s) have upgradeability \`not covered\` — see each row's hookProgramNote.`);
  }

  const dataset = {
    censusVersion: CENSUS_VERSION,
    generatedAt: new Date().toISOString(),
    startedAt,
    chain: 'solana-mainnet-beta',
    tokenProgram: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
    slotRange: { start: startSlot, end: endSlot },
    endpoint,

    coverage: {
      complete,
      statement: coverageStatement(methodsUsed, complete, jupiterCoverage),
      boundedPopulation: jupiterCoverage,
      methodsUsed,
      methodDetail: methodNotes,
      candidatesChecked,
      candidateFetchFailures: candidatesFailed.length,
      notCovered,
      gpaOffsetSweepUniverse: complete ? null : candidateHookOffsets(gpaSweepDepth).length,
    },

    summary: {
      hookedMintsFound: rows.length,
      withLiveHookProgram: rows.filter((r) => r.hookProgramId !== null).length,
      hookProgramIdNull: rows.filter((r) => r.hookProgramId === null).length,
      hookProgramUpgradeable: rows.filter((r) => r.hookProgramUpgradeable === true).length,
      hookProgramImmutable: rows.filter((r) => r.hookProgramUpgradeable === false).length,
      // Only rows that actually name a hook program can have unmeasured upgradeability.
      // A mint with program_id null is n/a, not a gap, and must not inflate this number.
      hookProgramUpgradeabilityNotCovered: rows.filter((r) => r.hookProgramId !== null && r.hookProgramUpgradeable === null).length,
      hookAuthorityLive: rows.filter((r) => r.hookAuthority !== null).length,
      hookAuthorityBurned: rows.filter((r) => r.hookAuthority === null).length,
      distinctHookPrograms: new Set(rows.map((r) => r.hookProgramId).filter(Boolean)).size,
      extraAccountMetaListPresent: rows.filter((r) => r.extraAccountMetaList.exists === true).length,
      extraAccountMetaListAbsent: rows.filter((r) => r.extraAccountMetaList.exists === false).length,
    },

    // Restated separately because it is the census's central question and must not be
    // buried in the row array.
    upgradeAuthority: {
      rowsWithLiveHookProgram: rows.filter((r) => r.hookProgramId !== null).length,
      upgradeable: rows.filter((r) => r.hookProgramUpgradeable === true)
        .map((r) => ({ mint: r.mint, symbol: r.symbol, hookProgramId: r.hookProgramId, upgradeAuthority: r.hookProgramUpgradeAuthority, lastDeploySlot: r.hookProgramLastDeploySlot })),
      immutable: rows.filter((r) => r.hookProgramUpgradeable === false)
        .map((r) => ({ mint: r.mint, symbol: r.symbol, hookProgramId: r.hookProgramId })),
      notCovered: rows.filter((r) => r.hookProgramId !== null && r.hookProgramUpgradeable === null)
        .map((r) => ({ mint: r.mint, symbol: r.symbol, hookProgramId: r.hookProgramId, note: r.hookProgramNote })),
    },

    // Which keys control how many hooked mints. Computed from the rows rather than
    // hand-written, so it cannot drift from the data.
    authorityConcentration: (() => {
      const groups = new Map();
      for (const r of rows) {
        const k = r.hookAuthority ?? '(burned)';
        if (!groups.has(k)) groups.set(k, { hookAuthority: r.hookAuthority, mints: 0, symbols: [], enforcementExtensions: new Set(), withLiveHookProgram: 0 });
        const g = groups.get(k);
        g.mints++;
        if (g.symbols.length < 6 && r.symbol) g.symbols.push(r.symbol);
        if (r.hookProgramId) g.withLiveHookProgram++;
        for (const e of r.extensions) {
          if (['DefaultAccountState', 'Pausable', 'PermanentDelegate', 'ConfidentialTransferMint', 'TransferFeeConfig', 'NonTransferable', 'MintCloseAuthority'].includes(e.name)) {
            g.enforcementExtensions.add(e.name);
          }
        }
      }
      return [...groups.values()]
        .map((g) => ({ ...g, enforcementExtensions: [...g.enforcementExtensions].sort() }))
        .sort((a, b) => b.mints - a.mints);
    })(),

    rows,
    cacheStats: cache.stats(),
  };

  state.data.startedAt = state.data.startedAt || startedAt;
  state.data.hookMints = rows.map((r) => r.mint);
  state.data.hookPrograms = [...new Set(rows.map((r) => r.hookProgramId).filter(Boolean))];
  state.data.methodsAttempted = Object.fromEntries(methodNotes.map((m) => [m.method, m.complete]));
  await state.save();

  return dataset;
}
