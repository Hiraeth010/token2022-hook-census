#!/usr/bin/env node
/**
 * cli.mjs — one-command reproduction.
 *
 *   in this repository:      node src/census/cli.mjs [options]
 *   in the published census: node src/cli.mjs [options]
 *
 * There is NO subcommand. `cli.mjs scan` exits 2 with "unknown argument", and
 * the published README said exactly that for a while — behind a missing-module
 * error that stopped anyone reaching it.
 *
 * Reads the endpoint from SOLANA_RPC_URL. Never takes a key on the command line, so the
 * key cannot end up in shell history or in a process listing shared over a screen.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runCensus } from './scan.mjs';
import { renderCensusMarkdown } from './render.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OPS_ROOT = join(HERE, '..', '..');

/**
 * Where results go when `--out` is not given.
 *
 * FIXED 2026-08-09. This was unconditionally `OPS_ROOT/data/census`, which is
 * correct inside the project tree and wrong everywhere else: in the published
 * standalone repository, `src/` sits at the root, so that path resolves to
 * `<clone>/../../data/census` — OUTSIDE the clone, in whatever directory the
 * user happened to put it next to. A tool published for strangers to run should
 * not write above the directory they cloned into.
 *
 * The detection is deliberately a filesystem fact rather than an environment
 * variable or a build flag, so the same file behaves correctly in both places
 * with nothing to configure and nothing to forget.
 */
const IN_PROJECT_TREE = existsSync(join(OPS_ROOT, 'data'));
const DEFAULT_OUT = IN_PROJECT_TREE ? join(OPS_ROOT, 'data', 'census') : join(process.cwd(), 'out');

/** How this file is actually invoked, so the usage text is right in both trees. */
const SELF = IN_PROJECT_TREE ? 'src/census/cli.mjs' : 'src/cli.mjs';

function parseArgs(argv) {
  const args = {
    maxTransactions: 150,
    maxSignatures: 1000,
    frontierRounds: 2,
    includeHolders: false,
    refreshSignatures: false,
    useJupiter: true,
    outDir: DEFAULT_OUT,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--max-transactions') args.maxTransactions = Number(next());
    else if (a === '--max-signatures') args.maxSignatures = Number(next());
    else if (a === '--frontier-rounds') args.frontierRounds = Number(next());
    else if (a === '--holders') args.includeHolders = true;
    else if (a === '--refresh-signatures') args.refreshSignatures = true;
    else if (a === '--no-jupiter') args.useJupiter = false;
    else if (a === '--out') args.outDir = next();
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node ${SELF} [options]

  --max-transactions N   transactions fetched per sampling root (default 150)
  --max-signatures N     signatures pulled per sampling root (default 1000)
  --frontier-rounds N    expansion rounds into discovered hook programs (default 2)
  --holders              attempt holder counts (requires getProgramAccounts)
  --refresh-signatures   re-fetch signature pages instead of reusing the cached
                         window (a cached window is what makes a run reproducible)
  --no-jupiter           skip the Jupiter verified-list candidate source (RPC only)
  --out DIR              output directory (default: ${DEFAULT_OUT})

There is no subcommand. This is the whole interface: "cli.mjs scan" is not a
thing and exits 2. If you read that somewhere, it was our documentation being
wrong — a defect we would rather you reported than worked around.

Environment:
  SOLANA_RPC_URL         RPC endpoint. Falls back to the public mainnet endpoint,
                         which refuses getProgramAccounts and therefore yields
                         only a PARTIAL census.`);
      process.exit(0);
    } else {
      console.error(`unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!process.env.SOLANA_RPC_URL) {
    console.warn('[census] SOLANA_RPC_URL is not set — falling back to the public endpoint.');
    console.warn('[census] The public endpoint refuses getProgramAccounts, so the result WILL be partial.');
  }

  const cacheDir = join(args.outDir, '.cache');
  await mkdir(args.outDir, { recursive: true });

  const dataset = await runCensus({
    cacheDir,
    statePath: join(cacheDir, 'state.json'),
    seedsPath: join(HERE, 'seeds.json'),
    maxSignatures: args.maxSignatures,
    maxTransactions: args.maxTransactions,
    frontierRounds: args.frontierRounds,
    includeHolders: args.includeHolders,
    refreshSignatures: args.refreshSignatures,
    useJupiter: args.useJupiter,
  });

  const jsonPath = join(args.outDir, 'census.json');
  const mdPath = join(args.outDir, 'census.md');

  await writeFile(jsonPath, JSON.stringify(dataset, null, 2), 'utf8');
  await writeFile(mdPath, renderCensusMarkdown(dataset), 'utf8');

  console.log('');
  console.log(`[census] coverage: ${dataset.coverage.complete ? 'COMPLETE' : 'PARTIAL'}`);
  console.log(`[census] hooked mints in dataset: ${dataset.summary.hookedMintsFound}`);
  console.log(`[census] candidates checked: ${dataset.coverage.candidatesChecked}`);
  console.log(`[census] wrote ${jsonPath}`);
  console.log(`[census] wrote ${mdPath}`);

  if (!dataset.coverage.complete) {
    const bp = dataset.coverage.boundedPopulation;
    console.log('');
    if (bp) {
      console.log(`[census] PARTIAL for mainnet; COMPLETE for one named population:`);
      console.log(`[census]   ${bp.carryingTransferHook} of ${bp.mintsSuccessfullyParsed} Token-2022 mints in Jupiter's verified list carry a TransferHook.`);
      console.log('[census] That list is curated and is NOT the chain. Do not quote the row count');
      console.log('[census] as a mainnet total, and do not extrapolate the proportion beyond the list.');
    } else {
      console.log('[census] This dataset is PARTIAL. It is a lower bound on a biased sample.');
      console.log('[census] Do not quote its row count as a mainnet total.');
    }
  }
}

main().catch((err) => {
  console.error(`[census] fatal: ${err.stack || err.message}`);
  process.exit(1);
});
