/**
 * render.mjs — census.json -> census.md.
 *
 * The single rule this file exists to enforce: a value we did not measure renders as
 * `not covered`. Never as a blank, never as 0, never as a dash that a skim-reader scores
 * as a pass. Measured-and-safe and not-measured must be visually distinguishable.
 */

const NOT_COVERED = '`not covered`';

const short = (k, n = 4) => (typeof k === 'string' && k.length > 2 * n + 2 ? `${k.slice(0, n)}…${k.slice(-n)}` : (k ?? ''));

/** Render a nullable scalar, distinguishing "measured as absent" from "not measured". */
function cell(value, { absentLabel = NOT_COVERED, format = (v) => String(v) } = {}) {
  if (value === null || value === undefined) return absentLabel;
  return format(value);
}

function uiSupply(supply, decimals) {
  if (supply === null || supply === undefined) return NOT_COVERED;
  if (decimals === null || decimals === undefined) return `${supply} (raw; decimals ${NOT_COVERED})`;
  try {
    const s = BigInt(supply);
    const d = BigInt(10) ** BigInt(decimals);
    const whole = s / d;
    const frac = s % d;
    if (frac === 0n) return whole.toLocaleString('en-US');
    const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '').slice(0, 4);
    return `${whole.toLocaleString('en-US')}.${fracStr}`;
  } catch {
    return String(supply);
  }
}

/**
 * The upgradeability verdict. Three states, deliberately worded so none of them can be
 * mistaken for another at a glance.
 */
function upgradeVerdict(row) {
  if (row.hookProgramId === null) return 'n/a — no hook program set';
  if (row.hookProgramUpgradeable === true) return '**YES — mutable**';
  if (row.hookProgramUpgradeable === false) return 'no — immutable';
  return NOT_COVERED;
}

function authorityCell(row) {
  if (row.hookProgramId === null) return 'n/a';
  if (row.hookProgramUpgradeable === true) return `\`${row.hookProgramUpgradeAuthority}\``;
  if (row.hookProgramUpgradeable === false) return 'burned / none';
  return NOT_COVERED;
}

export function renderCensusMarkdown(d) {
  const L = [];
  const p = (s = '') => L.push(s);

  p('# The Census — Token-2022 mints carrying a TransferHook extension');
  p();
  p(`Solana mainnet-beta. Generated ${d.generatedAt}.`);
  p(`Slot range of this run: ${cell(d.slotRange.start)} → ${cell(d.slotRange.end)}.`);
  p();

  // --- Coverage banner, first thing a reader sees -------------------------
  p('## Coverage');
  p();
  if (d.coverage.complete) {
    p('> **COMPLETE SCAN.**');
  } else {
    p('> ### ⚠ THIS IS A PARTIAL DATASET');
    p('>');
    p('> Read this before quoting any number below.');
  }
  p('>');
  for (const line of d.coverage.statement.split('\n')) p(`> ${line}`);
  p();

  const bp = d.coverage.boundedPopulation;
  if (bp) {
    p('### The denominator');
    p();
    p('One named population was checked exhaustively. These proportions are meaningful **within that population and nowhere else**.');
    p();
    p('| | count |');
    p('|---|---|');
    p(`| Tokens in Jupiter's verified list | ${bp.verifiedTokensInList.toLocaleString('en-US')} |`);
    p(`| …of which are Token-2022 | ${bp.token2022InList.toLocaleString('en-US')} |`);
    p(`| …successfully fetched and parsed as mints | ${bp.mintsSuccessfullyParsed.toLocaleString('en-US')} |`);
    p(`| …that could not be fetched (unmeasured) | ${bp.candidatesUnfetched.toLocaleString('en-US')} |`);
    p(`| **…carrying a TransferHook extension** | **${bp.carryingTransferHook.toLocaleString('en-US')}** |`);
    p();
    p(`Source list: \`${bp.endpoint}\` (fetched ${bp.listFetchedAt}). The list supplies **addresses only**; every value published here comes from our own RPC call and our own parser.`);
    p();
  }

  p(`- **Methods actually run:** ${d.coverage.methodsUsed.length ? d.coverage.methodsUsed.map((m) => `\`${m}\``).join(', ') : 'none'}`);
  p(`- **Candidate accounts checked:** ${d.coverage.candidatesChecked.toLocaleString('en-US')}`);
  p(`- **Candidate fetches that failed (unmeasured):** ${d.coverage.candidateFetchFailures}`);
  p(`- **RPC endpoint:** \`${d.endpoint.host}\`${d.endpoint.isDefaultPublic ? ' — the default public endpoint' : ''}`);
  p();

  p('### What is not covered');
  p();
  if (d.coverage.notCovered.length === 0) {
    p('Nothing outstanding.');
  } else {
    for (const n of d.coverage.notCovered) p(`- ${n}`);
  }
  p();

  p('### Method detail');
  p();
  for (const m of d.coverage.methodDetail) {
    const status = m.blocked ? 'BLOCKED' : (m.complete ? 'complete' : 'partial');
    p(`**\`${m.method}\`** — ${status}`);
    p();
    p(m.detail);
    if (m.slotWindowWarning) {
      p();
      p(`> ⚠ **Narrow sampling window.** ${m.slotWindowWarning}`);
    }
    if (m.slotRangeCovered) p(`\nSlot range sampled: ${m.slotRangeCovered.min} → ${m.slotRangeCovered.max}.`);
    if (m.offsetsSwept) p(`\nTLV offsets swept: ${m.offsetsSwept.join(', ')}.`);
    if (m.scans?.length) {
      p();
      p('| hook program | GPA served | program accounts | pubkey candidates | new hooked mints |');
      p('|---|---|---|---|---|');
      for (const s of m.scans) {
        p(s.available
          ? `| \`${s.hookProgramId}\` | yes | ${s.programAccounts} | ${s.pubkeyCandidates}${s.candidateListTruncated ? ' (capped)' : ''} | ${s.newHookedMints} |`
          : `| \`${s.hookProgramId}\` | **no** — ${s.scanLimitExceeded ? 'scan limit exceeded' : 'refused'} | ${NOT_COVERED} | ${NOT_COVERED} | ${NOT_COVERED} |`);
      }
    }
    if (m.roots?.length) {
      p();
      p('| sampling root | round | signatures seen | txs sampled | tx fetch failures | accounts harvested | slot range |');
      p('|---|---|---|---|---|---|---|');
      for (const r of m.roots) {
        const sr = r.slotRange ? `${r.slotRange.min}–${r.slotRange.max}` : NOT_COVERED;
        p(`| \`${r.root}\` | ${r.round} | ${r.signaturesSeen} | ${r.transactionsSampled ?? 0} | ${r.failedTransactions ?? 0} | ${r.accountsHarvested} | ${sr} |`);
      }
    }
    p();
  }

  // --- Summary ------------------------------------------------------------
  const s = d.summary;
  p('## Summary of rows in this dataset');
  p();
  p(d.coverage.complete
    ? 'These counts describe mainnet.'
    : '_These counts describe **this dataset only**. They are not mainnet totals._');
  p();
  p('| measure | count |');
  p('|---|---|');
  p(`| Hooked mints in this dataset | ${s.hookedMintsFound} |`);
  p(`| …with a hook program actually set | ${s.withLiveHookProgram} |`);
  p(`| …with TransferHook present but \`program_id\` null | ${s.hookProgramIdNull} |`);
  p(`| Distinct hook programs | ${s.distinctHookPrograms} |`);
  p(`| Hook programs that are **upgradeable** | ${s.hookProgramUpgradeable} |`);
  p(`| Hook programs that are immutable | ${s.hookProgramImmutable} |`);
  p(`| Hook programs whose upgradeability is ${NOT_COVERED} | ${s.hookProgramUpgradeabilityNotCovered} |`);
  p(`| Mints whose hook \`authority\` is still live (can re-point the hook) | ${s.hookAuthorityLive} |`);
  p(`| Mints whose hook \`authority\` is burned | ${s.hookAuthorityBurned} |`);
  p(`| ExtraAccountMetaList present | ${s.extraAccountMetaListPresent} |`);
  p(`| ExtraAccountMetaList absent | ${s.extraAccountMetaListAbsent} |`);
  p();

  // --- Authority concentration ---------------------------------------------
  if (d.authorityConcentration?.length) {
    const groups = d.authorityConcentration;
    const burned = groups.filter((g) => g.hookAuthority === null).reduce((n, g) => n + g.mints, 0);
    p('## Who holds the hook authority');
    p();
    p('The hook `authority` is the key that can change which program a mint calls on transfer. It is a separate power from whether the current hook program is upgradeable, and a mint can be fully mutable through this route even if its hook program is immutable.');
    p();
    p(`Across ${d.summary.hookedMintsFound} rows there are **${groups.length} distinct hook authorities**, and **${burned}** rows have burned theirs.`);
    p();
    p('| hooked mints | hook authority | of those, with a live hook program | enforcement extensions present | examples |');
    p('|---|---|---|---|---|');
    for (const g of groups.slice(0, 12)) {
      p(`| ${g.mints} | ${g.hookAuthority ? `\`${g.hookAuthority}\`` : '_burned_'} | ${g.withLiveHookProgram} | ${g.enforcementExtensions.join(', ') || '—'} | ${g.symbols.join(', ') || NOT_COVERED} |`);
    }
    if (groups.length > 12) p(`\n_${groups.length - 12} further authorities with fewer mints each; see \`census.json\`._`);
    p();
    p('The "enforcement extensions present" column lists the Token-2022 extensions actually set on those mints today. It is a description of current on-chain configuration and nothing more — it is not a claim about what any issuer intends, has announced, or has described elsewhere.');
    p();
  }

  // --- The central question ------------------------------------------------
  const ua = d.upgradeAuthority;
  if (ua) {
    p('## Can the enforcement logic be rewritten?');
    p();
    p('This is the question the census exists to answer. It only applies to rows that name an actual hook program — a mint whose `program_id` is null runs no code on transfer today, and is covered in the section below instead.');
    p();
    p(`**${ua.rowsWithLiveHookProgram} of ${d.summary.hookedMintsFound} rows name a hook program.**`);
    p();

    if (ua.upgradeable.length) {
      p('### Upgradeable — a live key can replace the hook program\'s code');
      p();
      p('Recording this is not an allegation. Upgrade authorities are routine and often deliberate; the point is that a holder cannot see this from any wallet UI.');
      p();
      p('| mint | symbol | hook program | upgrade authority | last deploy slot |');
      p('|---|---|---|---|---|');
      for (const r of ua.upgradeable) {
        p(`| \`${r.mint}\` | ${r.symbol ?? NOT_COVERED} | \`${r.hookProgramId}\` | \`${r.upgradeAuthority}\` | ${cell(r.lastDeploySlot)} |`);
      }
      p();
    }

    if (ua.immutable.length) {
      p('### Immutable — upgrade authority burned, or a loader with no upgrade path');
      p();
      p('| mint | symbol | hook program |');
      p('|---|---|---|');
      for (const r of ua.immutable) p(`| \`${r.mint}\` | ${r.symbol ?? NOT_COVERED} | \`${r.hookProgramId}\` |`);
      p();
    }

    if (ua.notCovered.length) {
      p(`### ${NOT_COVERED} — named a hook program but upgradeability could not be measured`);
      p();
      p('| mint | symbol | hook program | why |');
      p('|---|---|---|---|');
      for (const r of ua.notCovered) p(`| \`${r.mint}\` | ${r.symbol ?? NOT_COVERED} | \`${r.hookProgramId}\` | ${r.note ?? NOT_COVERED} |`);
      p();
    }

    if (!ua.upgradeable.length && !ua.immutable.length && !ua.notCovered.length) {
      p('_No row in this dataset names a hook program, so this column has no data. That is a gap in the dataset, not a finding about mainnet._');
      p();
    }
  }

  // --- Main table ---------------------------------------------------------
  p('## Rows');
  p();
  if (d.rows.length === 0) {
    p('_No hooked mints were found by the methods that this endpoint permitted. This is a statement about the scan, not about mainnet._');
    p();
  } else {
    p('| mint | name | symbol | hook program | hook upgradeable | upgrade authority | last deploy slot | supply | decimals | holders | EAM list | exts |');
    p('|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const r of d.rows) {
      // With no hook program there is no PDA to derive, so this is genuinely n/a rather
      // than unmeasured. Keeping the two apart stops `not covered` from losing its meaning.
      const eam = r.extraAccountMetaList.exists === true
        ? `yes (${cell(r.extraAccountMetaList.accountCount)})`
        : r.extraAccountMetaList.exists === false ? 'no'
        : r.hookProgramId === null ? 'n/a' : NOT_COVERED;
      p(`| \`${r.mint}\` | ${r.name ?? NOT_COVERED} | ${r.symbol ?? NOT_COVERED} | ${r.hookProgramId ? `\`${short(r.hookProgramId, 6)}\`` : '_none set_'} | ${upgradeVerdict(r)} | ${authorityCell(r)} | ${cell(r.hookProgramLastDeploySlot)} | ${uiSupply(r.supply, r.decimals)} | ${cell(r.decimals)} | ${cell(r.holderCount)} | ${eam} | ${r.extensionCount} |`);
    }
    p();
  }

  // --- Per-row detail -----------------------------------------------------
  // Full per-row detail for 600+ rows produces a megabyte of markdown nobody reads, and
  // census.json already holds every field. Show the rows that carry information a reader
  // cannot reconstruct from the table above: everything with a live hook program, plus one
  // representative per distinct hook authority.
  const detailRows = (() => {
    const chosen = new Map();
    for (const r of d.rows) if (r.hookProgramId) chosen.set(r.mint, r);
    const seenAuthority = new Set([...chosen.values()].map((r) => r.hookAuthority));
    for (const r of d.rows) {
      if (chosen.has(r.mint)) continue;
      if (seenAuthority.has(r.hookAuthority)) continue;
      seenAuthority.add(r.hookAuthority);
      chosen.set(r.mint, r);
    }
    return [...chosen.values()];
  })();

  if (detailRows.length) {
    p('## Row detail');
    p();
    p(`Showing **${detailRows.length} of ${d.rows.length}** rows: every row that names a hook program, plus one representative for each distinct hook authority. The remaining ${d.rows.length - detailRows.length} rows share a configuration with a representative shown here and are listed in full, with every field, in \`census.json\`. Nothing is omitted from the dataset — only from this rendering.`);
    p();
    for (const r of detailRows) {
      p(`### ${r.symbol ? `${r.name ?? '?'} (${r.symbol})` : r.mint}`);
      p();
      p(`- **Mint:** \`${r.mint}\``);
      p(`- **Name / symbol:** ${r.name ?? NOT_COVERED} / ${r.symbol ?? NOT_COVERED} — source: \`${r.metadataSource}\``);
      p(`- **Supply:** ${uiSupply(r.supply, r.decimals)} (raw \`${r.supply}\`, decimals ${cell(r.decimals)})`);
      p(`- **Mint authority:** ${r.mintAuthority ? `\`${r.mintAuthority}\`` : 'burned / none'}`);
      p(`- **Freeze authority:** ${r.freezeAuthority ? `\`${r.freezeAuthority}\`` : 'burned / none'}`);
      p(`- **Holder count:** ${cell(r.holderCount)} — ${r.holderCountMethod}`);
      p();
      p('**Transfer hook**');
      p();
      p(`- **Hook program id:** ${r.hookProgramId ? `\`${r.hookProgramId}\`` : '_null — the extension is present but no program is invoked on transfer_'}`);
      p(`- **Hook \`authority\`:** ${r.hookAuthority ? `\`${r.hookAuthority}\`` : 'null — burned, the hook program id can no longer be changed'}`);
      if (r.hookAuthorityCanRepoint) {
        p(`  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.`);
      }
      p(`- **Hook program upgradeable:** ${upgradeVerdict(r)}`);
      p(`- **Upgrade authority:** ${authorityCell(r)}`);
      p(`- **Last deployed slot:** ${cell(r.hookProgramLastDeploySlot)}`);
      p(`- **Loader:** ${cell(r.hookProgramLoader)}`);
      p(`- **ProgramData account:** ${r.hookProgramDataAddress ? `\`${r.hookProgramDataAddress}\`` : NOT_COVERED}`);
      if (r.hookProgramNote) p(`- **Note:** ${r.hookProgramNote}`);
      p();
      p('**ExtraAccountMetaList**');
      p();
      p(`- **Derived PDA:** ${r.extraAccountMetaList.address ? `\`${r.extraAccountMetaList.address}\`` : NOT_COVERED}`);
      p(`- **Exists:** ${r.extraAccountMetaList.exists === null ? NOT_COVERED : (r.extraAccountMetaList.exists ? 'yes' : 'no')}`);
      p(`- **Accounts in list:** ${cell(r.extraAccountMetaList.accountCount)}`);
      if (r.extraAccountMetaList.note) p(`- **Note:** ${r.extraAccountMetaList.note}`);
      if (r.extraAccountMetaList.accounts?.length) {
        p();
        p('| # | kind | address | signer | writable |');
        p('|---|---|---|---|---|');
        for (const a of r.extraAccountMetaList.accounts) {
          p(`| ${a.index} | ${a.kind} | ${a.address ? `\`${a.address}\`` : `_seed config_ \`${a.addressConfigHex?.slice(0, 16)}…\``} | ${a.isSigner} | ${a.isWritable} |`);
        }
      }
      p();
      p(`**All mint extensions (${r.extensionCount}):** ${r.extensions.map((e) => `${e.name}(${e.type})`).join(', ')}`);
      if (r.tlvTruncated) p('\n> ⚠ The TLV region was truncated — this extension list is incomplete.');
      p();
      p(`_Discovered by: \`${r.discoveredBy}\`. Observed at ${r.observedAt}._`);
      p();
      p('---');
      p();
    }
  }

  p('## Reproduction');
  p();
  p('See `METHOD.md` in this directory. Short version:');
  p();
  p('```bash');
  p('export SOLANA_RPC_URL="https://your-endpoint"   # needs getProgramAccounts for a complete scan');
  p('node src/census/cli.mjs');
  p('```');
  p();
  p('Every row above is derived from a raw RPC response cached under `data/census/.cache/`, so the parse can be re-checked without re-scanning.');
  p();

  return L.join('\n');
}
