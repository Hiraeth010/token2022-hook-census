# The Census — method and reproduction

This document is written for someone trying to prove the dataset wrong. **Every published
value is derived from public Solana RPC** and can be re-checked with a single
`getAccountInfo`. There is no indexer and no proprietary source in the pipeline.

One qualification, stated up front rather than buried: a third-party API (Jupiter) is used
as a **candidate source** — it supplies a list of mint addresses to go and check. Nothing it
returns is republished. If that boundary matters to you, `--no-jupiter` disables it and the
scanner runs on RPC alone. See §4, Method E.

If you find a discrepancy, the raw responses every row was derived from are still on disk
under `data/census/.cache/`, so you can re-parse without re-scanning.

---

## 1. What the dataset claims

For each **live Solana mainnet-beta Token-2022 mint that carries a `TransferHook`
extension**, the census records the mint, its name and symbol, the hook program, whether
that hook program's code can still be replaced, who can replace it, when it was last
deployed, supply, decimals, holder count, the full extension set, and the state of the
mint's `ExtraAccountMetaList`.

**What it does not claim.** Unless `coverage.complete` is `true` in `census.json`, the
dataset is not a chain-wide count. It cannot support "there are N hooked mints on mainnet",
and it cannot support "mint X has no hook" for any X that is absent from it. The `coverage`
block states in one sentence which of these applies to the run you are looking at. Check it
before quoting anything.

**But there is now a real denominator.** One named population *is* covered exhaustively:
every Token-2022 mint in Jupiter's verified token list. Proportions computed inside that
population are meaningful. Proportions extrapolated from it to the chain are not — the
verified list is curated and excludes unverified, illiquid, new and delisted tokens, which
is exactly where an undisclosed hook is most likely to sit. `coverage.boundedPopulation`
carries the exact numbers.

Rows discovered outside that list (via seeds or sampling) are **additive finds, not a
sample**. Do not pool them with the bounded population to compute a rate.

**Unmeasured is not safe.** Any cell the scan did not actually measure renders as
`not covered`. A `0`, a blank, or an omitted row never means "we checked and it was fine".
In particular `hookProgramUpgradeable` has three distinct states — `true` (measured
mutable), `false` (measured immutable) and `null` (**not measured**) — and the renderer
prints all three differently.

---

## 2. Reproducing it

Requires Node 22+. No dependencies, no build step, no install.

```bash
cd ops

# Optional but strongly recommended — see §4 on why the public endpoint is not enough.
export SOLANA_RPC_URL="https://your-endpoint"

node src/census/cli.mjs
```

Outputs `data/census/census.json` and `data/census/census.md`.

Options:

| flag | default | effect |
|---|---|---|
| `--max-signatures N` | 1000 | signatures pulled per sampling root |
| `--max-transactions N` | 150 | transactions fetched per sampling root |
| `--frontier-rounds N` | 2 | expansion rounds into newly-discovered hook programs |
| `--holders` | off | attempt holder counts (needs `getProgramAccounts`) |
| `--refresh-signatures` | off | re-fetch signature pages instead of reusing the cached window |
| `--no-jupiter` | off | skip the Jupiter candidate source; run on RPC alone |
| `--out DIR` | `data/census` | output directory |

Signature pages are cached along with everything else, so a re-run walks the **same** window
of history and reproduces the same dataset. Pass `--refresh-signatures` to deliberately
sample a new window; expect it to find different mints, and expect the transaction cache to
miss.

The endpoint is read from `SOLANA_RPC_URL` only. It is never passed as an argument, so a
key cannot leak into shell history or a process listing. Only the endpoint **host** is
recorded in the output — never the full URL, which may carry an API key.

Run the tests with:

```bash
node --test "src/census/*.test.mjs"
```

These are offline and must pass with no network and no `SOLANA_RPC_URL`.

---

## 3. Byte layouts, and where they come from

Verified against the current `spl-token-2022` interface source rather than assumed. If any
of this is wrong, the whole dataset is wrong, so it is stated explicitly enough to check.

### Mint account

A Token-2022 mint that carries extensions is laid out as:

```
[0    .. 82 )   base Mint
[82   .. 165)   padding
[165  .. 166)   AccountType discriminator: 0 Uninitialized, 1 Mint, 2 Account
[166  .. end)   TLV entries
```

The padding to 165 exists so a mint can never be confused with a 165-byte token Account.
`BASE_ACCOUNT_LENGTH = 165 = Account::LEN`. An account of **exactly** 82 bytes is a legacy
mint with no extensions, and therefore no hook.

Each TLV entry is:

```
u16 LE  extension type
u16 LE  value length
bytes   value
```

Both the type (`#[repr(u16)]`) and the length (`Length(U16)`) are two bytes little-endian.

### Extension discriminants

`ExtensionType` is `#[repr(u16)]` in declaration order: `Uninitialized` 0,
`TransferFeeConfig` 1, `TransferFeeAmount` 2, `MintCloseAuthority` 3,
`ConfidentialTransferMint` 4, `ConfidentialTransferAccount` 5, `DefaultAccountState` 6,
`ImmutableOwner` 7, `MemoTransfer` 8, `NonTransferable` 9, `InterestBearingConfig` 10,
`CpiGuard` 11, `PermanentDelegate` 12, `NonTransferableAccount` 13, **`TransferHook` 14**,
`TransferHookAccount` 15, `ConfidentialTransferFeeConfig` 16,
`ConfidentialTransferFeeAmount` 17, `MetadataPointer` 18, `TokenMetadata` 19,
`GroupPointer` 20, `TokenGroup` 21, `GroupMemberPointer` 22, `TokenGroupMember` 23,
`ConfidentialMintBurn` 24, `ScaledUiAmount` 25, `Pausable` 26, `PausableAccount` 27,
`PermissionedBurn` 28.

> **Correction to the brief this was built from.** The specification given to us stated
> extension type 14, the discriminator at offset 165, TLV entries of
> `(u16 type, u16 length, bytes)`, `TransferHook` as `{ authority, program_id }`, and the
> PDA seed `["extra-account-metas", mint]`. All of that checked out against source. The
> only amendment is that the enum has since grown a `PermissionedBurn = 28` variant, which
> is included above. No correction to the hook layout itself was needed.

### TransferHook (type 14) — 64 bytes

```rust
pub struct TransferHook {
    pub authority: MaybeNull<Address>,   // 32 bytes
    pub program_id: MaybeNull<Address>,  // 32 bytes
}
```

`MaybeNull` means **all-zero encodes None**. This matters: the all-zero pubkey base58-encodes
to the System Program id `11111111111111111111111111111111`, so a naive parser reports
"this token's hook calls the System Program" when the truth is "no hook program is set".
The parser maps all-zero to `null` and a test asserts it is not the System Program.

Two independent mutability facts come out of this one struct, and the census keeps them
separate because they are separate risks:

- **`program_id`** — the program invoked on every transfer. Whether *its code* can be
  changed is the `hookProgramUpgradeable` column.
- **`authority`** — the key that can change `program_id` itself. A live authority can point
  the mint at an entirely different program, regardless of whether the current one is
  immutable. This is the `hookAuthorityCanRepoint` column.

A mint can therefore have a perfectly immutable hook program and still be fully mutable in
effect, because one key can swap the program out.

### Program upgradeability

For a hook program, read the program account and branch on its **owner**:

| owner | meaning |
|---|---|
| `BPFLoaderUpgradeab1e11111111111111111111111` | upgradeable loader — follow to ProgramData |
| `BPFLoader2111111111111111111111111111111111` | no upgrade instruction exists; code is fixed |
| `BPFLoader1111111111111111111111111111111111` | deprecated loader; code is fixed |
| `LoaderV411111111111111111111111111111111111` | loader-v4; check status |
| `NativeLoader1111111111111111111111111111111` | native program |
| anything else | **not covered** — recorded as `null`, never as immutable |

`UpgradeableLoaderState` is bincode with a `u32` LE enum tag:

```
Program:      tag 2 | programdata_address (32)                            = 36 bytes
ProgramData:  tag 3 | slot u64 LE (8) | Option<Pubkey> (1 tag + 32)       = 45 bytes metadata
```

So for the upgradeable loader: read the program account, take bytes `[4..36]` as the
ProgramData address, fetch that account, and read `[4..12]` as the last deploy slot and
`[12]` as the `Option` tag. **Tag 1 means a live upgrade authority sits at `[13..45]`;
tag 0 means the authority was burned and the program is immutable.** A tag that is neither
0 nor 1 is treated as unparseable and the row becomes `not covered` — never a pass.

`LoaderV4State` is `slot u64 (8) | authority (32) | status u64 (8)` = 48 bytes, with status
`0` retracted, `1` deployed, `2` finalized. Finalized is loader-v4's burned authority.

### ExtraAccountMetaList

PDA seeds are `["extra-account-metas", mint]` under the **hook program**, per
`EXTRA_ACCOUNT_METAS_SEED` in the transfer-hook interface.

The account's TLV discriminator is the 8-byte `SplDiscriminate` hash
`sha256("spl-transfer-hook-interface:execute")[0..8]` — the list is keyed by the
instruction it resolves accounts for, not by its own name. The scanner computes this at
runtime rather than hardcoding it, and a test asserts the derivation.

```
[0..8)    discriminator
[8..12)   u32 LE value length
[12..16)  u32 LE count
[16..)    count * 35-byte ExtraAccountMeta
              discriminator u8 | address_config [u8;32] | is_signer u8 | is_writable u8
```

`address_config` is only a literal pubkey when the entry discriminator is `0`. For `1` it is
packed seed config for a PDA of the hook program, and for `>= 128` a PDA of the program at
account index `disc - 128`. The census exposes the raw config hex for those rather than
printing seed bytes as though they were an address.

### PDA derivation

Implemented from scratch with no dependencies: base58, sha256, and an ed25519 on-curve test
(a candidate is a valid program address only when the hash does **not** decompress to a
curve point). Validated end-to-end against mainnet — the derived Metaplex metadata PDA for
USDC, `5x38Kp4hvdomTCnCrAny4UtMUt5rQBdB6px2K1Ui45Wq`, exists, is owned by the Metaplex
program, and its embedded `mint` field equals the USDC mint. A wrong on-curve test or a
wrong hash input could not have produced a live account. That value and an
associated-token-account derivation are pinned as test fixtures.

---

## 4. Enumeration — the hard part, and the honest limits

Finding *every* hooked mint is the difficult half of this problem. Four methods are
implemented and the scanner uses the strongest one the endpoint will actually serve.

### Method A — `gpa-full` (the only complete method)

```
getProgramAccounts(TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb, {
  filters: [{ memcmp: { offset: 165, bytes: <base58 of byte 0x01> } }]
})
```

This returns every Token-2022 account whose `AccountType` discriminator is `Mint` — i.e.
every mint that carries extensions. Each account's TLV region is then walked locally and
those with extension 14 are kept.

This is **complete by construction**: a hooked mint necessarily carries extensions, so it
necessarily appears in this result. There is no filter on the hook itself, so no mint can
hide behind an unusual TLV ordering.

It is also expensive, and most public endpoints refuse it.

### Method B — `gpa-offset-sweep` (partial)

One `getProgramAccounts` per candidate byte offset, filtered on the four-byte TransferHook
TLV header (`14, 0, 64, 0` little-endian):

```
filters: [
  { memcmp: { offset: 165,     bytes: <base58 of 0x01> } },
  { memcmp: { offset: <offset>, bytes: <base58 of [14,0,64,0]> } },
]
```

Candidate offsets are generated by walking every combination of up to N preceding
**fixed-size** mint extensions from 166. Cheaper than A, but **partial**: a mint carrying a
variable-length extension (e.g. `TokenMetadata`) before its hook lands on an offset the
sweep cannot enumerate. The exact offsets swept are recorded in the output.

### Method C — `tx-sample` (partial)

Sample a program's transaction history via `getSignaturesForAddress`, fetch a sample of
those transactions, and harvest **every** account key referenced — including addresses
loaded from address-lookup tables, so a mint touched via an ALT is not missed. Every
harvested account is then fetched in batches of 100 with `getMultipleAccounts` and tested.

Discovered hook programs are fed back in as new sampling roots for the next round: a hook
program's own history is far denser in hooked mints than general Token-2022 traffic.

**Bias, stated plainly:** discovery is proportional to recent transfer activity. A hooked
mint that has not moved inside the sampled slot window is systematically invisible to this
method. The exact slot range sampled is recorded per root in the output so the blind spot
is checkable rather than merely admitted.

**And a much sharper limitation, found while running it.** `getSignaturesForAddress` walks
history newest-first and *contiguously* — it cannot skip or stride. On a program as busy as
Token-2022, a full 1000-signature page turns out to span only **one or two slots**, i.e.
under a second of chain time. Sampling the Token-2022 program as a root is therefore close
to worthless as a discovery mechanism: it inspects roughly one second of mainnet and would
need on the order of 10^8 requests to cover a year. The scanner measures this span per root
and emits an explicit warning into `census.md` whenever a root's page collapses to ≤ 5
slots, so the number is never mistaken for broad historical coverage.

The same method is genuinely useful on an *individual hook program*, where traffic is low
enough that 1000 signatures can span weeks — which is why discovered hook programs are fed
back in as roots. That path only opens once at least one hooked mint has been found, so it
amplifies discovery rather than bootstrapping it.

**The practical consequence:** without `getProgramAccounts` there is no viable route to a
complete census. Methods C and D are worth running and worth publishing, but they are not a
substitute for Method A, and this document does not present them as one.

### Method D — `seed-verify` (partial)

Verify an explicit candidate list (`src/census/seeds.json`). Coverage is exactly that list.
Nothing in the seeds file is asserted to be true — every entry is a candidate that the
scanner checks against mainnet, and candidates that do not exist, are not Token-2022, or
carry no hook are dropped and never appear in the census. Sources are recorded per entry so
selection bias can be judged. The list includes deliberate negative controls.

**Seed promotion.** Because Method C walks a different slot window on every run, a mint it
found once would silently vanish from the next run's output. Confirmed hooked mints are
therefore promoted into `seeds.json`, each carrying the run date and slot window it was
originally discovered in, so coverage only ever grows. Note the consequence for reading the
data: after promotion a row's `discoveredBy` reads `seed-verify` even though it was
originally found by sampling. The `source` field in `seeds.json` preserves the real
provenance.

This makes the seed list **cumulative and strongly biased** — it over-represents whatever
earlier runs happened to touch. That is fine for a lower bound and fatal for any attempt to
reason about proportions. Do not compute percentages from these rows.

### Method E — `jupiter-verified-list` (complete for a named population)

This is what moved the census from a biased handful to something with a denominator.

```
GET https://lite-api.jup.ag/tokens/v2/tag?query=verified
```

Every entry carries a `tokenProgram` field. Filter to
`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`, then push the resulting addresses through
`getMultipleAccounts` in batches of 100 — about **10 RPC calls per 1,000 mints**, all on the
free endpoint. The 944 Token-2022 mints in the verified list cost roughly ten requests.

Reproducer's note: **`tokens.jup.ag` is unreachable; `lite-api.jup.ag` is the host that
answers.**

**The boundary that matters.** Jupiter supplies *a list of addresses to go and check* and
nothing else. Every published field — extensions, hook program, hook authority, upgrade
authority, supply, decimals — comes from our own `getMultipleAccounts` response parsed by
our own TLV parser. The API also returns `holderCount`, `fdv` and `mcap`; we deliberately do
**not** republish those, because a reader cannot check them against RPC, and an
unverifiable cell is exactly what this project refuses to ship. Run with `--no-jupiter` to
confirm the RPC-only path still works.

This method is **complete with respect to Jupiter's verified list** and says nothing
whatsoever about mints outside it.

### Method F — `gpa-hook-program` (partial, per program)

Public endpoints refuse `getProgramAccounts` on Token-2022 but **serve it normally for
ordinary custom programs**. So once a hook program is known, its own accounts can be
enumerated directly:

1. `getProgramAccounts(<hookProgram>)` with a `dataSlice` cap.
2. Slide a 32-byte window across each account's data at every alignment.
3. base58-encode each window, skipping all-zero ones (they decode to the System Program).
4. Batch-verify the distinct candidates as mints.

The layout of a hook program's per-mint accounts is program-specific, so the scanner does
not guess offsets — it takes every alignment and lets the on-chain check decide.

Three failure modes are real and are reported rather than swallowed:

- `-32012 scan aborted: accumulated scan results exceeded the limit` on high-PDA-count programs;
- responses large enough to exceed Node's 512MB maximum string length while parsing, which
  is why a `dataSlice` is applied (one hook program hit this);
- HTTP 413 "You have used your data allowance" once the endpoint's quota is spent.

Complete for the accounts of the programs it successfully enumerates; silent about any mint
whose hook program stores no reference to it.

### Holder counts

Counting holders needs `getProgramAccounts` on Token-2022 filtered by mint, in two queries,
because a Token-2022 token account may or may not carry extensions: plain accounts are
exactly 165 bytes, extended ones are longer and carry `AccountType::Account` (2) at offset
165. Both are filtered on the mint at offset 0 and counted where the amount at offset 64 is
non-zero.

When `getProgramAccounts` is unavailable this is reported as `not covered`. **It is never
reported as 0.**

---

## 5. What was blocked, and what actually ran

The runs behind the committed dataset used the default public endpoint,
`api.mainnet-beta.solana.com`, because `SOLANA_RPC_URL` was not set.

### Run history

Runs on 2026-08-08, all on the free public endpoint.

| run | method mix | outcome |
|---|---|---|
| 1 | 3 seeds + 400-tx sample (slots 437963343-437963350) | 6 hooked mints |
| 2 | 15 seeds + tx sample | abandoned — endpoint throttled to ~7 tx/min |
| 3 | 15 seeds + 100-tx sample (57 refused) | 11 hooked mints |
| 4 | 24 seeds + **Jupiter verified list** + hook-program GPA + tx sample | **625 hooked mints — the committed dataset** |

Run 4 is where the enumeration blocker was routed around. See §4 Methods E and F, and the
correction notice at the top of `ENUMERATION-LIMIT.md`, which run 4 partly invalidated.

Mints discovered by sampling in earlier runs were promoted into `seeds.json` with their
originating slot window recorded (§4, "Seed promotion"), so coverage only grows.

Honest wrinkles in the committed run, all visible in the output rather than hidden:

- **All three hook-program GPA scans failed.** `fragnAis…` returned a response exceeding
  Node's 512MB string limit (the `dataSlice` fix landed after this run and is untested
  against it); the other two returned HTTP 413 once the endpoint's data allowance was spent
  by the 944-mint sweep. Method F therefore contributed **zero** rows to the committed
  dataset and is recorded as unavailable for each program.
- **Holder counts are `not covered` for all 625 rows.**
- **`slotRange.end` may be `null`** when the closing `getSlot` is rate-limited; it renders as
  `not covered` rather than being back-filled with the start slot.

### The blocking issue

The public endpoint answers `getHealth`, `getSlot`, `getAccountInfo`,
`getMultipleAccounts`, `getSignaturesForAddress` and `getTransaction`, but returns
**HTTP 403 "Your IP or provider is blocked from this endpoint"** for every
`getProgramAccounts` call. This is a structural refusal, not a rate limit — the scanner
distinguishes the two and does not retry a refusal.

Consequently:

- **Method A did not run.** No complete enumeration was obtained.
- **Method B did not run.** It also needs `getProgramAccounts`.
- **Holder counts were not measured** for any row.
- Methods C and D produced the dataset, which is therefore **partial**.

To lift this, set `SOLANA_RPC_URL` to any endpoint that permits `getProgramAccounts` on the
Token-2022 program and re-run. The scanner will detect availability at the probe step and
automatically switch to Method A, and the output's `coverage.complete` will flip to `true`.
The cache makes the re-run cheap for everything already fetched.

---

## 6. Caching, resumability and auditability

Raw RPC responses are cached to `data/census/.cache/`:

- `accounts/<pubkey>.json` — one file per account, storing the raw base64 value plus the
  slot and wall-clock time it was taken at.
- `rpc/<hash>.json` — other responses, keyed by a hash of the request.
- `state.json` — scan cursors and discovered sets, so a run interrupted by a rate-limit wall
  can resume.

A cached account with `value: null` is a **measurement** ("this account did not exist at
that slot"), not a cache miss, and is returned as such.

Rate limiting is handled with exponential backoff plus jitter, with retries only for
transient failures (HTTP 429/5xx, timeouts, socket errors). Structural refusals
(HTTP 401/403/410, JSON-RPC `-32601`, "disabled"/"not supported" messages) are never
retried; they cause a documented fall-through to the next method.

Because every row is derived from a cached raw response, a reviewer can re-run the parser
over the cache offline and reproduce the table byte-for-byte without touching the network.

---

## 7. Deliberate non-claims

- No statement is made about anyone's **intent**. An upgradeable hook program is a fact
  about an account's `upgrade_authority` field, not an accusation. Upgradeability is
  routine and often deliberate; it is recorded because holders cannot see it, not because
  it is evidence of bad faith.
- No token is described as safe. A burned upgrade authority is one property among many and
  the census measures only what is listed in §1.
- Absence from the dataset means the scan did not reach the mint. It never means the mint
  has no hook.
