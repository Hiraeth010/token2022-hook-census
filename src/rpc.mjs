/**
 * rpc.mjs — read-only Solana JSON-RPC, with no dependencies and no project coupling.
 *
 * ---------------------------------------------------------------------------
 * Why this file exists
 *
 * The census used to import `../chain.mjs`, the parent project's chain client.
 * That was fine locally and broken everywhere else: `chain.mjs` sits outside the
 * census directory, so it was not part of the published repository, and the
 * command the census README leads with —
 *
 *     node src/cli.mjs scan --out ./out
 *
 * — died on a fresh clone with ERR_MODULE_NOT_FOUND. A dataset whose entire
 * claim is "reproduce it, do not take our word for it" shipped with a front
 * door that did not open. An independent judge found it by running the command
 * rather than reading it, which is the only way that class of defect is ever
 * found.
 *
 * The fix is not to copy a file next to the other one. It is to remove the
 * dependency: a repository published as independently reproducible must not
 * reach into the project that produced it. So the generic client lives HERE,
 * inside the census, and `chain.mjs` re-exports from this module rather than
 * the other way round. There is still exactly one implementation — the census
 * simply owns it, because the census is the part that has to survive being
 * copied somewhere else.
 *
 * Constraints this module holds to, because the census's value depends on them:
 *   - No dependencies. Node's built-in `fetch` only.
 *   - Read-only. No signing, no keypair import, no transaction construction.
 *   - A refusal is distinguishable from an absence. See `RpcError.isRefusal`:
 *     "this endpoint will not answer that" and "the answer is nothing" are
 *     different facts, and a census that conflates them reports a false zero.
 * ---------------------------------------------------------------------------
 */

export function rpcUrl() {
  return process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
}

/** Thrown by `rpc` so callers can distinguish "endpoint refuses this method" from "no data". */
export class RpcError extends Error {
  constructor(message, { method, httpStatus = null, code = null } = {}) {
    super(message);
    this.name = 'RpcError';
    this.method = method;
    this.httpStatus = httpStatus;
    this.code = code;
  }

  /**
   * True when the endpoint structurally refuses the call (plan/permission), as opposed to
   * a transient failure. Retrying will not help; the caller should fall back to another method.
   */
  get isRefusal() {
    if (this.httpStatus === 401 || this.httpStatus === 403 || this.httpStatus === 410) return true;
    if (this.code === -32601) return true; // method not found
    return /disabled|not (?:supported|enabled|available)|blocked|excluded from account secondary indexes|requires? .*(?:plan|tier)|unauthoriz/i
      .test(this.message);
  }

  /** Transient: rate limit or upstream hiccup. Worth backing off and retrying. */
  get isTransient() {
    if (this.httpStatus === 429 || (this.httpStatus >= 500 && this.httpStatus <= 599)) return true;
    return /rate.?limit|too many requests|timeout|aborted|fetch failed|socket|ECONNRESET|EAI_AGAIN|network/i
      .test(this.message);
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Raw JSON-RPC call. Throws RpcError; the exported wrappers below convert that to `null`.
 * Retries transient failures with exponential backoff + jitter. Never retries a refusal.
 */
export async function rpc(method, params, {
  url = rpcUrl(),
  timeoutMs = 15_000,
  retries = 4,
  baseDelayMs = 500,
  onRetry = null,
} = {}) {
  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
        signal: ctrl.signal,
      });
      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch { /* non-JSON body, handled below */ }

      if (!res.ok) {
        const msg = json?.error?.message || text.slice(0, 200) || `HTTP ${res.status}`;
        throw new RpcError(`RPC ${method} HTTP ${res.status}: ${msg}`, {
          method, httpStatus: res.status, code: json?.error?.code ?? null,
        });
      }
      if (json === null) throw new RpcError(`RPC ${method}: non-JSON response`, { method, httpStatus: res.status });
      if (json.error) {
        throw new RpcError(`RPC ${method}: ${json.error.message}`, {
          method, httpStatus: res.status, code: json.error.code ?? null,
        });
      }
      return json.result;
    } catch (err) {
      lastErr = err instanceof RpcError
        ? err
        : new RpcError(`RPC ${method}: ${err.message}`, { method });
      if (lastErr.isRefusal || attempt === retries || !lastErr.isTransient) break;
      const delay = Math.round(baseDelayMs * 2 ** attempt * (0.5 + Math.random()));
      if (onRetry) onRetry({ method, attempt: attempt + 1, delayMs: delay, error: lastErr });
      await sleep(delay);
    } finally {
      clearTimeout(t);
    }
  }
  throw lastErr;
}

export async function getSlot(opts = {}) {
  try {
    return await rpc('getSlot', [{ commitment: 'confirmed' }], opts);
  } catch (err) {
    console.error(`[rpc] getSlot failed: ${err.message}`);
    return null;
  }
}

/**
 * Raw account fetch, base64. Returns `{ value, slot }` where `value` is null when the
 * account does not exist — which is a *measurement*, distinct from the `null` this returns
 * on RPC failure, which is *absence of measurement*. Callers must not conflate the two.
 */
export async function getAccountInfo(address, opts = {}) {
  try {
    const result = await rpc('getAccountInfo', [
      address, { commitment: 'confirmed', encoding: 'base64' },
    ], opts);
    return { value: result?.value ?? null, slot: result?.context?.slot ?? null };
  } catch (err) {
    console.error(`[rpc] getAccountInfo(${address}) failed: ${err.message}`);
    return null;
  }
}

/** Batched account fetch (max 100 per call, enforced here). Null on failure. */
export async function getMultipleAccounts(addresses, opts = {}) {
  if (addresses.length > 100) {
    console.error(`[rpc] getMultipleAccounts called with ${addresses.length} > 100 addresses`);
    return null;
  }
  try {
    const result = await rpc('getMultipleAccounts', [
      addresses, { commitment: 'confirmed', encoding: 'base64' },
    ], opts);
    return { values: result?.value ?? [], slot: result?.context?.slot ?? null };
  } catch (err) {
    console.error(`[rpc] getMultipleAccounts(${addresses.length} keys) failed: ${err.message}`);
    return null;
  }
}

/**
 * getProgramAccounts. Deliberately rethrows RpcError so the caller can tell
 * "this endpoint refuses GPA" (fall back to another enumeration method, label the
 * dataset partial) apart from "GPA ran and found nothing" (a real, complete zero).
 * Every other helper here returns null; this one is the documented exception, and
 * ENUMERATION-LIMIT.md is entirely about why that distinction is load-bearing.
 */
export async function getProgramAccountsOrThrow(programId, config = {}, opts = {}) {
  return await rpc('getProgramAccounts', [
    programId, { commitment: 'confirmed', encoding: 'base64', ...config },
  ], { timeoutMs: 120_000, retries: 2, ...opts });
}

/** Signature history for an address, newest first. Null on failure. */
export async function getSignaturesForAddress(address, { limit = 1000, before = null, until = null } = {}, opts = {}) {
  try {
    const cfg = { limit, commitment: 'confirmed' };
    if (before) cfg.before = before;
    if (until) cfg.until = until;
    return await rpc('getSignaturesForAddress', [address, cfg], { timeoutMs: 60_000, ...opts });
  } catch (err) {
    console.error(`[rpc] getSignaturesForAddress(${address}) failed: ${err.message}`);
    return null;
  }
}
