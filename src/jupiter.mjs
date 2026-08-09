/**
 * jupiter.mjs — a CANDIDATE SOURCE, not a data source.
 *
 * This is the one place in the census that touches a third-party API, so the boundary is
 * worth stating precisely:
 *
 *   Jupiter supplies a LIST OF MINT ADDRESSES TO GO AND CHECK. Nothing else it returns is
 *   ever published. Every field in the census — extensions, hook program, hook authority,
 *   upgrade authority, supply, decimals — comes from our own getAccountInfo /
 *   getMultipleAccounts call and our own TLV parser.
 *
 * The list is used because it has a property nothing else available here has: it is a
 * defined, nameable, reproducible population. "Every Token-2022 mint in Jupiter's verified
 * list" is a real denominator. It is emphatically NOT the whole chain, and the coverage
 * language must never imply that it is.
 *
 * Deliberately unused: the API also returns `holderCount`, `fdv`, `mcap` and similar. We do
 * not republish those. A reader cannot check them against RPC, which is exactly the kind of
 * unverifiable cell this project refuses to ship.
 */

import { TOKEN_2022_PROGRAM } from './tlv.mjs';

export const JUPITER_BASE = 'https://lite-api.jup.ag';

/**
 * Note for reproducers: the older `tokens.jup.ag` host is unreachable from here.
 * `lite-api.jup.ag` is the one that answers.
 */
export const JUPITER_TAG_ENDPOINT = `${JUPITER_BASE}/tokens/v2/tag?query=verified`;

async function fetchJson(url, { timeoutMs = 30_000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

/**
 * Fetch Jupiter's verified token list and return the Token-2022 subset as candidates.
 *
 * Returns null on failure — the caller then reports the method as unavailable rather than
 * quietly producing a smaller census that looks like a complete one.
 *
 * @returns {Promise<{candidates: string[], labels: Map<string,object>, totalInList: number,
 *                    token2022Count: number, endpoint: string, fetchedAt: string}|null>}
 */
export async function fetchJupiterToken2022Candidates({ cache, log = () => {} } = {}) {
  const cacheKey = `jupiter:${JUPITER_TAG_ENDPOINT}`;
  let list = null;
  let fetchedAt = null;

  if (cache) {
    const hit = await cache.getRpc(cacheKey);
    if (hit) {
      list = hit.result;
      fetchedAt = hit.fetchedAt;
      log(`[jupiter] using cached token list (${list.length} entries, fetched ${fetchedAt})`);
    }
  }

  if (list === null) {
    try {
      log(`[jupiter] fetching ${JUPITER_TAG_ENDPOINT}`);
      list = await fetchJson(JUPITER_TAG_ENDPOINT);
    } catch (err) {
      console.error(`[jupiter] token list fetch failed: ${err.message}`);
      return null;
    }
    if (!Array.isArray(list)) {
      console.error('[jupiter] unexpected response shape — expected an array');
      return null;
    }
    fetchedAt = new Date().toISOString();
    if (cache) await cache.putRpc(cacheKey, list);
  }

  const labels = new Map();
  const candidates = [];
  for (const t of list) {
    if (!t || typeof t.id !== 'string') continue;
    if (t.tokenProgram !== TOKEN_2022_PROGRAM) continue;
    candidates.push(t.id);
    // Kept only to cross-check our own on-chain metadata parse, never as a source of truth.
    labels.set(t.id, { symbol: t.symbol ?? null, name: t.name ?? null });
  }

  log(`[jupiter] ${candidates.length} Token-2022 mints out of ${list.length} verified tokens`);

  return {
    candidates,
    labels,
    totalInList: list.length,
    token2022Count: candidates.length,
    endpoint: JUPITER_TAG_ENDPOINT,
    fetchedAt,
  };
}
