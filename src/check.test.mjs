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

test('no argument exits non-zero with usage', () => {
  const { code, out } = run([]);
  assert.equal(code, 2);
  assert.match(out, /Usage:/);
});
