/**
 * Tests for check.mjs.
 *
 * The first two matter far more than the rest. This tool exists to be run by
 * someone deciding whether to hold a token, and the two ways it could do real
 * harm are (a) implying safety it has not measured, and (b) reporting an
 * unmeasured mint as if it had been checked and found clean.
 *
 * Offline. Runs the CLI as a subprocess against the committed dataset.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI = join(HERE, 'check.mjs');

function run(args) {
  try {
    return { code: 0, out: execFileSync('node', [CLI, ...args], { encoding: 'utf8' }) };
  } catch (e) {
    return { code: e.status, out: (e.stdout ?? '') + (e.stderr ?? '') };
  }
}

// A mint that is real, well known, and deliberately NOT in the dataset.
const NOT_IN_DATASET = 'So11111111111111111111111111111111111111112';
// Ondo's USDon: hook slot present but null, with enforcement extensions that act today.
const ONDO = 'ZPFtoCe7WWqG4N3ZFRccS8T9SMBeHsd1Vmgv2i7ondo';
// Fragmetric Squared: a live, attached, upgradeable hook.
const LIVE_HOOK = 'FRAG2gPNXozPpYcn2a8zK7YdtfNXCLsioZNwZXwTQ3cP';

test('an unmeasured mint is NEVER reported as having no hook', () => {
  // The single most damaging thing this tool could do is print a clean bill of
  // health for a mint it never looked at. The census is complete with respect to
  // a named population, not the chain.
  const { code, out } = run([NOT_IN_DATASET]);
  assert.equal(code, 3, 'absence of measurement must not exit 0');
  assert.match(out, /NOT MEASURED/);
  assert.match(out, /NOT the same as "it has no transfer hook"/);
  assert.doesNotMatch(out, /no hook found|has no transfer hook\.|clean/i);
});

test('the tool never tells anyone a token is safe', () => {
  for (const mint of [ONDO, LIVE_HOOK]) {
    const { out } = run([mint]);
    assert.doesNotMatch(out, /\bis safe\b|\bsafe to\b|\blooks safe\b|\bno risk\b/i, `${mint} drew a safety claim`);
    // \s+ rather than a literal space: the disclaimer wraps across lines, and a
    // test that only passes while the wrapping happens to fall in one place is a
    // test about formatting rather than about the claim.
    assert.match(out, /not\s+a\s+safety\s+rating/i, `${mint} omitted the disclaimer`);
    assert.match(out, /configuration,\s+not\s+anyone's\s+intent/i);
  }
});

test('a null hook slot is reported as reserved-and-empty, not as absent', () => {
  const { code, out } = run([ONDO]);
  assert.equal(code, 0);
  assert.match(out, /program_id is null/);
  assert.match(out, /can it be repointed\s+YES/);
});

test('extensions that act today are surfaced above the empty hook slot', () => {
  // The census's headline finding is about a capability that is dormant. A
  // PermanentDelegate is not dormant, and a reader who came for the hook should
  // not leave without knowing which one can touch their tokens right now.
  const { out } = run([ONDO]);
  assert.match(out, /PermanentDelegate/);
  assert.match(out, /act TODAY, unlike an empty hook slot/);
});

test('an attached hook reports the program and whether it can be replaced', () => {
  const { code, out } = run([LIVE_HOOK]);
  assert.equal(code, 0);
  assert.match(out, /ATTACHED — code runs on every transfer/);
  assert.match(out, /UPGRADEABLE/);
});

test('every answer names the source it came from', () => {
  // A dated snapshot presented without its date is a claim about the present
  // that nobody can check, and hook authorities can be repointed silently.
  for (const mint of [ONDO, LIVE_HOOK]) {
    assert.match(run([mint]).out, /source: .*census\.json \(observed /);
  }
});

test('a malformed address is distinguished from an unmeasured one', () => {
  // Both used to print NOT MEASURED and exit 3, so a typo'd mint was
  // indistinguishable from a mint that genuinely had not been looked at.
  // Someone chasing a scam token is exactly the person who pastes a mangled
  // address, and telling them "not measured" sends them looking for the wrong
  // thing.
  const bad = run(['not-a-mint-!!!']);
  assert.equal(bad.code, 2, 'malformed input is a different failure from unmeasured');
  assert.match(bad.out, /not a valid base58 Solana address/);
  assert.doesNotMatch(bad.out, /NOT MEASURED/);

  // 0, O, I and l are not in the base58 alphabet — the classic paste corruption.
  assert.equal(run(['0OIl' + 'A'.repeat(40)]).code, 2);

  // And a well-formed address that simply is not in the dataset is unchanged.
  assert.equal(run([NOT_IN_DATASET]).code, 3);
});

test('a dated snapshot says so on the confident path, not only when it misses', () => {
  // A hook authority can be repointed silently, so a snapshot is a claim about
  // the past wearing the clothes of the present. The not-in-dataset path already
  // nudged toward --live; without this the CONFIDENT-looking answer was the one
  // that went quietly stale.
  const { out } = run([ONDO]);
  assert.match(out, /STALE:\s+this snapshot is \d+ day\(s\) old/);
  assert.match(out, /Re-check with --live/);
});

/**
 * The --live path had NO test at all, and that is how it shipped returning a
 * strictly weaker answer than the dataset on the one fact that matters most to
 * a holder — whether the hook program's code can be swapped. The dataset path
 * printed "UPGRADEABLE — <authority> can replace its logic"; live mode left the
 * field undefined so the line vanished, and an absent line reads as "nothing to
 * report" rather than "not checked".
 *
 * This test needs the network, so it is opt-in: the rest of this suite is
 * offline and the README says so, and quietly making it networked would trade
 * one false claim for another. Run with CENSUS_LIVE_TESTS=1.
 */
const LIVE = process.env.CENSUS_LIVE_TESTS === '1';

test('--live resolves upgradeability rather than going quiet', { skip: !LIVE && 'set CENSUS_LIVE_TESTS=1 (needs RPC)' }, () => {
  const ds = run([LIVE_HOOK]).out;
  const lv = run([LIVE_HOOK, '--live']).out;

  // Both must SAY something about it. Never silence.
  assert.match(ds, /hook program is\s+\S/);
  assert.match(lv, /hook program is\s+\S/, '--live must not omit the line');

  // And live must not be the weaker answer.
  const auth = (ds.match(/UPGRADEABLE — (\S+)/) ?? [])[1];
  assert.ok(auth, 'precondition: the dataset resolves an upgrade authority for this mint');
  assert.match(lv, new RegExp(`UPGRADEABLE — ${auth}`), '--live disagreed with the dataset');
});

test('--live rejects a malformed address too', { skip: !LIVE && 'set CENSUS_LIVE_TESTS=1 (needs RPC)' }, () => {
  const { code, out } = run(['not-a-mint-!!!', '--live']);
  assert.notEqual(code, 0);
  assert.doesNotMatch(out, /NOT MEASURED/);
});

test('no argument exits non-zero with usage', () => {
  const { code, out } = run([]);
  assert.equal(code, 2);
  assert.match(out, /Usage:/);
});
