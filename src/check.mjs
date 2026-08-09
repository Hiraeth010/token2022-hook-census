#!/usr/bin/env node
/**
 * check.mjs — answer the question a stranger actually arrives with.
 *
 *   node src/check.mjs <mint>            (published repo)
 *   node src/census/check.mjs <mint>     (in this project)
 *   node src/check.mjs <mint> --live     re-derive from RPC instead of the dataset
 *
 * ---------------------------------------------------------------------------
 * Why this exists
 *
 * A reviewer scoring this dataset put it exactly right: a 1.4 MB JSON blob is
 * evidence, and a one-line command is a tool. Everything needed to answer
 * "can code be attached to transfers of this token, and who decides" was
 * already published, and answering it still required opening a file the size
 * of a novel and knowing which field mattered.
 *
 * The question is narrow and this program refuses to answer any other:
 *
 *   - Does this mint carry a TransferHook extension?
 *   - Is a hook program attached RIGHT NOW, or is the slot reserved and empty?
 *   - Who can point it at code, and can they still do it?
 *   - What else is attached that can already move or freeze a holder's tokens?
 *
 * Two things it will not do, because doing them would make it dishonest:
 *
 * 1. It never says "safe". Every line is a statement about ON-CHAIN
 *    CONFIGURATION, never about anyone's intent. Reserving a hook slot is
 *    ordinary and may be forward planning, defensiveness, or just what an
 *    issuer's tooling does by default. A holder cannot weigh that without
 *    knowing the capability exists; that is the entire point, and it is where
 *    this program stops.
 *
 * 2. `not in the dataset` never renders as `no hook`. The census is complete
 *    with respect to a named population, not with respect to the chain —
 *    see ENUMERATION-LIMIT.md. An absent mint is an absence of measurement,
 *    and printing that as a clean bill of health would be the single most
 *    damaging thing this tool could do. Use `--live` to actually find out.
 * ---------------------------------------------------------------------------
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAccountInfo } from './rpc.mjs';
import {
  parseMintExtensions, findExtension, parseTransferHook,
  EXT_TRANSFER_HOOK, TOKEN_2022_PROGRAM,
} from './tlv.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** The dataset, wherever it is: this project's data dir, or the repo root. */
function loadCensus() {
  const candidates = [
    join(HERE, '..', '..', 'data', 'census', 'census.json'), // project tree
    join(HERE, '..', 'census.json'),                          // published repo root
    join(process.cwd(), 'census.json'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return { path: p, data: JSON.parse(readFileSync(p, 'utf8')) };
  }
  return null;
}

/** Extensions that can move, freeze or block a holder's tokens without a hook. */
const ENFORCEMENT = new Set([
  'PermanentDelegate', 'Pausable', 'DefaultAccountState',
  'ConfidentialTransferMint', 'TransferFeeConfig', 'NonTransferable',
]);

const args = process.argv.slice(2);
const mint = args.find((a) => !a.startsWith('--'));
const live = args.includes('--live');

if (!mint || args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node ${HERE.endsWith('census') ? 'src/census/check.mjs' : 'src/check.mjs'} <mint> [--live]

Answers one question: can code be attached to transfers of this token, and who
decides. Reads the published dataset; --live re-derives it from RPC instead.

Reports on-chain CONFIGURATION only. It never reports intent and never says
"safe". A mint that is not in the dataset is reported as NOT MEASURED, never as
having no hook — see ENUMERATION-LIMIT.md.`);
  process.exit(mint ? 0 : 2);
}

/**
 * Everything runs inside main() so that a terminal case can `return` rather than
 * call process.exit(). Exiting while undici still holds a keep-alive socket makes
 * Node abort on Windows with `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`
 * printed AFTER a correct answer — which, in a tool published for strangers to
 * trust, reads as the tool being broken. Setting process.exitCode and letting the
 * loop drain gives the same exit status without the abort.
 */
const out = [];
const say = (k, v) => out.push([k, v]);

async function main() {
let row = null;
let source = null;

if (!live) {
  const census = loadCensus();
  if (!census) {
    console.error('census.json not found. Run the scan first, or pass --live to query RPC directly.');
    process.exitCode = 2; return;
  }
  row = census.data.rows.find((r) => r.mint === mint);
  source = `${census.path} (observed ${census.data.generatedAt ?? 'unknown'})`;

  if (!row) {
    console.log(`\n  ${mint}\n`);
    console.log('  NOT MEASURED — this mint is not in the dataset.');
    console.log('');
    console.log('  That is NOT the same as "it has no transfer hook". The census covers a named');
    console.log('  population (Token-2022 mints in Jupiter\'s verified list plus seeded candidates),');
    console.log('  not the whole chain, because getProgramAccounts against Token-2022 is refused by');
    console.log('  every free endpoint tested. Unverified, illiquid, new and delisted tokens are');
    console.log('  exactly where an undisclosed hook is most likely to sit, and exactly what is');
    console.log('  missing here. ENUMERATION-LIMIT.md is the honest version of this paragraph.');
    console.log('');
    console.log('  To actually find out:  --live');
    console.log('');
    process.exitCode = 3; return;
  }
} else {
  const info = await getAccountInfo(mint);
  if (!info) { console.error('RPC read failed. Not reporting a result rather than guessing.'); process.exitCode = 2; return; }
  if (!info.value) { console.error(`${mint} does not exist on this cluster.`); process.exitCode = 3; return; }

  const owner = info.value.owner;
  if (owner !== TOKEN_2022_PROGRAM) {
    console.log(`\n  ${mint}\n`);
    console.log(`  Not a Token-2022 mint (owner ${owner}).`);
    console.log('  Transfer hooks are a Token-2022 extension; a legacy SPL mint cannot carry one.\n');
    process.exitCode = 0; return;
  }

  const raw = Buffer.from(info.value.data[0], 'base64');
  const parsed = parseMintExtensions(raw);
  if (!parsed) {
    console.error(`${mint} is owned by Token-2022 but does not parse as a mint account.`);
    process.exitCode = 2;
    return;
  }
  const hookEntry = findExtension(parsed, EXT_TRANSFER_HOOK);
  const hook = hookEntry ? parseTransferHook(hookEntry.value) : null;
  row = {
    mint,
    // parseMintExtensions returns { accountKind, entries, truncated }, not an array.
    // The dataset stores the entries list directly, so normalise to that shape here
    // and the two code paths below stay identical.
    extensions: parsed.entries,
    hookProgramId: hook?.programId ?? null,
    hookAuthority: hook?.authority ?? null,
    hookAuthorityCanRepoint: Boolean(hook?.authority),
    observedAt: new Date().toISOString(),
  };
  if (parsed.truncated) {
    console.log('\n  WARNING: the TLV region is truncated, so the extension list below is incomplete.');
  }
  source = `live RPC read at slot ${info.slot}`;
  if (!hookEntry) {
    console.log(`\n  ${mint}\n`);
    console.log('  No TransferHook extension. No code can be attached to transfers of this mint,');
    console.log('  and no authority exists that could attach one later.');
    console.log(`\n  source: ${source}\n`);
    process.exitCode = 0; return;
  }
}

// --- the answer ------------------------------------------------------------
const attached = row.hookProgramId && !/^1+$/.test(row.hookProgramId);
const canRepoint = row.hookAuthorityCanRepoint && row.hookAuthority;

say('mint', row.mint);
if (row.name || row.symbol) say('token', `${row.name ?? '?'}${row.symbol ? ` (${row.symbol})` : ''}`);
say('transfer hook', attached ? 'ATTACHED — code runs on every transfer' : 'slot present, program_id is null — no code runs today');
if (attached) {
  say('hook program', row.hookProgramId);
  if (row.hookProgramUpgradeable !== undefined) {
    say('hook program is', row.hookProgramUpgradeable
      ? `UPGRADEABLE — ${row.hookProgramUpgradeAuthority ?? 'an authority'} can replace its logic`
      : 'immutable');
  }
}
say('hook authority', row.hookAuthority ?? 'none — the slot can never be filled');
say('can it be repointed', canRepoint
  ? `YES — ${row.hookAuthority} can attach or replace code at any time, with no reissuance, no migration, and no signal to holders beyond the account write itself`
  : 'no — the authority is absent or burned');

const enforcement = (row.extensions ?? []).map((e) => e.name).filter((n) => ENFORCEMENT.has(n));
say('other enforcement', enforcement.length ? enforcement.join(', ') : 'none');

const w = Math.max(...out.map(([k]) => k.length));
console.log('');
for (const [k, v] of out) console.log(`  ${k.padEnd(w)}  ${v}`);
console.log('');

// The line that keeps this honest, printed every time rather than in a footnote.
if (enforcement.length) {
  console.log('  NOTE: the enforcement extensions above act TODAY, unlike an empty hook slot.');
  console.log('  A PermanentDelegate can already move a holder\'s tokens; Pausable can already');
  console.log('  block transfers. If you are here because of the hook, read that line again.');
  console.log('');
}
console.log('  This describes on-chain configuration, not anyone\'s intent, and it is not a');
console.log('  safety rating. Reserving a hook slot is common and often benign.');
console.log(`  source: ${source}`);
console.log('');
}

await main();
