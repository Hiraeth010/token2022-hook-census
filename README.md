# The Token-2022 Transfer Hook Census

**Which Solana tokens can have arbitrary code attached to their transfers, and who holds the key
that can attach it.**

Every row is derived from public RPC. Nothing here needs to be taken on trust — each figure is one
`getAccountInfo` away from being checked by anyone.

Observed **2026-08-08** on mainnet-beta.

---

## What it found

| | |
|---|---|
| Token-2022 mints carrying a `TransferHook` extension | **625** |
| …with a live hook program attached | **8** |
| …with `program_id` set to null — the slot reserved and empty | **617** |
| Distinct hook **authorities** across all 625 | **26** |
| Hook authorities that have been **burned** | **0** |
| Live hook programs that are **upgradeable** | **8 of 8** |
| Live hook programs that are **immutable** | **0** |

**Two keys control the hook authority on 576 of the 625 mints.**

### What that means, stated carefully

A `TransferHook` extension with a null `program_id` runs no code. It is inert today. But the
extension also carries an **authority**, and that authority can point the slot at a program later,
with no reissuance, no migration, and no signal to holders beyond the account write itself.

So the common configuration in this dataset — 617 of 625 — is best described as **armed but
unloaded**: no code runs on transfer now, and one key can change that.

This is a statement about **on-chain configuration**, not about anyone's intent. Reserving the slot
may well be forward planning, defensive, or simply what an issuer's tooling does by default. Several
of these mints belong to large, reputable issuers. The dataset reports what the accounts say; it does
not allege that anyone plans to use the capability, and no row should be read as an accusation.

The reason to publish it anyway: a holder cannot make that judgement without knowing the capability
exists, and **as far as we could find, nobody had assembled it.**

---

## Reproduce it

> **Corrected 2026-08-09.** This section previously said `node src/cli.mjs scan --out ./out`.
> There is no `scan` subcommand — that command exits 2 with `unknown argument: scan`. Worse,
> nobody could reach far enough to find out, because `src/enrich.mjs`, `src/enumerate.mjs` and
> `src/scan.mjs` imported `../chain.mjs` from the project that produced this dataset, and that
> file was never part of the publication. A fresh clone died on `ERR_MODULE_NOT_FOUND`, and
> `src/enumerate.test.mjs` never loaded at all.
>
> A repository whose whole claim is *recompute it, do not take our word for it* shipped with a
> front door that did not open. It was found by an outside reviewer running the command rather
> than reading it, which is the only way that kind of defect is ever found.
>
> Fixed by moving the RPC client into this repository (`src/rpc.mjs`) so it depends on nothing
> outside the clone. Verified by copying `src/` into an empty directory: 67/67 tests pass, and
> the command below reaches mainnet, verifies the seed candidates and starts the census.

```
node src/cli.mjs --out ./out
```

Every row re-derives from `getAccountInfo` on a public endpoint. `METHOD.md` gives the byte-level
TLV layout, the enumeration paths, and the exact calls.

## Read the limits before you quote a number

`ENUMERATION-LIMIT.md` is not boilerplate — it opens with a correction of this project's own earlier,
wrong conclusion, and it is the most important file here if you intend to cite the dataset.

The short version:

- **This is complete with respect to a named population, not with respect to the chain.** The
  candidate set comes from Jupiter's verified token list. Jupiter is curated, and it excludes
  unverified, illiquid, new and delisted tokens — **precisely where an undisclosed hook is most
  likely to sit.**
- **`getProgramAccounts` against Token-2022 is refused by every free endpoint tested** (8 of 8:
  403/402/401/429/400), so chain-wide enumeration is not possible on public infrastructure.
- **We can be checked for accuracy but not for completeness.** Every published row is verifiable by
  anyone. Whether rows are *missing* is not, without a keyed RPC.
- Holder counts are `not covered` for every row, for the same reason. They are not zero. They are
  absent, and the dataset says so rather than printing a zero.

An uncovered cell renders as `not covered`, never as a pass and never as a zero.

---

## Licence and provenance

Apache-2.0. Built as research infrastructure for [Escapement](https://github.com/Hiraeth010/escapement-indexer),
during work that ultimately abandoned transfer hooks as a design — the ecosystem evidence in this
dataset is a large part of why.

Corrections are welcome and will be published. If a row is wrong, the fastest way to show it is the
`getAccountInfo` call that disagrees.
