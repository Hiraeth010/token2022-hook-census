# Enumeration limits on public infrastructure

> ## ⚠ CORRECTION — this document was partly wrong
>
> An earlier version of this file, written 2026-08-08, concluded that **"a complete census is
> infeasible on public infrastructure"** and that our dataset **"is a lower bound on a biased
> sample, and cannot be anything else"** without a paid RPC.
>
> Both statements were too strong, and later the same day we did much of what they said could
> not be done. The corrections are set out below. The original reasoning is kept rather than
> quietly deleted, because a stale "this is impossible" document sitting next to a dataset
> that did it anyway is exactly the kind of thing that should destroy a reader's trust in
> everything else we publish.

---

## What was wrong

### 1. "`getProgramAccounts` is unavailable" — overgeneralised

The tested claim was that no free endpoint serves `getProgramAccounts`. What was actually
tested was `getProgramAccounts` **against the Token-2022 program**.

`getProgramAccounts` against **ordinary custom programs works fine** on
`api.mainnet-beta.solana.com`. Token-2022 is specifically excluded, almost certainly because
it is one of the accounts-index-heavy programs providers blacklist. So a known hook program
can be enumerated directly, its accounts mined for embedded mint references, and those
candidates batch-verified. That is now Method F in `METHOD.md`.

Separate limits do apply to that path, and they are real:

- very large programs return `-32012 scan aborted: accumulated scan results exceeded the limit`;
- one hook program returned a response so large it exceeded Node's 512MB maximum string
  length while parsing, which is why the scanner now passes a `dataSlice`;
- sustained use exhausts the endpoint's data allowance and it starts returning HTTP 413.

### 2. "Cannot be anything but a biased sample" — false

It can be, and now is, **complete with respect to a named population**. Jupiter's token list
returns a `tokenProgram` field, so the Token-2022 subset can be extracted and every member
checked through `getMultipleAccounts` in batches of 100 — roughly 10 RPC calls per 1,000
mints, entirely on the free endpoint.

That produced a real denominator: **617 of the 944 Token-2022 mints in Jupiter's verified
list carry a TransferHook extension**. A proportion computed inside that population is
meaningful, which is something the earlier 11-row dataset could not offer at all.

Note for reproducers: `tokens.jup.ag` is unreachable from here; `lite-api.jup.ag` answers.

### 3. The paywall framing — half right, and worth restating carefully

The claim that the auditable account-level view of Solana sits behind a paywall was
rhetorically satisfying and partly wrong. A free endpoint plus a public token list gets a
long way. What the paywall actually costs is **chain-wide completeness**, not auditability.

---

## What remains true

- **Complete chain-wide enumeration still requires `getProgramAccounts` on Token-2022**, and
  that is still refused by every free endpoint tested. There is no way, on free
  infrastructure, to enumerate every hooked mint on mainnet.
- **`getSignaturesForAddress` cannot stride.** 1,000 Token-2022 signatures span roughly 7
  slots — about 3 seconds of chain — so transaction sampling remains near-worthless as a
  discovery method against a high-traffic program.
- **We can be checked for accuracy but not for completeness.** Every row we publish is one
  `getAccountInfo` away from independent verification by anyone. Whether we *missed* mints
  outside Jupiter's list is not checkable without a keyed RPC. That asymmetry is unchanged.
- **Jupiter's verified list is not the chain.** It is curated, and it excludes unverified,
  illiquid, new and delisted tokens — precisely where an undisclosed hook is most likely to
  sit. Completeness with respect to that list must never be reported as completeness.

## The original test, unchanged

One request per endpoint using a filter matching nothing (`dataSize: 1`), testing
**permission**, not running a scan. This was against the Token-2022 program.

| Endpoint | Result |
|---|---|
| `api.mainnet-beta.solana.com` | HTTP 403 — "Your IP or provider is blocked from this endpoint" |
| `solana-rpc.publicnode.com` | timeout at 12s |
| `solana.drpc.org` | HTTP 400 — "chain is not available on free plan" |
| `endpoints.omniatech.io` | HTTP 521 |
| `api.blockeden.xyz` | HTTP 402 — "A paid plan is required" |
| `solana.api.onfinality.io` | HTTP 429 — API key required |
| `go.getblock.io` | HTTP 401 — "Unknown token" |
| `mainnet.rpcpool.com` | HTTP 403 — "Access forbidden" |

**0 of 8 permit the call for Token-2022.** That result stands. The error was in what was
concluded from it.

## To close the remaining gap

Set `SOLANA_RPC_URL` to an endpoint permitting `getProgramAccounts` on Token-2022 and re-run.
The scanner auto-switches to the complete enumeration method, `coverage.complete` flips to
`true`, and holder counts populate. Everything already fetched is served from the on-disk
cache, so the re-run is cheap.
