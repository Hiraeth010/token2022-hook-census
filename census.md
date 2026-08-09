# The Census — Token-2022 mints carrying a TransferHook extension

Solana mainnet-beta. Generated 2026-08-08T10:26:05.832Z.
Slot range of this run: 437975411 → 437975446.

## Coverage

> ### ⚠ THIS IS A PARTIAL DATASET
>
> Read this before quoting any number below.
>
> PARTIAL FOR MAINNET, COMPLETE FOR A NAMED SUB-POPULATION.
> 
> Every one of the 944 Token-2022 mints in Jupiter's verified token list was checked against RPC (944 parsed successfully), and 617 carry a TransferHook extension. Within that list the count is a real denominator, and a proportion computed from it is meaningful.
> 
> That list is NOT the chain. Jupiter's verified set is a curated subset — it excludes unverified, illiquid, new and delisted tokens, which is exactly where an undisclosed hook is most likely to sit. So this dataset still CANNOT support "there are N hooked mints on mainnet", and a mint's absence from it is still not evidence that it has no hook. Rows found outside the list (via seed-verify, gpa-hook-program, tx-sample) are additive finds, not a sample of anything.

### The denominator

One named population was checked exhaustively. These proportions are meaningful **within that population and nowhere else**.

| | count |
|---|---|
| Tokens in Jupiter's verified list | 3,897 |
| …of which are Token-2022 | 944 |
| …successfully fetched and parsed as mints | 944 |
| …that could not be fetched (unmeasured) | 0 |
| **…carrying a TransferHook extension** | **617** |

Source list: `https://lite-api.jup.ag/tokens/v2/tag?query=verified` (fetched 2026-08-08T10:14:12.903Z). The list supplies **addresses only**; every value published here comes from our own RPC call and our own parser.

- **Methods actually run:** `seed-verify`, `jupiter-verified-list`, `gpa-hook-program`, `tx-sample`
- **Candidate accounts checked:** 31,843
- **Candidate fetches that failed (unmeasured):** 0
- **RPC endpoint:** `api.mainnet-beta.solana.com` — the default public endpoint

### What is not covered

- Population enumeration: no complete list of hooked mints was obtained. The row count is a lower bound.
- Holder counts: require getProgramAccounts on Token-2022 filtered by mint. Rendered as `not covered`, never as 0.

### Method detail

**`gpa-full`** — BLOCKED

Endpoint refused getProgramAccounts on the Token-2022 program (structural refusal, not a transient error). Reason reported: RPC getProgramAccounts HTTP 403: Your IP or provider is blocked from this endpoint

**`seed-verify`** — partial

Checked 24 manually-collected candidate addresses; 20 of them carry a TransferHook. Coverage is exactly this list and nothing more.

**`jupiter-verified-list`** — partial

Took the 944 Token-2022 mints out of 3897 tokens in Jupiter's verified list and checked each one against RPC with our own parser. 617 of 944 successfully-parsed mints carry a TransferHook extension. Jupiter supplies ONLY the list of addresses to check — every published field comes from our own getMultipleAccounts call. This is COMPLETE with respect to Jupiter's verified list and says nothing about mints outside it.

**`gpa-hook-program`** — partial

Ran getProgramAccounts against 3 hook program(s) — permitted for ordinary custom programs even where it is refused for Token-2022 — then slid a 32-byte window across each account's data and tested every distinct pubkey it yielded. Complete for the accounts of the programs listed below; silent about any mint whose hook program stores no reference to it.

| hook program | GPA served | program accounts | pubkey candidates | new hooked mints |
|---|---|---|---|---|
| `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | yes | 221590 | 20000 (capped) | 0 |
| `wJUPXhGwC88LZeG1DXaYing3WB1Q4YvwJcK77bidNGv` | yes | 466 | 9406 | 0 |
| `FqhKJT9gtScjrmfUuRMjeg7cXNpif1fqsy5Jh65tJmTS` | yes | 4 | 607 | 0 |

**`tx-sample`** — partial

Sampled transaction history of the Token-2022 program and of each hook program discovered, harvested every account key referenced, and tested each. Discovery is proportional to recent transfer activity, so dormant hooked mints are systematically missed.

> ⚠ **Narrow sampling window.** Signature paging returns transactions newest-first and contiguously, so on a high-traffic program a full page covers only a moment of chain time. `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` returned 1000 signatures spanning just 7 slot(s). At roughly 0.4s per slot this is a window of seconds, not days. Discovery from such a root is therefore close to negligible and must not be read as broad coverage of the program's history.

Slot range sampled: 437966001 → 437966007.

| sampling root | round | signatures seen | txs sampled | tx fetch failures | accounts harvested | slot range |
|---|---|---|---|---|---|---|
| `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` | 1 | 1000 | 100 | 0 | 880 | 437966001–437966007 |

## Summary of rows in this dataset

_These counts describe **this dataset only**. They are not mainnet totals._

| measure | count |
|---|---|
| Hooked mints in this dataset | 625 |
| …with a hook program actually set | 8 |
| …with TransferHook present but `program_id` null | 617 |
| Distinct hook programs | 3 |
| Hook programs that are **upgradeable** | 8 |
| Hook programs that are immutable | 0 |
| Hook programs whose upgradeability is `not covered` | 0 |
| Mints whose hook `authority` is still live (can re-point the hook) | 625 |
| Mints whose hook `authority` is burned | 0 |
| ExtraAccountMetaList present | 8 |
| ExtraAccountMetaList absent | 0 |

## Who holds the hook authority

The hook `authority` is the key that can change which program a mint calls on transfer. It is a separate power from whether the current hook program is upgradeable, and a mint can be fully mutable through this route even if its hook program is immutable.

Across 625 rows there are **26 distinct hook authorities**, and **0** rows have burned theirs.

| hooked mints | hook authority | of those, with a live hook program | enforcement extensions present | examples |
|---|---|---|---|---|
| 443 | `9foMHsSDq7nMg4WPusSz9eY7tyxyukqborA8GyU5cUxD` | 0 | ConfidentialTransferMint, DefaultAccountState, Pausable, PermanentDelegate | USDon, IRENon, CRCLon, FIGon, HIMSon, GLXYon |
| 133 | `5aMNNLQJwAEeoemTEMkv5NVjqKwvvefRYCQ5Z67HFvEq` | 0 | ConfidentialTransferMint, DefaultAccountState, Pausable, PermanentDelegate | DFDVx, AMBRx, TONXx, SBETx, SPCEx, OPENx |
| 10 | `2cVYpagTt7ZGc3mmTXBa7fAznUtx5DUu6aCq8uVDaf4a` | 0 | ConfidentialTransferMint, DefaultAccountState, Pausable, PermanentDelegate | BOT, DRAM, SKHY, SPCX, HOOD, INTC |
| 8 | `WV9PJN7XTmTLVwbutCLFxp8TyePee6Xq5mRq6Fti5Wc` | 0 | ConfidentialTransferMint, DefaultAccountState, Pausable, PermanentDelegate, TransferFeeConfig | ANDURIL, POLYMARKET, SPACEX, XAI, NEURALINK, KALSHI |
| 5 | `fragSkuEpEmdoj9Bcyawk9rBdsChcVJLWHfj9JX1Gby` | 5 | — | FRAG², fragSWTCH, fragJTO, fragSOL, fragBTC |
| 4 | `2apBGMsS6ti9RyF5TwQTDswXBWskiJP2LD4cUEDqYJjk` | 0 | ConfidentialTransferMint, MintCloseAuthority, PermanentDelegate, TransferFeeConfig | PYUSD, USDG, USDP, PAXG |
| 2 | `8N2NFYQ5VMaoDGMAcUbfzdeJqvok6LQs2E9BxDK6mMAE` | 0 | ConfidentialTransferMint, DefaultAccountState, MintCloseAuthority, Pausable, PermanentDelegate, TransferFeeConfig | USDGO, USDPT |
| 2 | `F3VitQrFSk61j31tgfv8kPutNnKuqPewJhSj9kHBP3xq` | 2 | MintCloseAuthority | PERC-POS, PERC-POS |
| 1 | `DMdBa812dBW1CHVhmTyUyVcrBnSbZbfoFC7U14k4riH1` | 0 | — | PUMP |
| 1 | `3etmwgxP4Lt2LLEyYpN2f9oKKi1onGy5XHRSP4BRq2vb` | 0 | ConfidentialTransferMint, DefaultAccountState, MintCloseAuthority, PermanentDelegate | CASH |
| 1 | `GGXxderQwPcCEXuoQPAcQSf9GJ4P7mwpkFKifsEsqSxf` | 0 | ConfidentialTransferMint, DefaultAccountState, MintCloseAuthority, PermanentDelegate | USDB |
| 1 | `2CeU1GEWbhXXZvypMfAPa2AzyvF3yhrG7AqUyFoDqxZf` | 0 | ConfidentialTransferMint, DefaultAccountState, Pausable, PermanentDelegate | SPX3S |

_14 further authorities with fewer mints each; see `census.json`._

The "enforcement extensions present" column lists the Token-2022 extensions actually set on those mints today. It is a description of current on-chain configuration and nothing more — it is not a claim about what any issuer intends, has announced, or has described elsewhere.

## Can the enforcement logic be rewritten?

This is the question the census exists to answer. It only applies to rows that name an actual hook program — a mint whose `program_id` is null runs no code on transfer today, and is covered in the section below instead.

**8 of 625 rows name a hook program.**

### Upgradeable — a live key can replace the hook program's code

Recording this is not an allegation. Upgrade authorities are routine and often deliberate; the point is that a holder cannot see this from any wallet UI.

| mint | symbol | hook program | upgrade authority | last deploy slot |
|---|---|---|---|---|
| `FRAG2gPNXozPpYcn2a8zK7YdtfNXCLsioZNwZXwTQ3cP` | FRAG² | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 |
| `FRAGW7L9BxkCMbivRN5HE2iXuA196v3fHA86GY16nV4L` | fragSWTCH | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 |
| `FRAGJ157KSDfGvBJtCSrsTWUqFnZhrw4aC8N8LqHuoos` | fragJTO | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 |
| `FRAGSEthVFL7fdqM8hxfxkfCZzUvmg21cqPJVvC1qdbo` | fragSOL | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 |
| `stJUPZMmAWA1PNVPXCvqVK6MHABr4yFo5rv2JTethCa` | stJUP | `wJUPXhGwC88LZeG1DXaYing3WB1Q4YvwJcK77bidNGv` | `De3YSj45A3mGo9pp8CSyMooG6o4SaneZ3ms4ngbk2FCU` | 385923063 |
| `FRAGB4KZGLMy3wH1nBajP3Q17MHnecEvTPT6wb4pX5MB` | fragBTC | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 |
| `7RGwPnmoaqypagKnJNywkgo1FWvYMPerSMekLVNaSeHJ` | PERC-POS | `FqhKJT9gtScjrmfUuRMjeg7cXNpif1fqsy5Jh65tJmTS` | `7JVQvrAfzj3aasLxCkoLYX5KQcrb5nEZhUe5Qa8PvV5G` | 415118659 |
| `AutxDYK4QARmFGCpQFQuet2kND3tzP5nZGRww9Tx8btp` | PERC-POS | `FqhKJT9gtScjrmfUuRMjeg7cXNpif1fqsy5Jh65tJmTS` | `7JVQvrAfzj3aasLxCkoLYX5KQcrb5nEZhUe5Qa8PvV5G` | 415118659 |

## Rows

| mint | name | symbol | hook program | hook upgradeable | upgrade authority | last deploy slot | supply | decimals | holders | EAM list | exts |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn` | Pump | PUMP | _none set_ | n/a — no hook program set | n/a | `not covered` | 842,438,521,123.2676 | 6 | `not covered` | n/a | 3 |
| `FRAG2gPNXozPpYcn2a8zK7YdtfNXCLsioZNwZXwTQ3cP` | Fragmetric Squared | FRAG² | `fragnA…iK3iF3` | **YES — mutable** | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 | 20,914,801.7774 | 9 | `not covered` | yes (8) | 3 |
| `FRAGW7L9BxkCMbivRN5HE2iXuA196v3fHA86GY16nV4L` | Fragmetric Staked SWTCH | fragSWTCH | `fragnA…iK3iF3` | **YES — mutable** | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 | 10,403,001.8180 | 9 | `not covered` | yes (8) | 3 |
| `ZPFtoCe7WWqG4N3ZFRccS8T9SMBeHsd1Vmgv2i7ondo` | Ondo US Dollar Token | USDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 12,652,832.5299 | 9 | `not covered` | n/a | 8 |
| `72puLt71H93Z9CzHuBRTwFpL4TG3WZUhnoCC7p8gxigu` | USDGO | USDGO | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,139,610,694.7 | 6 | `not covered` | n/a | 10 |
| `FRAGJ157KSDfGvBJtCSrsTWUqFnZhrw4aC8N8LqHuoos` | Fragmetric Staked JTO | fragJTO | `fragnA…iK3iF3` | **YES — mutable** | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 | 1,238,521.0479 | 9 | `not covered` | yes (8) | 3 |
| `2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo` | PayPal USD | PYUSD | _none set_ | n/a — no hook program set | n/a | `not covered` | 685,054,479.4213 | 6 | `not covered` | n/a | 8 |
| `2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH` | Global Dollar | USDG | _none set_ | n/a — no hook program set | n/a | `not covered` | 634,656,818.0682 | 6 | `not covered` | n/a | 8 |
| `CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH` | CASH | CASH | _none set_ | n/a — no hook program set | n/a | `not covered` | 120,898,455.1848 | 6 | `not covered` | n/a | 7 |
| `ENL66PGy8d8j5KNqLtCcg4uidDUac5ibt45wbjH9REzB` | USDBridge | USDB | _none set_ | n/a — no hook program set | n/a | `not covered` | 117,892,427.82 | 6 | `not covered` | n/a | 7 |
| `Xs2yquAgsHByNzx68WJC55WHjHBvG9JsMB7CWjTLyPy` | DFDV xStock | DFDVx | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,983,197.0787 | 8 | `not covered` | n/a | 8 |
| `XsaQTCgebC2KPbf27KUhdv5JFvHhQ4GDAPURwrEhAzb` | Amber xStock | AMBRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 9,069,326.3408 | 8 | `not covered` | n/a | 8 |
| `XscE4GUcsYhcyZu5ATiGUMmhxYa1D5fwbpJw4K6K4dp` | TON xStock | TONXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 4,373,000 | 8 | `not covered` | n/a | 8 |
| `XsEoih2x6nZuUjFwzGoba6MFmtzCkzW2c4YAm6baQbq` | SharpLink Gaming xStock | SBETx | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,887,999.9770 | 8 | `not covered` | n/a | 8 |
| `Xsgrm4D6VBTfDx5bs7GNdjtmWDgZ8V79r3YpsYwf5py` | Virgin Galactic xStock | SPCEx | _none set_ | n/a — no hook program set | n/a | `not covered` | 3,039,999.9999 | 8 | `not covered` | n/a | 8 |
| `XsGtpmjhmC8kyjVSWL4VicGu36ceq9u55PTgF8bhGv6` | OPEN xStock | OPENx | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,660,999.9969 | 8 | `not covered` | n/a | 8 |
| `XsguBZPkM9BDmxspmWe29EmrYZBv21ENcC27Pqh7grB` | MARA xStock | MARAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,368,199.9993 | 8 | `not covered` | n/a | 8 |
| `XsPHkGBbztHCCe1RMhiAs7CxVqoghmyd6zDUfrbfVWG` | Brera xStock | SLMTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 7,246,376.81 | 8 | `not covered` | n/a | 8 |
| `XsPLBFy59Q3hY59KLAJur8QyvziMF4xUxGTxXqXE7cT` | Bit Digital xStock | BTBTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 4,606,215.8167 | 8 | `not covered` | n/a | 8 |
| `XsvHMmbDcd14DHHW16PkxPGW7ks77ehxUv1E9Zmxgj4` | Bitgo xStock | BTGOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,656,740.6089 | 8 | `not covered` | n/a | 8 |
| `13QHuepdhtJ3urNsV9i1hdL8nQoca2G7ZaLzb5FYondo` | IREN (Ondo Tokenized) | IRENon | _none set_ | n/a — no hook program set | n/a | `not covered` | 22,872.4055 | 9 | `not covered` | n/a | 7 |
| `6xHEyem9hmkGtVq6XGCiQUGpPsHBaoYuYdFNZa5ondo` | Circle Internet Group (Ondo Tokenized) | CRCLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 16,415.5823 | 9 | `not covered` | n/a | 7 |
| `aLDdFsr3VTUQaHFK6yNvQxztvxQ8nxW4AMuSGC7ondo` | Figma (Ondo Tokenized) | FIGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 10,398.9018 | 9 | `not covered` | n/a | 7 |
| `bdh3njeo19d2TBLAKTGvCWdSoArfVw8uZBAJHY4ondo` | Hims & Hers Health (Ondo Tokenized) | HIMSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 39,110.2191 | 9 | `not covered` | n/a | 7 |
| `CkWmEM2J79k6AjAwyQVHXteFucAL1zQrKLxLqJHondo` | Galaxy Digital (Ondo Tokenized) | GLXYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 12,817.9400 | 9 | `not covered` | n/a | 7 |
| `FRAGSEthVFL7fdqM8hxfxkfCZzUvmg21cqPJVvC1qdbo` | Fragmetric Restaked SOL | fragSOL | `fragnA…iK3iF3` | **YES — mutable** | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 | 56,126.5842 | 9 | `not covered` | yes (8) | 3 |
| `gEGtLTPNQ7jcg25zTetkbmF7teoDLcrfTnQfmn2ondo` | NVIDIA (Ondo Tokenized) | NVDAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 16,697.4048 | 9 | `not covered` | n/a | 7 |
| `iy11ytbSGcUnrjE6Lfv78TFqxKyUESfku1FugS9ondo` | iShares Silver Trust (Ondo Tokenized) | SLVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 26,948.3378 | 9 | `not covered` | n/a | 7 |
| `M77ZvkZ8zW5udRbuJCbuwSwavRa7bGAZYMTwru8ondo` | iShares Gold Trust (Ondo Tokenized) | IAUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 10,491.2357 | 9 | `not covered` | n/a | 7 |
| `PresTj4Yc2bAR197Er7wz4UUKSfqt6FryBEdAriBoQB` | Anduril PreStocks | ANDURIL | _none set_ | n/a — no hook program set | n/a | `not covered` | 10,227.7358 | 9 | `not covered` | n/a | 10 |
| `Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci` | Walmart xStock | WMTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 132,948.5172 | 8 | `not covered` | n/a | 8 |
| `Xs2ZEuDVSQkNnXHqfqEYKVShLHpecyKfdfpEYwiHtQE` | Applied Digital Corporation xStock | APLDx | _none set_ | n/a — no hook program set | n/a | `not covered` | 195,000 | 8 | `not covered` | n/a | 8 |
| `Xs31mE5EiqjSHEaiX9QDKCN6NvSGCqpJ6f1FNq2wri5` | Riot Platforms xStock | RIOTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 939,999.9961 | 8 | `not covered` | n/a | 8 |
| `Xs3c2aZenyRQwXjki5MDxJEJ2km27ef2rWQMFWx7QKJ` | Galaxy Digital xStock | GLXYx | _none set_ | n/a — no hook program set | n/a | `not covered` | 579,999.9987 | 8 | `not covered` | n/a | 8 |
| `Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg` | Amazon.com xStock | AMZNx | _none set_ | n/a — no hook program set | n/a | `not covered` | 172,296.1464 | 8 | `not covered` | n/a | 8 |
| `Xs3oZwbHvqis4NYcf4YKWmEia2eC84wSiVrcYcTqpH8` | SpaceX xStock | SPCXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 559,998.9892 | 8 | `not covered` | n/a | 8 |
| `Xs3ZFkPYT2BN7qBMqf1j1bfTeTm1rFzEFSsQ1z3wAKU` | AstraZeneca xStock | AZNx | _none set_ | n/a — no hook program set | n/a | `not covered` | 166,525.5078 | 8 | `not covered` | n/a | 8 |
| `Xs54CrhmpVp6uxZXwgSTegrRH2kShh88XFPzgf4BExu` | Energy Select Sector SPDR Fund xStock | XLEx | _none set_ | n/a — no hook program set | n/a | `not covered` | 174,999.9995 | 8 | `not covered` | n/a | 8 |
| `Xs72K1Ta1D5ccNy3RzSyQWGgZywWvphX78pL8WBk1Bo` | VanEck Agribusiness ETF xStock | MOOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 126,999.9999 | 8 | `not covered` | n/a | 8 |
| `Xs78JED6PFZxWc2wCEPspZW9kL3Se5J7L5TChKgsidH` | Strategy PP Variable xStock | STRCx | _none set_ | n/a — no hook program set | n/a | `not covered` | 469,920.6865 | 8 | `not covered` | n/a | 8 |
| `Xs7UsqobM3EJgMeHwdAbmDBCZH1G5WTCjatpeYcCr8x` | Fundrise Innovation Fund, LLC xStock | VCXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 131,016.6739 | 8 | `not covered` | n/a | 8 |
| `Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu` | Coinbase xStock | COINx | _none set_ | n/a — no hook program set | n/a | `not covered` | 136,179.7611 | 8 | `not covered` | n/a | 8 |
| `XsaBXg8dU5cPM6ehmVctMkVqoiRG2ZjMo1cyBJ3AykQ` | Coca-Cola xStock | KOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 211,224.9745 | 8 | `not covered` | n/a | 8 |
| `XsaHND8sHyfMfsWPj6kSdd5VwvCayZvjYgKmmcNL5qh` | Exxon Mobil xStock | XOMx | _none set_ | n/a — no hook program set | n/a | `not covered` | 119,748.3225 | 8 | `not covered` | n/a | 8 |
| `XsAiRejKuvLAdq9KtedrMSrabz7SWdzKoVK6Qgac1Ki` | KRAQ xStock | KRAQx | _none set_ | n/a — no hook program set | n/a | `not covered` | 999,999.9995 | 8 | `not covered` | n/a | 8 |
| `XsaQGz41BEQkS9xAB44uvUtuXcdLJAXEU1dogEzWMZ8` | Strategy PP Fixed xStock | STRKx | _none set_ | n/a — no hook program set | n/a | `not covered` | 187,380.1167 | 8 | `not covered` | n/a | 8 |
| `XsAsZLF4MmsvS1sDxRMrUz7REjHfwbC9UAMXSRBqgEB` | Uber xStock | UBERx | _none set_ | n/a — no hook program set | n/a | `not covered` | 193,999.9955 | 8 | `not covered` | n/a | 8 |
| `XsAtbqkAP1HJxy7hFDeq7ok6yM43DQ9mQ1Rh861X8rw` | Pfizer xStock | PFEx | _none set_ | n/a — no hook program set | n/a | `not covered` | 609,716.9199 | 8 | `not covered` | n/a | 8 |
| `XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp` | Apple xStock | AAPLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 153,765.3259 | 8 | `not covered` | n/a | 8 |
| `XsBGEXxbBcuu8Nrokj14G8v4ezT3JYWWLneTzXK8t6Z` | Core Scientific xStock | CORZx | _none set_ | n/a — no hook program set | n/a | `not covered` | 644,999.9999 | 8 | `not covered` | n/a | 8 |
| `Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh` | NVIDIA xStock | NVDAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 321,282.9151 | 8 | `not covered` | n/a | 8 |
| `XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN` | Alphabet xStock | GOOGLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 160,408.0930 | 8 | `not covered` | n/a | 8 |
| `XsDgw22qRLTv5Uwuzn6T63cW69exG41T6gwQhEK22u2` | Medtronic xStock | MDTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 104,127 | 8 | `not covered` | n/a | 8 |
| `XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB` | Tesla xStock | TSLAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 229,638.2548 | 8 | `not covered` | n/a | 8 |
| `XsEdDDTcVGJU6nvdRdVnj53eKTrsCkvtrVfXGmUK68V` | Vanguard Total World xStock | VTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 148,651.7652 | 8 | `not covered` | n/a | 8 |
| `XsEH7wWfJJu2ZT3UCFeVfALnVA6CP5ur7Ee11KmzVpL` | Netflix xStock | NFLXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 155,056.9810 | 8 | `not covered` | n/a | 8 |
| `Xsf9mBktVB9BSU5kf4nHxPq5hCBJ2j2ui3ecFGxPRGc` | Gamestop xStock | GMEx | _none set_ | n/a — no hook program set | n/a | `not covered` | 719,903.3326 | 8 | `not covered` | n/a | 8 |
| `XsfAzPzYrYjd4Dpa9BU3cusBsvWfVB9gBcyGC87S57n` | Novo Nordisk xStock | NVOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 316,151.7703 | 8 | `not covered` | n/a | 8 |
| `XsFnZawJdLdXfBSEt5Vw29K5vdBiHotdPLjUPafpfHs` | Core MSCI Emerging Markets xStock | IEMGx | _none set_ | n/a — no hook program set | n/a | `not covered` | 215,411 | 8 | `not covered` | n/a | 8 |
| `XsG5QyZTQnVSpsXRpD92K5ZGoxXjsmfTyx7fW7r18DV` | Hut 8 xStock | HUTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 189,000 | 8 | `not covered` | n/a | 8 |
| `XshPgPdXFRWB8tP1j82rebb2Q9rPgGX37RuqzohmArM` | Intel xStock | INTCx | _none set_ | n/a — no hook program set | n/a | `not covered` | 416,352.4733 | 8 | `not covered` | n/a | 8 |
| `XsHtf5RpxsQ7jeJ9ivNewouZKJHbPxhPoEy6yYvULr7` | Abbott xStock | ABTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 139,449.1005 | 8 | `not covered` | n/a | 8 |
| `XshWQWYVp5ff8CrAEsGmLVKD47nBWi3Ygn5v8wXK27G` | PayPal xStock | PYPLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 283,999.9999 | 8 | `not covered` | n/a | 8 |
| `XsJb1p4Ks6VFggq68JyMz7S3kdRfkqh4wA6EMyxi4DD` | Oklo xStock | OKLOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 122,000 | 8 | `not covered` | n/a | 8 |
| `XsJJneENiaBPqqcdK1gMsfwi9cbw111azigzRYHoctX` | USA Rare Earth Inc. xStock | USARx | _none set_ | n/a — no hook program set | n/a | `not covered` | 492,999.9999 | 8 | `not covered` | n/a | 8 |
| `XsjQP3iMAaQ3kQScQKthQpx9ALRbjKAjQtHg6TFomoc` | TQQQ xStock | TQQQx | _none set_ | n/a — no hook program set | n/a | `not covered` | 287,229.9285 | 8 | `not covered` | n/a | 8 |
| `XsMJtFbb8BwzQtck3oRXyAfs7SAPRuTXnSEDNd7BAVz` | Planet Labs xStock | PLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 490,500 | 8 | `not covered` | n/a | 8 |
| `XsMxAoJP47FQGLsVUvSS2QfBaHdNsd7DRU6nWRL8RSa` | Super Micro Computer, Inc. xStock | SMCIx | _none set_ | n/a — no hook program set | n/a | `not covered` | 360,000 | 8 | `not covered` | n/a | 8 |
| `Xsn3H7ACEpSF2ULxeiD6kW4jRZXpurh8ZPttyfoS56W` | CleanSpark xStock | CLSKx | _none set_ | n/a — no hook program set | n/a | `not covered` | 869,999.7780 | 8 | `not covered` | n/a | 8 |
| `XsnQnU7AdbRZYe2akqqpibDdXjkieGFfSkbkjX1Sd1X` | Merck xStock | MRKx | _none set_ | n/a — no hook program set | n/a | `not covered` | 138,395.9898 | 8 | `not covered` | n/a | 8 |
| `XsoBhf2ufR8fTyNSjqfU71DYGaE6Z3SUGAidpzriAA4` | Palantir xStock | PLTRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 146,870.9473 | 8 | `not covered` | n/a | 8 |
| `XsosCAu1L8Ebpr4SdBDV1EboYDRTWCH8j79UnHYzvbN` | Vanguard FTSE Europe ETF xStock | VGKx | _none set_ | n/a — no hook program set | n/a | `not covered` | 119,999.9999 | 8 | `not covered` | n/a | 8 |
| `XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ` | MicroStrategy xStock | MSTRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 402,360.6189 | 8 | `not covered` | n/a | 8 |
| `XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX` | Microsoft xStock | MSFTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 104,972.1758 | 8 | `not covered` | n/a | 8 |
| `Xsq9sEQjYiUTSZ55RrbHAzVfz8HotwFGrqgxkgiv4LB` | Global X Uranium ETF xStock | URAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 206,999.9999 | 8 | `not covered` | n/a | 8 |
| `XsqBC5tcVQLYt8wqGCHRnAUUecbRYXoJCReD6w7QEKp` | TBLL xStock | TBLLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 247,250 | 8 | `not covered` | n/a | 8 |
| `Xsr3pdLQyXvDJBFgpR5nexCEZwXvigb8wbPYp4YoNFf` | Cisco xStock | CSCOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 229,694.4315 | 8 | `not covered` | n/a | 8 |
| `XsR4LAtaBgTKTRUhiijY1ba13nx4bepeEcag2Pr4dZ1` | AST SpaceMobile xStock | ASTSx | _none set_ | n/a — no hook program set | n/a | `not covered` | 125,000 | 8 | `not covered` | n/a | 8 |
| `XsrBCwaH8c46xiqXBChzobgufRKxQxAWUWbndgBNzFn` | Bitmine xStock | BMNRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 601,000 | 8 | `not covered` | n/a | 8 |
| `XsrwdnwLHjVnyy7fgE2Pdwjp3czEm73jPjkSC5xzUBw` | NuScale Power Corporation xStock | SMRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 455,000 | 8 | `not covered` | n/a | 8 |
| `Xss5RAku5EH6UViFdvW7ss9xQjwQLsrs2opPMhb3k43` | Roblox xStock | RBLXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 226,199.9946 | 8 | `not covered` | n/a | 8 |
| `XsTTtPA5V19YwHKDv4xeVXNM6kdsQNJvg3MyWkRUckt` | abrdn Physical Palladium Shares xStock | PALLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 104,994.15 | 8 | `not covered` | n/a | 8 |
| `XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1` | Circle xStock | CRCLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 821,079.7835 | 8 | `not covered` | n/a | 8 |
| `XsuwUbQSzCJN2wZabD1Gxf1MER2Ypa7hMzVMYB2WawJ` | TeraWulf xStock | WULFx | _none set_ | n/a — no hook program set | n/a | `not covered` | 805,000 | 8 | `not covered` | n/a | 8 |
| `XsuxRGDzbLjnJ72v74b7p9VY6N66uYgTCyfwwRjVCJA` | Marvell xStock | MRVLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 180,068.9869 | 8 | `not covered` | n/a | 8 |
| `Xsv99frTRUeornyvCfvhnDesQDWuvns1M852Pez91vF` | PepsiCo xStock | PEPx | _none set_ | n/a — no hook program set | n/a | `not covered` | 104,256.9839 | 8 | `not covered` | n/a | 8 |
| `Xsv9hRk1z5ystj9MhnA7Lq4vjSsLwzL2nxrwmwtD3re` | Gold xStock | GLDx | _none set_ | n/a — no hook program set | n/a | `not covered` | 116,269.7249 | 8 | `not covered` | n/a | 8 |
| `XsvKCaNsxg2GN8jjUmq71qukMJr7Q1c5R2Mk9P8kcS8` | Comcast xStock | CMCSAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 528,998.0562 | 8 | `not covered` | n/a | 8 |
| `XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg` | Robinhood xStock | HOODx | _none set_ | n/a — no hook program set | n/a | `not covered` | 597,392.6510 | 8 | `not covered` | n/a | 8 |
| `XsWAnFM77x6YvpdaZoos79R12o4Yj4r7EVkaTWddzhU` | Schwab International Equity xStock | SCHFx | _none set_ | n/a — no hook program set | n/a | `not covered` | 414,999.9999 | 8 | `not covered` | n/a | 8 |
| `XswsQk4duEQmCbGzfqUUWYmi7pV7xpJ9eEmLHXCaEQP` | Bank of America xStock | BACx | _none set_ | n/a — no hook program set | n/a | `not covered` | 279,921.8771 | 8 | `not covered` | n/a | 8 |
| `XsxAd6okt8y1RRK6gNg7iJaqiWNiq5Md5EDf3ZrF2dm` | iShares Silver Trust xStock | SLVx | _none set_ | n/a — no hook program set | n/a | `not covered` | 163,555.6539 | 8 | `not covered` | n/a | 8 |
| `XsybfiKkD4UmjkAGT2uR8X2sq9AWFtvGJM2KTffoALZ` | Global X Copper Miners xStock | COPXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 175,910.6181 | 8 | `not covered` | n/a | 8 |
| `XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV` | Procter & Gamble xStock | PGx | _none set_ | n/a — no hook program set | n/a | `not covered` | 106,583.8831 | 8 | `not covered` | n/a | 8 |
| `XsYMHtwJcWon5GkPHzdDbCCztKtKzEurJnbydxgjsqS` | Bending Spoons xStock | BSPx | _none set_ | n/a — no hook program set | n/a | `not covered` | 499,999.9999 | 8 | `not covered` | n/a | 8 |
| `XsyZcb97BzETAqi9BoP2C9D196MiMNBisGMVNje2Thz` | S&P Small Cap xStock | IJRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 117,960.6040 | 8 | `not covered` | n/a | 8 |
| `XsZUSqxAXKJkEimvD4CoVvEb4WUC92TFgj5zRtBxFeL` | Warner Bros. Discovery xStock | WBDx | _none set_ | n/a — no hook program set | n/a | `not covered` | 341,500 | 8 | `not covered` | n/a | 8 |
| `14W1itEkV7k1W819mLSknFTaMmkCtPokbF2tRkPUondo` | ProShares UltraPro QQQ (Ondo Tokenized) | TQQQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,360.1866 | 9 | `not covered` | n/a | 7 |
| `67ik3PpEXBJA1km29rZMMKwhgvvjrKpNMoaZyTsSHFT` | Shift S&P500 3x Short | SPX3S | _none set_ | n/a — no hook program set | n/a | `not covered` | 26,768.4957 | 8 | `not covered` | n/a | 8 |
| `6afjZE5Qv9WF5K1adBgTxtWyenJ7ZerH6BVAzmoSHFT` | Shift Tesla 2x Long | TSL2L | _none set_ | n/a — no hook program set | n/a | `not covered` | 43,300.8305 | 8 | `not covered` | n/a | 8 |
| `7GoxZQ7gCh1mg1b3AUqd7cyPqiUp4y2NRxM9A5zSHFT` | Shift Semiconductor 3x Short | SOX3S | _none set_ | n/a — no hook program set | n/a | `not covered` | 75,651.4408 | 8 | `not covered` | n/a | 8 |
| `7qy1j4Mechfyr6uAST3djH4vk4kiEYC2cjEytXdondo` | Ondas Holdings (Ondo Tokenized) | ONDSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,148.1310 | 9 | `not covered` | n/a | 7 |
| `916SDKz7y5ZcEZC9CtnQ5Djs1Y8Yv3UAPb6bak8ondo` | iShares MSCI Emerging Markets ETF (Ondo Tokenized) | EEMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4,477.2817 | 9 | `not covered` | n/a | 7 |
| `AUSD1jCcCyPLybk1YnvPWsHQSrZ46dxwoMniN4N2UEB9` | AUSD | AUSD | _none set_ | n/a — no hook program set | n/a | `not covered` | 3,395,562.7746 | 6 | `not covered` | n/a | 8 |
| `B6ry9goGNvVbhq7gWHzs3p6emJ1gLaMhu4By9TTondo` | AST SpaceMobile (Ondo Tokenized) | ASTSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,396.4890 | 9 | `not covered` | n/a | 7 |
| `b8UDyp3Yx19rcdaBUNegoojyUdhPpiPQ46bFrtQQQon` | RoboStrategy (Ondo Tokenized) | BOTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,385.8767 | 9 | `not covered` | n/a | 7 |
| `bbahNA5vT9WJeYft8tALrH1LXWffjwqVoUbqYa1ondo` | Alphabet Class A (Ondo Tokenized) | GOOGLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,041.0768 | 9 | `not covered` | n/a | 7 |
| `BfPGpgNyxe6rjAru1EJarjSBAcCABuMF5L32v7nondo` | CoreWeave (Ondo Tokenized) | CRWVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,790.5472 | 9 | `not covered` | n/a | 7 |
| `bgJWGuQxyoyFeXwzYZKBmoujVdatGFYPNFnv1a6ondo` | BitGo Holdings (Ondo Tokenized) | BTGOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,571.7222 | 9 | `not covered` | n/a | 7 |
| `bNPXng6hSVas7LWiNQyvpGcPYtY1ZmFY6WP49ymSHFT` | Shift Tesla 1x Short | TSL1S | _none set_ | n/a — no hook program set | n/a | `not covered` | 10,044.9749 | 8 | `not covered` | n/a | 8 |
| `bzoe1epsQLx65zmez4pWfBumYzpaFwRTvnmCjZVondo` | Fluence Energy (Ondo Tokenized) | FLNCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,133.1884 | 9 | `not covered` | n/a | 7 |
| `cJpUMp5R7rZ6fGeLHbHhrRuJzK9mkyKDjZqNpT3ondo` | Intel (Ondo Tokenized) | INTCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 9,398.2386 | 9 | `not covered` | n/a | 7 |
| `CqW2pd6dCPG9xKZfAsTovzDsMmAGKJSDBNcwM96ondo` | iShares Core S&P 500 ETF (Ondo Tokenized) | IVVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3,123.1286 | 9 | `not covered` | n/a | 7 |
| `DiRshqNDE68bWbGdLHm1GwQ76MvWQG3af6w1NdQondo` | Nebius Group (Ondo Tokenized) | NBISon | _none set_ | n/a — no hook program set | n/a | `not covered` | 9,852.8527 | 9 | `not covered` | n/a | 7 |
| `ETCJUmuhs5aY62xgEVWCZ5JR8KPdeXUaJz3LuC5ondo` | MARA Holdings (Ondo Tokenized) | MARAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,361.7257 | 9 | `not covered` | n/a | 7 |
| `exYfSJt6Fgfhfnp3bAD4roYy97hLF9npjYaLyEXondo` | Terawulf (Ondo Tokenized) | WULFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,229.5712 | 9 | `not covered` | n/a | 7 |
| `fDxs5y12E7x7jBwCKBXGqt71uJmCWsAQ3Srkte6ondo` | Meta Platforms (Ondo Tokenized) | METAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,467.5280 | 9 | `not covered` | n/a | 7 |
| `fXXYmrdSAwVmtNo1ZwrkxVep7BxTsusGzmUZJSPondo` | Navitas Semiconductor (Ondo Tokenized) | NVTSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 5,062.4076 | 9 | `not covered` | n/a | 7 |
| `Fz9edBpaURPPzpKVRR1A8PENYDEgHqwx5D5th28ondo` | Micron Technology (Ondo Tokenized) | MUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 8,937.0912 | 9 | `not covered` | n/a | 7 |
| `GeV7S8vjP8qdYZpdGv2Xi6e7MUMCk8NAAp2z7g5ondo` | Novo Nordisk (Ondo Tokenized) | NVOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,224.6329 | 9 | `not covered` | n/a | 7 |
| `GRciFCqJ5y2hbiD6U5mGkohY65BZTXGuGUrCqf7ondo` | Petrobras (Ondo Tokenized) | PBRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3,454.6994 | 9 | `not covered` | n/a | 7 |
| `GxHksENo754dKj6kv5d2z7ey9KwE7YSRYgRCtoFYd2yq` | Staked Solstice | stSLX | _none set_ | n/a — no hook program set | n/a | `not covered` | 4,600,111.8074 | 6 | `not covered` | n/a | 5 |
| `HVbpJAQGNpkgBaYBZQBR1t7yFdvaYVp2vCQQfKKEN4tM` | Pax Dollar | USDP | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,303,891.2951 | 6 | `not covered` | n/a | 6 |
| `HVWf8JmLoHs99Lw8Psf3fyqAtA4crWxCPkrmSdNjhNH3` | USDPT | USDPT | _none set_ | n/a — no hook program set | n/a | `not covered` | 8,773,006.31 | 6 | `not covered` | n/a | 10 |
| `mqL8yXQpeSvc7NgrAtLLPtRvUiWyLoG5RWLv16iondo` | SoFi Technologies (Ondo Tokenized) | SOFIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3,498.5348 | 9 | `not covered` | n/a | 7 |
| `MYXqkDYbzr7vjXAz2BapR4AiYRXzoikGirrLoRzondo` | BitMine Immersion Technologies (Ondo Tokenized) | BMNRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,626.8617 | 9 | `not covered` | n/a | 7 |
| `Pre8AREmFPtoJFT8mQSXQLh56cwJmM7CFDRuoGBZiUP` | Polymarket PreStocks | POLYMARKET | _none set_ | n/a — no hook program set | n/a | `not covered` | 4,818.9714 | 9 | `not covered` | n/a | 10 |
| `PreANxuXjsy2pvisWWMNB6YaJNzr7681wJJr2rHsfTh` | SpaceX PreStocks | SPACEX | _none set_ | n/a — no hook program set | n/a | `not covered` | 8,742.5542 | 9 | `not covered` | n/a | 10 |
| `PreC1KtJ1sBPPqaeeqL6Qb15GTLCYVvyYEwxhdfTwfx` | xAI PreStocks | XAI | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,078.5250 | 9 | `not covered` | n/a | 10 |
| `PrekqLJvJ3qVdXmBGDiexvwUTF4rLFDa6HWS4HJbw9S` | Neuralink PreStocks | NEURALINK | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,595.9981 | 9 | `not covered` | n/a | 10 |
| `PreLWGkkeqG1s4HEfFZSy9moCrJ7btsHuUtfcCeoRua` | Kalshi PreStocks | KALSHI | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,311.9974 | 9 | `not covered` | n/a | 10 |
| `Pren1FvFX6J3E4kXhJuCiAD5aDmGEb7qJRncwA8Lkhw` | Anthropic PreStocks | ANTHROPIC | _none set_ | n/a — no hook program set | n/a | `not covered` | 7,383.8144 | 9 | `not covered` | n/a | 10 |
| `PreweJYECqtQwBtpxHL171nL2K6umo692gTm7Q3rpgF` | OpenAI PreStocks | OPENAI | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,402.8467 | 9 | `not covered` | n/a | 10 |
| `tiitb2Z1HtpB2DpVr6V7tdCFS3jmTinLeuGj9EVondo` | VanEck Rare Earth and Strategic Metals ETF (Ondo Tokenized) | REMXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,771.2053 | 9 | `not covered` | n/a | 7 |
| `X7j77hTmjZJbepkXXBcsEapM8qNgdfihkFj6CZ5ondo` | Global X Copper Miners ETF (Ondo Tokenized) | COPXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 6,094.9182 | 9 | `not covered` | n/a | 7 |
| `xoUSDq85Rjsb6SbUwJyreFgeWQvxdkT7R3c3g7s6p5Y` | XO Cash | XO | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,482,117.7871 | 6 | `not covered` | n/a | 7 |
| `Xs5UJzmCRQ8DWZjskExdSQDnbE6iLkRu2jjrRAB1JSU` | Accenture xStock | ACNx | _none set_ | n/a — no hook program set | n/a | `not covered` | 37,099.9999 | 8 | `not covered` | n/a | 8 |
| `Xs6B6zawENwAbWVi7w92rjazLuAr5Az59qgWKcNb45x` | Berkshire Hathaway xStock | BRK.Bx | _none set_ | n/a — no hook program set | n/a | `not covered` | 32,235.9769 | 8 | `not covered` | n/a | 8 |
| `Xs7xXqkcK7K8urEqGg52SECi79dRp2cEKKuYjUePYDw` | CrowdStrike xStock | CRWDx | _none set_ | n/a — no hook program set | n/a | `not covered` | 34,486.9986 | 8 | `not covered` | n/a | 8 |
| `Xs8drBWy3Sd5QY3aifG9kt9KFs2K3PGZmx7jWrsrk57` | Thermo Fisher xStock | TMOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 30,238.9804 | 8 | `not covered` | n/a | 8 |
| `Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ` | Nasdaq xStock | QQQx | _none set_ | n/a — no hook program set | n/a | `not covered` | 84,362.0725 | 8 | `not covered` | n/a | 8 |
| `Xs8S5L4HkJpeBWF1J4oyUX6rVwGHmG7GZ7PiChPt7nY` | Eaton Corporation plc xStock | ETNx | _none set_ | n/a — no hook program set | n/a | `not covered` | 15,000 | 8 | `not covered` | n/a | 8 |
| `Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu` | Meta xStock | METAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 72,378.0698 | 8 | `not covered` | n/a | 8 |
| `XsafvsGtzFqqHgTnA3aPC83EAMkacU5mcGtcSayhpVV` | TSMC xStock | TSMx | _none set_ | n/a — no hook program set | n/a | `not covered` | 46,471.2143 | 8 | `not covered` | n/a | 8 |
| `XsAk6BoV4kBXUM6WXodKyM21CN92G9jArwAzFvbh3LX` | SPDR S&P Oil & Gas Exploration & Production ETF xStock | XOPx | _none set_ | n/a — no hook program set | n/a | `not covered` | 60,999.9999 | 8 | `not covered` | n/a | 8 |
| `XsApJFV9MAktqnAc6jqzsHVujxkGm9xcSUffaBoYLKC` | Mastercard xStock | MAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 28,144.4535 | 8 | `not covered` | n/a | 8 |
| `Xsba6tUnSjDae2VcopDB6FGGDaxRrewFCDa5hKn5vT3` | Philip Morris xStock | PMx | _none set_ | n/a — no hook program set | n/a | `not covered` | 90,262.9995 | 8 | `not covered` | n/a | 8 |
| `Xsbe4fwmjVQEWEPkzfyxqNdPUUK7X9dKfTJrZdDbNgx` | Teradyne, Inc. xStock | TERx | _none set_ | n/a — no hook program set | n/a | `not covered` | 17,000 | 8 | `not covered` | n/a | 8 |
| `XsbELVbLGBkn7xfMfyYuUipKGt1iRUc2B7pYRvFTFu3` | Russell 2000 xStock | IWMx | _none set_ | n/a — no hook program set | n/a | `not covered` | 57,977.7538 | 8 | `not covered` | n/a | 8 |
| `XsczbcQ3zfcgAEt9qHQES8pxKAVG5rujPSHQEXi4kaN` | Salesforce xStock | CRMx | _none set_ | n/a — no hook program set | n/a | `not covered` | 66,900.3501 | 8 | `not covered` | n/a | 8 |
| `XsDZMGEU8zadWFCkTtPBoPWYcUX3JHVmghnwf2Mve2q` | Adobe xStock | ADBEx | _none set_ | n/a — no hook program set | n/a | `not covered` | 50,000 | 8 | `not covered` | n/a | 8 |
| `Xseo8tgCZfkHxWS9xbFYeKFyMSbWEvZGFV1Gh53GtCV` | Danaher xStock | DHRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 74,039.9826 | 8 | `not covered` | n/a | 8 |
| `XsgaUyp4jd1fNBCxgtTKkW64xnnhQcvgaxzsbAq5ZD1` | Goldman Sachs xStock | GSx | _none set_ | n/a — no hook program set | n/a | `not covered` | 16,921.9999 | 8 | `not covered` | n/a | 8 |
| `XsgSaSvNSqLTtFuyWPBhK9196Xb9Bbdyjj4fH3cPJGo` | Broadcom xStock | AVGOx | _none set_ | n/a — no hook program set | n/a | `not covered` | 45,580.9978 | 8 | `not covered` | n/a | 8 |
| `XsGVi5eo1Dh2zUpic4qACcjuWGjNv8GCt3dm5XcX6Dn` | Johnson & Johnson xStock | JNJx | _none set_ | n/a — no hook program set | n/a | `not covered` | 71,603.1873 | 8 | `not covered` | n/a | 8 |
| `XsjFwUPiLofddX5cWFHW35GCbXcSu1BCUGfxoQAQjeL` | Oracle xStock | ORCLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 90,465.9512 | 8 | `not covered` | n/a | 8 |
| `XsLR2VCGNzYVLfJGEwwNZsRYDZBGyBnoQH5rPGvwodA` | Quanta Services, Inc. xStock | PWRx | _none set_ | n/a — no hook program set | n/a | `not covered` | 10,000 | 8 | `not covered` | n/a | 8 |
| `XsLUiVEwYeoneKpgR1C2Q4DBUZhX4xDktSCfQqq8zmn` | Vertiv Holdings Co xStock | VRTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 20,000 | 8 | `not covered` | n/a | 8 |
| `XsMAqkcKsUewDrzVkait4e5u4y8REgtyS7jWgCpLV2C` | JPMorgan Chase xStock | JPMx | _none set_ | n/a — no hook program set | n/a | `not covered` | 48,977.3697 | 8 | `not covered` | n/a | 8 |
| `XsnhgGRQwhExfS2bmWzR6EYddKGPRGDEjeJsatkmKqU` | SK hynix xStock | SKHYx | _none set_ | n/a — no hook program set | n/a | `not covered` | 78,168.3020 | 8 | `not covered` | n/a | 8 |
| `XsNNMt7WTNA2sV3jrb1NNfNgapxRF5i4i6GcnTRRHts` | Chevron xStock | CVXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 94,783.9970 | 8 | `not covered` | n/a | 8 |
| `Xsnuv4omNoHozR6EEW5mXkw8Nrny5rB3jVfLqi6gKMH` | Eli Lilly xStock | LLYx | _none set_ | n/a — no hook program set | n/a | `not covered` | 14,779.9995 | 8 | `not covered` | n/a | 8 |
| `XsNVBwVGqtDqmA2Waoiux5mfykH8nepLK74z3ZoQWK2` | Vanguard Growth ETF xStock | VUGx | _none set_ | n/a — no hook program set | n/a | `not covered` | 21,500 | 8 | `not covered` | n/a | 8 |
| `XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W` | SP500 xStock | SPYx | _none set_ | n/a — no hook program set | n/a | `not covered` | 95,234.9964 | 8 | `not covered` | n/a | 8 |
| `XsPdAVBi8Zc1xvv53k4JcMrQaEDTgkGqKYeh7AYgPHV` | AppLovin xStock | APPx | _none set_ | n/a — no hook program set | n/a | `not covered` | 26,492 | 8 | `not covered` | n/a | 8 |
| `XspwhyYPdWVM8XBHZnpS9hgyag9MKjLRyE3tVfmCbSr` | International Business Machines xStock | IBMx | _none set_ | n/a — no hook program set | n/a | `not covered` | 54,427.8894 | 8 | `not covered` | n/a | 8 |
| `XsQ6NfzzLH8nspjrB9X8R2K64Zz7Tnxqu12juDiMPMW` | Palo Alto Networks xStock | PANWx | _none set_ | n/a — no hook program set | n/a | `not covered` | 53,500 | 8 | `not covered` | n/a | 8 |
| `XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2` | McDonald's xStock | MCDx | _none set_ | n/a — no hook program set | n/a | `not covered` | 54,641.5504 | 8 | `not covered` | n/a | 8 |
| `XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p` | Visa xStock | Vx | _none set_ | n/a — no hook program set | n/a | `not covered` | 45,991.5154 | 8 | `not covered` | n/a | 8 |
| `XsQLZycSZ7QnBBdBXQaTbQdiUcbRqjNJgyBGAMzhHav` | Micron Technology xStock | MUx | _none set_ | n/a — no hook program set | n/a | `not covered` | 42,197.9416 | 8 | `not covered` | n/a | 8 |
| `XsQZdaWUAGC4R3fgD2N1fupKvJfJq6YM51ccnsLUWFA` | Applied Materials, Inc. xStock | AMATx | _none set_ | n/a — no hook program set | n/a | `not covered` | 15,000 | 8 | `not covered` | n/a | 8 |
| `XsRbLZthfABAPAfumWNEJhPyiKDW6TvDVeAeW7oKqA2` | Honeywell xStock | HONx | _none set_ | n/a — no hook program set | n/a | `not covered` | 74,319.2055 | 8 | `not covered` | n/a | 8 |
| `XsrsM2RgtYxXqxmy4iWgxQJUkkHG1U5wzi74sVNUW8m` | Arista Networks, Inc. xStock | ANETx | _none set_ | n/a — no hook program set | n/a | `not covered` | 41,000 | 8 | `not covered` | n/a | 8 |
| `XsSN912SN4Whn2xn59vWZHt1uLbw9WnoNGp5MigmHFf` | Lam Research Corporation xStock | LRCXx | _none set_ | n/a — no hook program set | n/a | `not covered` | 24,000 | 8 | `not covered` | n/a | 8 |
| `XsSr8anD1hkvNMu8XQiVcmiaTP7XGvYu7Q58LdmtE8Z` | Linde xStock | LINx | _none set_ | n/a — no hook program set | n/a | `not covered` | 34,314.9999 | 8 | `not covered` | n/a | 8 |
| `XsssYEQjzxBCFgvYFFNuhJFBeHNdLWYeUSP8F45cDr9` | Vanguard xStock | VTIx | _none set_ | n/a — no hook program set | n/a | `not covered` | 49,294 | 8 | `not covered` | n/a | 8 |
| `Xssu2cDLdZXZYrq17frTVrb3meumRCAzEf7pXyxoWVN` | Constellation Energy Corporation xStock | CEGx | _none set_ | n/a — no hook program set | n/a | `not covered` | 33,992.4159 | 8 | `not covered` | n/a | 8 |
| `Xst6eFD4YT6sz9RLMysN9SyvaZWtraSdVJQGu5ZkAme` | abrdn Physical Platinum Shares xStock | PPLTx | _none set_ | n/a — no hook program set | n/a | `not covered` | 79,671.53 | 8 | `not covered` | n/a | 8 |
| `XstuBvLo7soZzj3beCCPonHpR3eUfPNSeQzw35Swons` | VanEck Semiconductor ETF xStock | SMHx | _none set_ | n/a — no hook program set | n/a | `not covered` | 22,999.9999 | 8 | `not covered` | n/a | 8 |
| `Xsu7Tc5J2fVUE4H5vYAiSr34cvLJeCsYPMjAYnayQn6` | Dell Technologies Inc. xStock | DELLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 45,963.3722 | 8 | `not covered` | n/a | 8 |
| `XswbinNKyPmzTa5CskMbCPvMW6G5CMnZXZEeQSSQoie` | AbbVie xStock | ABBVx | _none set_ | n/a — no hook program set | n/a | `not covered` | 68,624.5742 | 8 | `not covered` | n/a | 8 |
| `Xswbpc8UqU6e1j9QZEWCjBMjyvz4twqD7PCy6j2e7jj` | Sandisk Corporation xStock | SNDKx | _none set_ | n/a — no hook program set | n/a | `not covered` | 14,893.6449 | 8 | `not covered` | n/a | 8 |
| `XswCi2U1G6Ppbw1QhG45yKb8UKuR1FKLJrquv2FZSD4` | T-Mobile xStock | TMUSx | _none set_ | n/a — no hook program set | n/a | `not covered` | 77,500 | 8 | `not covered` | n/a | 8 |
| `XsXcJ6GZ9kVnjqGsjBnktRcuwMBmvKWh8S93RefZ1rF` | AMD xStock | AMDx | _none set_ | n/a — no hook program set | n/a | `not covered` | 71,480.9726 | 8 | `not covered` | n/a | 8 |
| `XsXoAR52Q2NYFkYiNqhCq4FauvyA1tdRsrmEYNf9fuh` | iShares U.S. Aerospace & Defense ETF xStock | ITAx | _none set_ | n/a — no hook program set | n/a | `not covered` | 45,000 | 8 | `not covered` | n/a | 8 |
| `XsYD72ntjj7ZwoFDZCDmN2gamTcLpnywqvG7PQN5vCN` | iShares 0-3 Month Treasury Bond ETF xStock | SGOVx | _none set_ | n/a — no hook program set | n/a | `not covered` | 51,991.8112 | 8 | `not covered` | n/a | 8 |
| `XszjVtyhowGjSC5odCqBpW1CtXXwXjYokymrk7fGKD3` | Home Depot xStock | HDx | _none set_ | n/a — no hook program set | n/a | `not covered` | 45,297.6650 | 8 | `not covered` | n/a | 8 |
| `XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe` | UnitedHealth xStock | UNHx | _none set_ | n/a — no hook program set | n/a | `not covered` | 49,390.9851 | 8 | `not covered` | n/a | 8 |
| `Z1K14ngynqmrmfRSC2dRZGs1ghmnDKiiahjaM2condo` | AXT (Ondo Tokenized) | AXTIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,503.1375 | 9 | `not covered` | n/a | 7 |
| `Zfb5PTVfGa8AV6VxrTQJuP8CjMXFPMVkVVNpcAWondo` | Wolfspeed (Ondo Tokenized) | WOLFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 7,500.0036 | 9 | `not covered` | n/a | 7 |
| `123mYEnRLM2LLYsJW3K6oyYh8uP1fngj732iG638ondo` | Apple (Ondo Tokenized) | AAPLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 329.9936 | 9 | `not covered` | n/a | 7 |
| `12J2LD3tuLfdiVKnWZMHRMrbnXDY9rM4yqVLUa5yondo` | Denison Mines (Ondo Tokenized) | DNNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 405.3180 | 9 | `not covered` | n/a | 7 |
| `12y35E6btjazuaSjjwq99MobbycbkFsFvm8s5QpaSHFT` | Shift S&P500 3x Long | SPX3L | _none set_ | n/a — no hook program set | n/a | `not covered` | 2,902.4698 | 8 | `not covered` | n/a | 8 |
| `14diAn5z8kjrKwSC8WLqvBqqe5YmihJhjxRxd8Z6ondo` | AMD (Ondo Tokenized) | AMDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 217.7303 | 9 | `not covered` | n/a | 7 |
| `14Tqdo8V1FhzKsE3W2pFsZCzYPQxxupXRcqw9jv6ondo` | Amazon (Ondo Tokenized) | AMZNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 595.4398 | 9 | `not covered` | n/a | 7 |
| `15SsCZqCsM9fZGhTmP4rdJTPT9WGZKazDSsgeQ8ondo` | Arm Holdings plc (Ondo Tokenized) | ARMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 104.1585 | 9 | `not covered` | n/a | 7 |
| `1eLZPRsn8bAKmoxsqDMH9Q2m2k7GMNp6RLSQGm8ondo` | ASML Holding NV (Ondo Tokenized) | ASMLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 140.6846 | 9 | `not covered` | n/a | 7 |
| `1FWZtdWN7y38BSXGzbs8D6Shk88oL9atDNgbVz9ondo` | Broadcom (Ondo Tokenized) | AVGOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 149.4314 | 9 | `not covered` | n/a | 7 |
| `1GNFMryQ6c9ZpMhgNimmsbtgYM21qnBJgRAFoNiondo` | Occidental Petroleum (Ondo Tokenized) | OXYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 310.0629 | 9 | `not covered` | n/a | 7 |
| `1zvb9ELBFShBCWKEk5jRTJAaPAwtVt7quEXx1X4ondo` | Alibaba (Ondo Tokenized) | BABAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 476.9417 | 9 | `not covered` | n/a | 7 |
| `5u6KDiNJXxX4rGMfYT4BApZQC5CuDNrG6MHkwp1ondo` | Coinbase (Ondo Tokenized) | COINon | _none set_ | n/a — no hook program set | n/a | `not covered` | 189.0088 | 9 | `not covered` | n/a | 7 |
| `7D7ukbcnUNYt7Et5vtsDZhAy28MKu9pkHka1Hp9ondo` | Salesforce (Ondo Tokenized) | CRMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 223.2345 | 9 | `not covered` | n/a | 7 |
| `7NWHifsBnn9DimUeNnsHdEXkTZhXmJTiXxcCngBondo` | Constellation Energy (Ondo Tokenized) | CEGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 347.0171 | 9 | `not covered` | n/a | 7 |
| `a2cXfonVgQ6cKB4Lm8YZsPry39VZSA562bwmRSiondo` | Snap (Ondo Tokenized) | SNAPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 909.6888 | 9 | `not covered` | n/a | 7 |
| `A9PFmw9Hu8zzxDUoU351pio1E1XWBWBfWnjT9qoondo` | Bullish (Ondo Tokenized) | BLSHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 333.9468 | 9 | `not covered` | n/a | 7 |
| `aA1dRckexLmQyppFoWmjKDFjrNFUsZeGzZ7L5xpondo` | USA Rare Earth (Ondo Tokenized) | USARon | _none set_ | n/a — no hook program set | n/a | `not covered` | 922.9892 | 9 | `not covered` | n/a | 7 |
| `aq2zXUHqx7Zk6HSJH2GYsNajQJZj9f3dV7gAzfuondo` | Planet Labs (Ondo Tokenized) | PLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 129.2220 | 9 | `not covered` | n/a | 7 |
| `aTBfDuLRqYHBiG82bHA7DzwjSDTFre2dRtGH3S5ondo` | General Electric (Ondo Tokenized) | GEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 161.4174 | 9 | `not covered` | n/a | 7 |
| `AXRsYFt7TXNQ3DcY6BkvRgPV6VsYMURyDtaeudjondo` | Rivian Automotive (Ondo Tokenized) | RIVNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 214.5727 | 9 | `not covered` | n/a | 7 |
| `aznKt8v32CwYMEcTcB4bGTv8DXWStCpHrcCtyy7ondo` | GameStop (Ondo Tokenized) | GMEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 138.5775 | 9 | `not covered` | n/a | 7 |
| `B6WqvLGXdGqpw7qgxeb5EGiRZEYo2apWpQybjYuondo` | Applied Digital (Ondo Tokenized) | APLDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 519.1091 | 9 | `not covered` | n/a | 7 |
| `bBMTGF7atoCizHMT3KCeqJzqR2gXFSUXr53AEDgondo` | Bloom Energy (Ondo Tokenized) | BEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 305.4010 | 9 | `not covered` | n/a | 7 |
| `bGy2covWNf5qyzoNdV1pWXuLmFi6Dq927o7JXzWondo` | NuScale Power (Ondo Tokenized) | SMRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 211.5269 | 9 | `not covered` | n/a | 7 |
| `BncvtBGs4JqgYZwUoq3EN9q9HUFqJKTfWpvCsHCondo` | Enlivex Therapeutics (Ondo Tokenized) | ENLVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 844.7379 | 9 | `not covered` | n/a | 7 |
| `BVdXGvmgi6A9oAiwWvBvP76fyTqcCNRJMM7zMN6ondo` | Robinhood Markets (Ondo Tokenized) | HOODon | _none set_ | n/a — no hook program set | n/a | `not covered` | 263.3278 | 9 | `not covered` | n/a | 7 |
| `BWxe2FVciUbwrCUZQPUKiREBh5LmVa5AiUqNLAkondo` | Block (Ondo Tokenized) | XYZon | _none set_ | n/a — no hook program set | n/a | `not covered` | 105.6135 | 9 | `not covered` | n/a | 7 |
| `C8bZkgSxXkyT1RgxByp2teJ24hgimPLoyEYoNa9ondo` | IBM (Ondo Tokenized) | IBMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 681.0611 | 9 | `not covered` | n/a | 7 |
| `CBKcmEvVg5EgE3W5hVSPcBYWh6TFVjQwbmYod9Pondo` | iShares MSCI Brazil ETF (Ondo Tokenized) | EWZon | _none set_ | n/a — no hook program set | n/a | `not covered` | 657.3248 | 9 | `not covered` | n/a | 7 |
| `cdVNL7wK8mf1UCDqM6zdrziRv4hmvqWhXeTcck2ondo` | iShares Core MSCI Emerging Markets ETF (Ondo Tokenized) | IEMGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 331.1247 | 9 | `not covered` | n/a | 7 |
| `CeFbGYXDmkyfo1TXXzzZ512mtnCCewNohu6V15vondo` | iShares China Large-Cap ETF (Ondo Tokenized) | FXIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 110.0490 | 9 | `not covered` | n/a | 7 |
| `CJRoTbu98waCCuLFfLuJ2kXawLk889fqW4UAAbwondo` | Exodus Movement (Ondo Tokenized) | EXODon | _none set_ | n/a — no hook program set | n/a | `not covered` | 137.0147 | 9 | `not covered` | n/a | 7 |
| `cskxd6aqyqJMYgLZmFYfYecWkjasRJDEtm1QVxsondo` | Astera Labs (Ondo Tokenized) | ALABon | _none set_ | n/a — no hook program set | n/a | `not covered` | 130.7367 | 9 | `not covered` | n/a | 7 |
| `CY8ttw5rYCT6fFBJwqXofefqa7Ji9E8zfLmhRLmondo` | Freeport-McMoRan (Ondo Tokenized) | FCXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 280.6465 | 9 | `not covered` | n/a | 7 |
| `D1tu7Fnm3cCpKyyPXrqm5GXShPqMj7a2SEjjq9fondo` | ProShares UltraPro Short QQQ (Ondo Tokenized) | SQQQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 315.3068 | 9 | `not covered` | n/a | 7 |
| `DDZQijTbaSd3Kas1r1bgCnHPayk8vTP8SfZWp5Tondo` | IonQ (Ondo Tokenized) | IONQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 304.5848 | 9 | `not covered` | n/a | 7 |
| `DVPSYdqWPLvNa8afnEqa3B9eDfTTWpGyUZeXvdMondo` | KraneShares CSI China Internet ETF (Ondo Tokenized) | KWEBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 112.1082 | 9 | `not covered` | n/a | 7 |
| `dwEPNKQab3iwRmjGvZPXhAmws1W5NsQGwuXwi8oondo` | Rigetti Computing (Ondo Tokenized) | RGTIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 461.8911 | 9 | `not covered` | n/a | 7 |
| `DYoCmA91VE8REbWNw3kM736PN7vv97qc2jr5wmUbuNtZ` | Agant GBP | GBPA | _none set_ | n/a — no hook program set | n/a | `not covered` | 200,012 | 6 | `not covered` | n/a | 9 |
| `E4YowrHx5wm4RtSjfuvTqtNH3Wf7NEj5tYZGD9Bondo` | Quantum Computing (Ondo Tokenized) | QUBTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 287.9920 | 9 | `not covered` | n/a | 7 |
| `E6KSaqjvqe2HiUpbEweRxLK4RimQddigm95H9Jaondo` | Redwire (Ondo Tokenized) | RDWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 401.7552 | 9 | `not covered` | n/a | 7 |
| `E9VQY3VnrpVSekFByzRmfeK1kxgM3UiKCoVVbdUondo` | Rocket Lab (Ondo Tokenized) | RKLBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 810.5245 | 9 | `not covered` | n/a | 7 |
| `eCSPcjdpdKL1546PU3RM6BXkebuKn8iH4iuMcTBondo` | Mobileye Global (Ondo Tokenized) | MBLYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 247.9549 | 9 | `not covered` | n/a | 7 |
| `eGbh3V9R5ujWYwKJZAyM4Eg3sfzLhwKyr4bGbTsondo` | Aurora Innovation (Ondo Tokenized) | AURon | _none set_ | n/a — no hook program set | n/a | `not covered` | 185.5397 | 9 | `not covered` | n/a | 7 |
| `EN5pHc1LccUSojxb7kkyQi7v7iJN5RpDq6qz3DHondo` | iShares Semiconductor ETF (Ondo Tokenized) | SOXXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 319.1170 | 9 | `not covered` | n/a | 7 |
| `EsVHcyRxXFJCLMiuYLWhoDygrNe1BJGpYeZ17X7ondo` | Mastercard (Ondo Tokenized) | MAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 123.8419 | 9 | `not covered` | n/a | 7 |
| `EvzskrQ3vUUkiMGG1DzfSDyG6H2WCMy3v9G8fzzondo` | Global X Uranium ETF (Ondo Tokenized) | URAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 655.7234 | 9 | `not covered` | n/a | 7 |
| `EYo8D3cLdF1CDeGms5M5VHyU52HJYinkMZ1cqvYondo` | Uranium Energy (Ondo Tokenized) | UECon | _none set_ | n/a — no hook program set | n/a | `not covered` | 238.2825 | 9 | `not covered` | n/a | 7 |
| `FovBwhoV5KQjZCdhoM6jgXYwXLX3F8vgAfvmLH7ondo` | Marvell Technology (Ondo Tokenized) | MRVLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 905.5221 | 9 | `not covered` | n/a | 7 |
| `FRmH6iRkMr33DLG6zVLR7EM4LojBFAuq6NtFzG6ondo` | Microsoft (Ondo Tokenized) | MSFTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 456.2801 | 9 | `not covered` | n/a | 7 |
| `FSz4ouiqXpHuGPcpacZfTzbMjScoj5FfzHkiyu2ondo` | MicroStrategy (Ondo Tokenized) | MSTRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 189.6589 | 9 | `not covered` | n/a | 7 |
| `g646pcdG2Rt5DH9WZzL7VVnVDWCCMTTrnktwE74ondo` | Nike (Ondo Tokenized) | NKEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 679.1858 | 9 | `not covered` | n/a | 7 |
| `G7pTVoSECz5RQWubEnTP7AC83KHUsSyoiqYR1R2ondo` | ServiceNow (Ondo Tokenized) | NOWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 394.0252 | 9 | `not covered` | n/a | 7 |
| `gKkrSgVjRjdQX4LFErBka1izQhoW2VHXFcCS5Vbondo` | iShares A.I. Innovation and Tech Active ETF (Ondo Tokenized) | BAIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 133.2504 | 9 | `not covered` | n/a | 7 |
| `GmDADFpfwjfzZq9MfCafMDTS69MgVjtzD7Fd9a4ondo` | Oracle (Ondo Tokenized) | ORCLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 323.3415 | 9 | `not covered` | n/a | 7 |
| `Gwh9fPsX1qWATXy63vNaJnAFfwebWQtZaVmPko6ondo` | Pfizer (Ondo Tokenized) | PFEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 692.0286 | 9 | `not covered` | n/a | 7 |
| `HfsnTS5qtdStwec9DfBrunRqnAMYMMz1kjv9Hu9ondo` | Palantir Technologies (Ondo Tokenized) | PLTRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 929.4430 | 9 | `not covered` | n/a | 7 |
| `HjrN6ChZK2QRL6hMXayjGPLFvxhgjwKEy135VRjondo` | iShares 0-3 Month Treasury Bond ETF (Ondo Tokenized) | SGOVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 824.9763 | 9 | `not covered` | n/a | 7 |
| `hM7B3UQTTR81mS27SxDDPzBbjejmo8fnpFjzgv9ondo` | PayPal (Ondo Tokenized) | PYPLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 596.9585 | 9 | `not covered` | n/a | 7 |
| `hqJXutLF6f7DxStrWCrnZDfXzbNTZmvi3KheVi6ondo` | D-Wave Quantum (Ondo Tokenized) | QBTSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 257.1532 | 9 | `not covered` | n/a | 7 |
| `Huyb2fyDDjSuDKCRWsN9ci2rmcgPo6NFiLbx9ZDondo` | SK Hynix (Ondo Tokenized) | SKHYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 400.1818 | 9 | `not covered` | n/a | 7 |
| `HXFrTf9v9NdjGUTnx4sojR3Cf92hoBsQFUxKTN7ondo` | Reddit (Ondo Tokenized) | RDDTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 281.1696 | 9 | `not covered` | n/a | 7 |
| `Hyhxfb6riaqCV333GynmnCXCEQK3goTznFj7k4dSHFT` | Shift Semiconductor 3x Long | SOX3L | _none set_ | n/a — no hook program set | n/a | `not covered` | 3,967.3836 | 8 | `not covered` | n/a | 8 |
| `i6f3DvZBuLpnGSqS8x6WPeStJ7jNe5KewD6afD5ondo` | Riot Platforms (Ondo Tokenized) | RIOTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 867.7244 | 9 | `not covered` | n/a | 7 |
| `igu1coP6n3GPaWmbd8J9Z7UAyLpV254uQFFNfydondo` | Verizon (Ondo Tokenized) | VZon | _none set_ | n/a — no hook program set | n/a | `not covered` | 164.4469 | 9 | `not covered` | n/a | 7 |
| `iLDu2jjp2i3Uqc2Vm7K7GLiUj3hR4Un49MtD7c4ondo` | SharpLink Gaming (Ondo Tokenized) | SBETon | _none set_ | n/a — no hook program set | n/a | `not covered` | 148.4098 | 9 | `not covered` | n/a | 7 |
| `ivnSAcjCqEtWYTKFbqYe8YoqRZqCBfT4BGP5G1nondo` | Direxion Daily Semi Bear 3X ETF (Ondo Tokenized) | SOXSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 235.6702 | 9 | `not covered` | n/a | 7 |
| `jLca79XzcewRuBZyaJxVxuKpUHcEix1X4CP1RP9ondo` | Super Micro Computer (Ondo Tokenized) | SMCIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 775.6567 | 9 | `not covered` | n/a | 7 |
| `k18WJUULWheRkSpSquYGdNNmtuE2Vbw1hpuUi92ondo` | SPDR S&P 500 ETF (Ondo Tokenized) | SPYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 165.9078 | 9 | `not covered` | n/a | 7 |
| `KcCVQxG9LhFYP5o9DWFKTFgFShPPQkDEemVbiFyondo` | Archer Aviation (Ondo Tokenized) | ACHRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 344.3105 | 9 | `not covered` | n/a | 7 |
| `KeGv7bsfR4MheC1CkmnAVceoApjrkvBhHYjWb67ondo` | Tesla (Ondo Tokenized) | TSLAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 358.5932 | 9 | `not covered` | n/a | 7 |
| `keybg184d4vyXeQdFqs4o99YsMg7xBthxTJ6Ky3ondo` | Taiwan Semiconductor Manufacturing (Ondo Tokenized) | TSMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 403.8863 | 9 | `not covered` | n/a | 7 |
| `KJNeFW3kk3ycPjXpC6cbuyckjeYHacc2ekhtAi5ondo` | Uber (Ondo Tokenized) | UBERon | _none set_ | n/a — no hook program set | n/a | `not covered` | 579.7219 | 9 | `not covered` | n/a | 7 |
| `kTMQKHhnWPTvZsfiZfcdeHdG6dMgZV27wXSiC3Yondo` | HIVE Digital Technologies (Ondo Tokenized) | HIVEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 193.8663 | 9 | `not covered` | n/a | 7 |
| `kxEW4oJL75K37VeXaZF1ynbHQATQwhECQKN1374ondo` | Visa (Ondo Tokenized) | Von | _none set_ | n/a — no hook program set | n/a | `not covered` | 163.5739 | 9 | `not covered` | n/a | 7 |
| `m6oDLvJT7rY7M1TxuLWP3pWmAPg2cCWDQR1NKiEondo` | Oklo (Ondo Tokenized) | OKLOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 589.6877 | 9 | `not covered` | n/a | 7 |
| `m9GcsVgdjaL3KsdtSFHimnhtsUMpTHkjtwEG4Tzondo` | Grab Holdings (Ondo Tokenized) | GRABon | _none set_ | n/a — no hook program set | n/a | `not covered` | 327.1275 | 9 | `not covered` | n/a | 7 |
| `oXeD5ZesXfJQ3mxtuZdMaccUsWrE8r1SnpYRP2Bondo` | Roundhill Memory ETF (Ondo Tokenized) | DRAMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 858.2155 | 9 | `not covered` | n/a | 7 |
| `PnjETBCLC318DRejo9cMQKAmET9PvW8AEFGWMNtondo` | PDD Holdings (Ondo Tokenized) | PDDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 130.7012 | 9 | `not covered` | n/a | 7 |
| `rpydAzWdCy85HEmoQkH5PVxYtDYQWjmLxgHHadxondo` | United States Oil Fund (Ondo Tokenized) | USOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 182.9985 | 9 | `not covered` | n/a | 7 |
| `t29YBAB7g6xzgRJkzmc5NkQ7YRjE3NF8mhsLgppondo` | Global X Data Center & Digital Infrastructure ETF (Ondo Tokenized) | DTCRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 105.1261 | 9 | `not covered` | n/a | 7 |
| `t7eN6cGwRMFaZvsNW2SmVwkedmHtDdrxA4ycNE5ondo` | NextEra Energy (Ondo Tokenized) | NEEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 276.3172 | 9 | `not covered` | n/a | 7 |
| `TnfswqdE1jAJ8sfnf5J7kSVLEH1cfpAYZ8MWmKfondo` | Plug Power (Ondo Tokenized) | PLUGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 181.7880 | 9 | `not covered` | n/a | 7 |
| `ueEYw3Djy9GVu9mrP6jum8qNpxshgcy7gMfmntWondo` | Global X NASDAQ 100 Covered Call ETF (Ondo Tokenized) | QYLDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 363.2058 | 9 | `not covered` | n/a | 7 |
| `vE2qArmjto6VfeMngyGAnzp2ipLYeXsxiARDnnXondo` | SoundHound AI (Ondo Tokenized) | SOUNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 158.6326 | 9 | `not covered` | n/a | 7 |
| `WKMZummev5UcXz5nNKQZvTD6QjNSM2X58uwmDReondo` | AT&T (Ondo Tokenized) | Ton | _none set_ | n/a — no hook program set | n/a | `not covered` | 440.6730 | 9 | `not covered` | n/a | 7 |
| `WNZBSkNBNP3Ct1pcFn6Fu4sZQFhnu48EsM9voCEondo` | Cipher Mining (Ondo Tokenized) | CIFRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 146.5332 | 9 | `not covered` | n/a | 7 |
| `wzAyQTorWyoVXuJKj2x8EqKEGJpS13z6EWE9z5Aondo` | SpaceX (Ondo Tokenized) | SPCXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 631.1424 | 9 | `not covered` | n/a | 7 |
| `X68p9qTpEMkR1TLpXUP2ZJo8PG4Qge2Y2ZLdjA2ondo` | ConocoPhillips (Ondo Tokenized) | COPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 102.7620 | 9 | `not covered` | n/a | 7 |
| `XsexQ9qqNbDkLE6XwCN9ceVhLo8Lxc7UheVR6eBkKyo` | Lumentum Holdings Inc. xStock | LITEx | _none set_ | n/a — no hook program set | n/a | `not covered` | 7,999.9999 | 8 | `not covered` | n/a | 8 |
| `XshuHQ6o6SVpUNawvnnTMxsZ4tacZsNgVCLorv7TkFq` | ASML xStock | ASMLx | _none set_ | n/a — no hook program set | n/a | `not covered` | 9,399.9999 | 8 | `not covered` | n/a | 8 |
| `Xsw2uU1i8tHjbgstUbtt3m6kg7BS7AgG5aj8z7ddmmN` | KLA Corporation xStock | KLACx | _none set_ | n/a — no hook program set | n/a | `not covered` | 3,999.9999 | 8 | `not covered` | n/a | 8 |
| `XswXzAsMV9kebQjCVtr1btvrQgQ7C4C9kKgH4QYAVzw` | GE Vernova Inc. xStock | GEVx | _none set_ | n/a — no hook program set | n/a | `not covered` | 6,000 | 8 | `not covered` | n/a | 8 |
| `XwFm5GiKPVTvPiEbQpdc6vJbFEpsUXRMf6TcSxnondo` | MP Materials (Ondo Tokenized) | MPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 572.3332 | 9 | `not covered` | n/a | 7 |
| `y6kSRF4i9tfMMjZziPHtQE1PeUS6bWEHTzZMFgXondo` | Strategy Stretch Preferred (Ondo Tokenized) | STRCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 347.7967 | 9 | `not covered` | n/a | 7 |
| `yQ37dFiGAbzrb2FRAEhGNzRy5zFfoYGWYhAepFEondo` | NIO (Ondo Tokenized) | NIOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 227.4622 | 9 | `not covered` | n/a | 7 |
| `YuFZvc8JCN3a6BUAqwnbY4AnhuVEXD4V7QnBTmwondo` | Applied Optoelectronics (Ondo Tokenized) | AAOIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 306.1714 | 9 | `not covered` | n/a | 7 |
| `YXE7mph6XhsgnyezkMEcTuohSuWhbLWfwx2Hh6mondo` | BigBear.ai Holdings (Ondo Tokenized) | BBAIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 952.3547 | 9 | `not covered` | n/a | 7 |
| `ZNkQTVtc4WRMQfVCC23PmwYX41577tPcvs2AiXAondo` | MKS Inc. (Ondo Tokenized) | MKSIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 133.5655 | 9 | `not covered` | n/a | 7 |
| `128qNYovdGv2YqayErcJgU7gDwbNVX1VuoxbtWz8ondo` | Airbnb (Ondo Tokenized) | ABNBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 76.5141 | 9 | `not covered` | n/a | 7 |
| `12BvLZtzjdssAycxPeBQUjukhmgQpULAvy6SroYdondo` | RTX (Ondo Tokenized) | RTXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 18.2518 | 9 | `not covered` | n/a | 7 |
| `12Rh6JhfW4X5fKP16bbUdb4pcVCKDHFB48x8GG33ondo` | Adobe (Ondo Tokenized) | ADBEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 21.6487 | 9 | `not covered` | n/a | 7 |
| `14VP7DvCAdBCc5XGNZkPt6zhtPzJrWWS64Koxtxyondo` | Moderna (Ondo Tokenized) | MRNAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 14.9391 | 9 | `not covered` | n/a | 7 |
| `1MGRpPrkhEsCm2GCWD3rsvEU77xTTLAzfKXeFgFondo` | Intuitive Surgical (Ondo Tokenized) | ISRGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 14.7819 | 9 | `not covered` | n/a | 7 |
| `54CoRF2FYMZNJg9tS36xq5BUcLZ7rju1r59jGc2ondo` | Baidu (Ondo Tokenized) | BIDUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 34.5691 | 9 | `not covered` | n/a | 7 |
| `5hT2o25X9tGXipwhLckaUdgnxrZ6Y8eiUwdhpLeondo` | Ford Motor (Ondo Tokenized) | Fon | _none set_ | n/a — no hook program set | n/a | `not covered` | 14.0255 | 9 | `not covered` | n/a | 7 |
| `6JLG8iUkAuqiBhL3j2ckDMDf5oWAa6awmyaWezKondo` | iShares Bitcoin Trust (Ondo Tokenized) | IBITon | _none set_ | n/a — no hook program set | n/a | `not covered` | 24.6663 | 9 | `not covered` | n/a | 7 |
| `7DWcZE1uVc8m2mf9pV8KNov28ET7HsvHkhrhgr9ondo` | Cisco Systems (Ondo Tokenized) | CSCOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 15.0343 | 9 | `not covered` | n/a | 7 |
| `7tgKziACteG26VjV5xKufojKxwTgCFyTwmWUmz5ondo` | Chevron (Ondo Tokenized) | CVXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 90.1531 | 9 | `not covered` | n/a | 7 |
| `81xLFvCzFaUM3KDxSHC75pXu3RPCeSeCbmGBY8aondo` | Texas Instruments (Ondo Tokenized) | TXNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 11.5665 | 9 | `not covered` | n/a | 7 |
| `9wYZetvT8J2ptfsRca5gzLBGvcUug38mp9yT3xaondo` | American Airlines Group (Ondo Tokenized) | AALon | _none set_ | n/a — no hook program set | n/a | `not covered` | 57.7926 | 9 | `not covered` | n/a | 7 |
| `AbvryMGnaba9oADMZk8Vp2Av6MtczsncGyfWaC4ondo` | iShares MSCI EAFE ETF (Ondo Tokenized) | EFAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 44.1511 | 9 | `not covered` | n/a | 7 |
| `amE2ANm5dyG6RTkJHdtzvWcuR8ChBZCEm5Jiqwdondo` | Nokia (Ondo Tokenized) | NOKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 92.8177 | 9 | `not covered` | n/a | 7 |
| `Ao5rKFRQ54W3DKSAtqfhBRPNHewwWRLNLao2JL9ondo` | Futu Holdings (Ondo Tokenized) | FUTUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 76.2118 | 9 | `not covered` | n/a | 7 |
| `aV3R9NPU6TkyA6r9NPF5bmAw5XXsjUU7r2whgBqondo` | Ouster (Ondo Tokenized) | OUSTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 37.7481 | 9 | `not covered` | n/a | 7 |
| `awCwGaVNbYJH2SyQJzgE3mB54gxa6SQEZSKZaHQondo` | Entegris (Ondo Tokenized) | ENTGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 19.5913 | 9 | `not covered` | n/a | 7 |
| `axbgKgUMscTJ34DjA69kBJuf6UYq4Pzb8B8numYondo` | Hewlett Packard Enterprise (Ondo Tokenized) | HPEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 40.2752 | 9 | `not covered` | n/a | 7 |
| `BcVDiSc5DTp8imZE4Nx2abUhhgA3KCxJ4M5g7aHLSHFT` | Shift SpaceX 2x Long | SPCX2L | _none set_ | n/a — no hook program set | n/a | `not covered` | 249.9964 | 8 | `not covered` | n/a | 8 |
| `BJhPr9SM7uZTZXHeSLYmUk7CjGQq1esFkVxPF5tondo` | Fidelity Solana Fund (Ondo Tokenized) | FSOLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 29.0107 | 9 | `not covered` | n/a | 7 |
| `bn1fb8dwzafGePqNPrM8m8cbAKQiFqeEPuZkPySondo` | Merck (Ondo Tokenized) | MRKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 11.1321 | 9 | `not covered` | n/a | 7 |
| `BoTx8y9ynfdxf5ZjWtCoBVkff52qKA82ysaLU8ZM6d8T` | RoboStrategy - Backpack Securities | BOT | _none set_ | n/a — no hook program set | n/a | `not covered` | 39,847.8770 | 6 | `not covered` | n/a | 8 |
| `Bp26APthMuM46gMFTo5KYpo7b92GN2xSCor7f9oondo` | Enphase Energy (Ondo Tokenized) | ENPHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 29.3488 | 9 | `not covered` | n/a | 7 |
| `BpYiU1dBXU1fdB64jbR93wHEw3Y47QeRLZvUyLQondo` | Eaton (Ondo Tokenized) | ETNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 13.6614 | 9 | `not covered` | n/a | 7 |
| `BS8zoc6pmALQnBhBDFak6eFhgGHjpebnHzsxApgondo` | Capricor Therapeutics (Ondo Tokenized) | CAPRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 20.5123 | 9 | `not covered` | n/a | 7 |
| `BVdL3WUxtxUD4vXRWwqChJLbGxvfzZjBGPp63Wtondo` | First Trust NASDAQ Cybersecurity ETF (Ondo Tokenized) | CIBRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 17.9859 | 9 | `not covered` | n/a | 7 |
| `BXMkru8ded26p71gJ3AMMwJmwZaYYfQjRo8vbZzondo` | Coherent (Ondo Tokenized) | COHRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 15.6494 | 9 | `not covered` | n/a | 7 |
| `bz2iUTXWkutnfwG32ziABcTzXoM91sdcgdiJJJdondo` | NANO Nuclear Energy (Ondo Tokenized) | NNEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 42.6730 | 9 | `not covered` | n/a | 7 |
| `C6c7VcxuUYcV5YTsky5HM4PUmfwHTwsDD5DNwwPondo` | iShares MSCI Japan ETF (Ondo Tokenized) | EWJon | _none set_ | n/a — no hook program set | n/a | `not covered` | 10.6110 | 9 | `not covered` | n/a | 7 |
| `c7KEKjzaTQYpTrHM2db8yq3bikPpcXrHgBV8Qcgondo` | Cerebras Systems (Ondo Tokenized) | CBRSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 25.9432 | 9 | `not covered` | n/a | 7 |
| `C8pSaSgjkiTWixS3GM6Hxd6HKnKrgAbY9WDgfVeondo` | iShares MSCI South Korea ETF (Ondo Tokenized) | EWYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 57.6924 | 9 | `not covered` | n/a | 7 |
| `C9J9vZ8N79GzzxFoRkPWCkGtMKU8akg4FhUk4r9ondo` | iShares Core MSCI EAFE ETF (Ondo Tokenized) | IEFAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 53.7119 | 9 | `not covered` | n/a | 7 |
| `C9xNaNujcF1a5fidWAAFReFYqhLRVbyk4yPyGqzondo` | AMC Entertainment (Ondo Tokenized) | AMCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 97.3222 | 9 | `not covered` | n/a | 7 |
| `cBnVXDyZgaaLZM18wAmqsUKnRUFAEJWbq6VuUoaondo` | B2Gold (Ondo Tokenized) | BTGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 18.2303 | 9 | `not covered` | n/a | 7 |
| `cdKfoNjbXgnSuxvoajhtH3uixfZhq1YXhQsS1Rwondo` | CrowdStrike (Ondo Tokenized) | CRWDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 25.1195 | 9 | `not covered` | n/a | 7 |
| `CgZSv89BL58ybWfWobANKEU8nV9jYfFw23G2DZEondo` | GE Vernova (Ondo Tokenized) | GEVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 15.7030 | 9 | `not covered` | n/a | 7 |
| `CozoH5HBTyyeYSQxHcWpGzd4Sq5XBaKzBzvTtN3ondo` | Intuit (Ondo Tokenized) | INTUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 37.2059 | 9 | `not covered` | n/a | 7 |
| `Cq6QtvHpXbJWtFaiMhUDtHy8YVZ95gcD1oZ1cohondo` | Arista Networks (Ondo Tokenized) | ANETon | _none set_ | n/a — no hook program set | n/a | `not covered` | 97.0526 | 9 | `not covered` | n/a | 7 |
| `crakmaGKTuVRYqSBsFsuqio5CmpEQnpibDrVLbDondo` | Arqit Quantum (Ondo Tokenized) | ARQQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 39.7675 | 9 | `not covered` | n/a | 7 |
| `d4Rc6KvP3nQT8zC86Z31zM1DJCSfUD6y424cKnZondo` | Credo Technology Group Holding (Ondo Tokenized) | CRDOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 31.1277 | 9 | `not covered` | n/a | 7 |
| `DBNwt3FoYCKQWdfzxKFNZ4mzuz4Jz1iRzFf7HFzondo` | iShares MSCI India ETF (Ondo Tokenized) | INDAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 22.0121 | 9 | `not covered` | n/a | 7 |
| `DDcAL93Urf7KrPntvKULnZoFs4Wdee1LkkJqLpjondo` | iShares US Aerospace and Defense ETF (Ondo Tokenized) | ITAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 11.0785 | 9 | `not covered` | n/a | 7 |
| `DiDWPZ7vQXfpaeQ8BX68XuDYeiQLv7diDxdeUpaondo` | Intuitive Machines (Ondo Tokenized) | LUNRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 52.7750 | 9 | `not covered` | n/a | 7 |
| `dKGNHXGsZL4GZ4UBTCjpPbaMerqe1EdZ7aFdCxHondo` | Lightwave Logic (Ondo Tokenized) | LWLGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 33.5979 | 9 | `not covered` | n/a | 7 |
| `Dm6FpQ76SsbVmAZ4NvD2mjZP7cxbw1CASr4WwCiondo` | Northrop Grumman (Ondo Tokenized) | NOCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 20.5243 | 9 | `not covered` | n/a | 7 |
| `DRAMjSWR7HRfJKjRkvQWYL2bcaejaVhuxEcjf4pAY4Cw` | Roundhill Memory ETF - Backpack Securities | DRAM | _none set_ | n/a — no hook program set | n/a | `not covered` | 26,213.1183 | 6 | `not covered` | n/a | 8 |
| `DX7g7WNjDpVzNK9CG81v7wb6ZbiNzYfkdzH2Xs5ondo` | iShares Russell 2000 Value ETF (Ondo Tokenized) | IWNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 35.7879 | 9 | `not covered` | n/a | 7 |
| `E5Gczsavxcomqf6Cw1sGCKLabL1xYD2FzKxVoB4ondo` | JPMorgan Chase (Ondo Tokenized) | JPMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 19.1423 | 9 | `not covered` | n/a | 7 |
| `E65CoK961Rs5LzKhGZxbKsB7xpFhYhXogH8nhr8zamTK` | PiggyBank SPYx | pbSPYx | _none set_ | n/a — no hook program set | n/a | `not covered` | 513.9518 | 8 | `not covered` | n/a | 4 |
| `e6G4pfFcrdKxJuZ4YXixRFfMbpMvgXG2Mjcus71ondo` | Coca-Cola (Ondo Tokenized) | KOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 32.5623 | 9 | `not covered` | n/a | 7 |
| `EANjzFjj3nPXHdzN5CE3Z8LLVn69Ce77FE8X4cvondo` | Southern Copper (Ondo Tokenized) | SCCOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 11.7373 | 9 | `not covered` | n/a | 7 |
| `eGGxZwNSfuNKRqQLKaz2hc4QkA2mau7skyxPdj7ondo` | Eli Lilly (Ondo Tokenized) | LLYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 21.6790 | 9 | `not covered` | n/a | 7 |
| `EJmUVvDqAdfH5zEohkdS4234bi3c6iunqEMobjmondo` | SanDisk (Ondo Tokenized) | SNDKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 81.0648 | 9 | `not covered` | n/a | 7 |
| `EoReHwUnGGekbXFHLj5rbCVKiwWqu32GrETMfw4ondo` | Lockheed (Ondo Tokenized) | LMTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 23.6422 | 9 | `not covered` | n/a | 7 |
| `etnBzce6pkJq67QUv78PefkVyCEaA6YBE4hvx1Gondo` | GlobalFoundries (Ondo Tokenized) | GFSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 22.1071 | 9 | `not covered` | n/a | 7 |
| `EWwdgGshGngcMpDV34pWZRSu5bkAuiKuKTTHKQ8ondo` | MercadoLibre (Ondo Tokenized) | MELIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 32.7428 | 9 | `not covered` | n/a | 7 |
| `ey16y4Bk92zmPSvbRznuv3RioAXbVreBkQxrKGDondo` | Energy Fuels (Ondo Tokenized) | UUUUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 64.0905 | 9 | `not covered` | n/a | 7 |
| `fFTZ9Jckm2X811mdqRBS4ckMz5bRAJVjH4Jwofwondo` | Amphenol (Ondo Tokenized) | APHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 42.3397 | 9 | `not covered` | n/a | 7 |
| `FLqH2jB2DZPJP5nnVFAakRKaNTcDZtq71Pnpp6Aondo` | Western Digital (Ondo Tokenized) | WDCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 62.1942 | 9 | `not covered` | n/a | 7 |
| `FPvKvWzSzDZqgYmSZUetrkpUXSwo2VtpR4BynVYondo` | Waste Management (Ondo Tokenized) | WMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 20.8854 | 9 | `not covered` | n/a | 7 |
| `FtBpBcLU4Epjm2nnuQNRYGkFM6jfsXrcGKJSiKCtSHFT` | Shift SpaceX 2x Short | SPCX2S | _none set_ | n/a — no hook program set | n/a | `not covered` | 395.7177 | 8 | `not covered` | n/a | 8 |
| `fVPj4hHHVEeUrzVnad5fvxFEPGAXD5X6wkw1Xjdondo` | Cameco (Ondo Tokenized) | CCJon | _none set_ | n/a — no hook program set | n/a | `not covered` | 92.4920 | 9 | `not covered` | n/a | 7 |
| `g4KnPrxPLeeKkwvDmZFMtYQPM64eHeShbD55vK6ondo` | Netflix (Ondo Tokenized) | NFLXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 13.9169 | 9 | `not covered` | n/a | 7 |
| `gud6b3fYekjhMG5F818BALwbg2vt4JKoow59Md9ondo` | PepsiCo (Ondo Tokenized) | PEPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 92.5661 | 9 | `not covered` | n/a | 7 |
| `h6MW8GFpfzxFa1JNn6hZNnBF3t4fj9SHAXKy6LXondo` | Vistra (Ondo Tokenized) | VSTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 44.8386 | 9 | `not covered` | n/a | 7 |
| `h73FNVBDq95fqGBy5eunHm2FVfu2jWZNkeXHDieondo` | Huntington Ingalls Industries (Ondo Tokenized) | HIIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 92.9351 | 9 | `not covered` | n/a | 7 |
| `HMtfKJDqiAbY6damtfGisodK4sotG4Vc3wiLmTXmSHFT` | Shift SpaceX | SPCX1L | _none set_ | n/a — no hook program set | n/a | `not covered` | 129.0615 | 8 | `not covered` | n/a | 8 |
| `hrmX7MV5hifoaBVjnrdpz698yABxrbBNAcWtWo9ondo` | Qualcomm (Ondo Tokenized) | QCOMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 23.7246 | 9 | `not covered` | n/a | 7 |
| `HrYNm6jTQ71LoFphjVKBTdAE4uja7WsmLG8VxB8ondo` | Invesco QQQ (Ondo Tokenized) | QQQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 70.8736 | 9 | `not covered` | n/a | 7 |
| `hrZ5vs6c6v1iWyvEXjGSHs3sQuuj58VzXikNyRWondo` | First Majestic Silver (Ondo Tokenized) | AGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 62.7003 | 9 | `not covered` | n/a | 7 |
| `hWfiw4mcxT8rnNFkk6fsCQSxoxgZ9yVhB6tyeVcondo` | SPDR Gold Shares (Ondo Tokenized) | GLDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 26.1075 | 9 | `not covered` | n/a | 7 |
| `iFcwEB2LfeYLWKgZ2vogEzC5dP7s7xbhVX81XFwondo` | Halliburton (Ondo Tokenized) | HALon | _none set_ | n/a — no hook program set | n/a | `not covered` | 59.6318 | 9 | `not covered` | n/a | 7 |
| `iJAAwDNzJHbgKm5pksL3kXHc3zZewYm37dsZNCPondo` | Defiance Quantum ETF (Ondo Tokenized) | QTUMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 27.7840 | 9 | `not covered` | n/a | 7 |
| `iPFqjcZQTNMNXA4kbShbMhfAVD8yr8Uq9UtXMV6ondo` | Starbucks (Ondo Tokenized) | SBUXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 32.6945 | 9 | `not covered` | n/a | 7 |
| `isRSJECP9yFPv9YejzGUdjzAGHbF2x5DpVeDqAiondo` | Direxion Daily Semi Bull 3X ETF (Ondo Tokenized) | SOXLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 25.3074 | 9 | `not covered` | n/a | 7 |
| `ivBnfPTyuHDNWmMSnbavckhJK6SHZW8h77nZKsEondo` | First Trust Global Tactical Commodity Strategy Fund (Ondo Tokenized) | FTGCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 31.6205 | 9 | `not covered` | n/a | 7 |
| `jCCU4GwukjNxAXJowG2S4KCrr5g6YyUB61WHYvGondo` | Vanguard Total Stock Market ETF (Ondo Tokenized) | VTIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 21.3576 | 9 | `not covered` | n/a | 7 |
| `jjnSEAsi8UbCez7x9XCbWntLWRHBdc2tWSdC3uoondo` | Rambus (Ondo Tokenized) | RMBSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 11.8825 | 9 | `not covered` | n/a | 7 |
| `JmFLCBwoNvcXy6B2VqABg6m784ubkXpaEx3p7S5ondo` | Snowflake (Ondo Tokenized) | SNOWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 41.7216 | 9 | `not covered` | n/a | 7 |
| `JrTYw7A9jihX5TwpRStYviEbsYf2X2VJpZ13719ondo` | S&P Global (Ondo Tokenized) | SPGIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 25.1334 | 9 | `not covered` | n/a | 7 |
| `jtnRMv1U3bJHQCsi47E6Lf8Nzkaqsisef7SkHBgondo` | WhiteFiber (Ondo Tokenized) | WYFIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 19.7721 | 9 | `not covered` | n/a | 7 |
| `kbmF7ERJWMaaDswMprrH9gHSLya5D2RMBNgKqg3ondo` | Toyota (Ondo Tokenized) | TMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 31.4650 | 9 | `not covered` | n/a | 7 |
| `kPBGL8vAwKN3UGmr9cjkM2dU79SC3nzTC9yu7F8ondo` | UnitedHealth (Ondo Tokenized) | UNHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 18.0025 | 9 | `not covered` | n/a | 7 |
| `KUXt7LzHWSQXp5eyqMZRxWjAP6yM8BUh4LRHwiwondo` | Johnson & Johnson (Ondo Tokenized) | JNJon | _none set_ | n/a — no hook program set | n/a | `not covered` | 12.1081 | 9 | `not covered` | n/a | 7 |
| `L6ZE5qCpVVSqLePz64CrwkgyWoPF9M7tB8BeFH4ondo` | Wells Fargo (Ondo Tokenized) | WFCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 26.7276 | 9 | `not covered` | n/a | 7 |
| `LitNUakTges74cjDJm6HHfFNKGPdySkp3MWSYzYondo` | iShares Ethereum Trust (Ondo Tokenized) | ETHAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 28.3774 | 9 | `not covered` | n/a | 7 |
| `LZddqAqKqJW9oMZSjTxCUmbmzBRQtv9gMkD9hZ3ondo` | Walmart (Ondo Tokenized) | WMTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 13.9991 | 9 | `not covered` | n/a | 7 |
| `M7hVQomhw4Q2D2op3HvBrZjHu9SryjNvD5haEZ1ondo` | Palo Alto Networks (Ondo Tokenized) | PANWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 15.5141 | 9 | `not covered` | n/a | 7 |
| `MkN2TZSYTFBdMRLf9EVcfhstTwnazH8knd9hpepondo` | Vertiv (Ondo Tokenized) | VRTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 82.3452 | 9 | `not covered` | n/a | 7 |
| `nP42LxpSZkUfnBUxiFsHxL5GKYWRZ1VxqGkMTNwondo` | Symbotic (Ondo Tokenized) | SYMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 36.6385 | 9 | `not covered` | n/a | 7 |
| `NrTdGMA3ujUvWXkwXyZKnhoByb32KTjRh5Vo47yondo` | Gemini Space Station (Ondo Tokenized) | GEMIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 20.7751 | 9 | `not covered` | n/a | 7 |
| `nTUjRdtzGCy8FXHK8w1n11pHABX6Dc7L7WSpzdBondo` | Innodata (Ondo Tokenized) | INODon | _none set_ | n/a — no hook program set | n/a | `not covered` | 11.0560 | 9 | `not covered` | n/a | 7 |
| `nvvoP8gFyY2aZp6Cxu9Qq4MQqGrMebjtCxWrYfbondo` | Amkor Technology (Ondo Tokenized) | AMKRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 17.9755 | 9 | `not covered` | n/a | 7 |
| `P7hTXnKk2d2DyqWnefp5BSroE1qjjKpKxg9SxQqondo` | abrdn Physical Palladium Shares ETF (Ondo Tokenized) | PALLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 35.0318 | 9 | `not covered` | n/a | 7 |
| `qCYD74QnXzd9pzv6pGHQKJVwoibL6sNcPQDnpDiondo` | Exxon Mobil (Ondo Tokenized) | XOMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 39.5312 | 9 | `not covered` | n/a | 7 |
| `rsiKbHCdsvmExvDfkYWypAXFsqKz6V8XuoxbkHtondo` | Hyperliquid Strategies (Ondo Tokenized) | PURRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 74.0700 | 9 | `not covered` | n/a | 7 |
| `RTb54gpqAx6RpLAHRGnqQ3ciQ845CHqhg21ZzEJondo` | Talen Energy (Ondo Tokenized) | TLNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 10.2291 | 9 | `not covered` | n/a | 7 |
| `SKHYhSjuRWHgikq8eRKbtBbpABgJSkd7ytQV14i9EQ3` | SK Hynix - Backpack Securities | SKHY | _none set_ | n/a — no hook program set | n/a | `not covered` | 24,793.8691 | 6 | `not covered` | n/a | 8 |
| `soLM6jRVdG1PdurSAQDz5qRtwWxXPM6EBvwrkBjondo` | Global X Robotics & Artificial Intelligence ETF (Ondo Tokenized) | BOTZon | _none set_ | n/a — no hook program set | n/a | `not covered` | 30.6080 | 9 | `not covered` | n/a | 7 |
| `SPCXxcqXj6e5dJDVNovHN8744zkbhM2bYudU45BimGb` | SpaceX - Backpack Securities | SPCX | _none set_ | n/a — no hook program set | n/a | `not covered` | 66,864.3404 | 6 | `not covered` | n/a | 8 |
| `stJUPZMmAWA1PNVPXCvqVK6MHABr4yFo5rv2JTethCa` | Staked JUP | stJUP | `wJUPXh…bidNGv` | **YES — mutable** | `De3YSj45A3mGo9pp8CSyMooG6o4SaneZ3ms4ngbk2FCU` | 385923063 | 64,061.0328 | 6 | `not covered` | yes (1) | 3 |
| `t71FyTYHVkPAb5g48adDHmkVxXYbUuP2eq6jDZLondo` | iShares AAA CLO Active ETF (Ondo Tokenized) | CLOAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 16.9740 | 9 | `not covered` | n/a | 7 |
| `td1aY5AvYQuwGD75qNq9aPipMexraN9mQXJwqifondo` | Invesco DB Commodity Index Tracking Fund (Ondo Tokenized) | DBCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 73.4961 | 9 | `not covered` | n/a | 7 |
| `v12TwfofSbvVqQ5N5KGG4d3J8rtEi4BjGfn2apyondo` | Li Auto (Ondo Tokenized) | LIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 64.8532 | 9 | `not covered` | n/a | 7 |
| `vZVGEJfSM1hS4XdFVAZL2Fr1cbPzJty9vWyax68ondo` | Strive Preferred (Ondo Tokenized) | SATAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 31.0683 | 9 | `not covered` | n/a | 7 |
| `wFJoeEYpKg9oRhyJy6BWTT3J95gmXBLvoeikDQNondo` | Lam Research (Ondo Tokenized) | LRCXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 11.2532 | 9 | `not covered` | n/a | 7 |
| `Wk8gC6iTNp8dqd4ghkJ3h1giiUnyhykwHh7tYWjondo` | Bank of America (Ondo Tokenized) | BACon | _none set_ | n/a — no hook program set | n/a | `not covered` | 26.9094 | 9 | `not covered` | n/a | 7 |
| `YQzNQh2YSFQ6nh91E8Ja71U6JuZDLap5jJCsELGondo` | Corning (Ondo Tokenized) | GLWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 17.6094 | 9 | `not covered` | n/a | 7 |
| `ZmHxc6Gt27RJKxD2ay6UL4n9yQ7mKAq4XZQUeVhondo` | Figure Technology Solutions (Ondo Tokenized) | FIGRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 30.1407 | 9 | `not covered` | n/a | 7 |
| `ZtAY65FCh3YB9H1wkbjRxxY5nXt9VfuTTz3Mzbuondo` | Cloudflare (Ondo Tokenized) | NETon | _none set_ | n/a — no hook program set | n/a | `not covered` | 29.5587 | 9 | `not covered` | n/a | 7 |
| `13qTjKx53y6LKGGStiKeieGbnVx3fx1bbwopKFb3ondo` | iShares Core US Aggregate Bond ETF (Ondo Tokenized) | AGGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 5.4863 | 9 | `not covered` | n/a | 7 |
| `13qtwy5fZi9Przz14pzo9xqFSr8QHmLyUpUCvP1xondo` | ON Semiconductor (Ondo Tokenized) | ONon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.7810 | 9 | `not covered` | n/a | 7 |
| `149o8ppQf9SzKCKXZ4v3dzHkwumvtQSRzSEkr29uondo` | KLA (Ondo Tokenized) | KLACon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.9126 | 9 | `not covered` | n/a | 7 |
| `14kLsQVmc64qZexYuR4XGop9y8BeMkd77pJUm1Rhondo` | Bilibili (Ondo Tokenized) | BILIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.4363 | 9 | `not covered` | n/a | 7 |
| `14Z8rQQe2Aza33YgEUmj3g3QGNz8DXLiFPuCnsD1ondo` | AppLovin (Ondo Tokenized) | APPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.1756 | 9 | `not covered` | n/a | 7 |
| `1WxT6NdK7uqpfXuKpALxL2n3f7Rq61XXeHA8UM4ondo` | American Express (Ondo Tokenized) | AXPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.2860 | 9 | `not covered` | n/a | 7 |
| `1YVZ4LGpq8CAhpdpm3mgy7GgPb83gJczCpxLUQ3ondo` | Boeing (Ondo Tokenized) | BAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.6832 | 9 | `not covered` | n/a | 7 |
| `5owVsVFSHACQuippFYdLp3qWRobp2EGcwxMmsr6ondo` | Chipotle (Ondo Tokenized) | CMGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 7.3320 | 9 | `not covered` | n/a | 7 |
| `6btaz134wjHkR8sqhAYrtSM6tavftfxnRvnyMd8ondo` | Costco (Ondo Tokenized) | COSTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.4731 | 9 | `not covered` | n/a | 7 |
| `7eRX747PSbVtGVx3qD5UFdkNM2BfTy86ikUiCMhondo` | Applied Materials (Ondo Tokenized) | AMATon | _none set_ | n/a — no hook program set | n/a | `not covered` | 8.0578 | 9 | `not covered` | n/a | 7 |
| `AErxJJxGbc9cZzZoZepN62BNfg5RXns8tmEc3Zpondo` | Caterpillar (Ondo Tokenized) | CATon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.0008 | 9 | `not covered` | n/a | 7 |
| `aheEdmuryJU8ymy8LjYheZH5i2BW1UMsfuWQKD2ondo` | Equinix (Ondo Tokenized) | EQIXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.6476 | 9 | `not covered` | n/a | 7 |
| `aHFrgfBHMGEScG8j64cN324jeoQ4EVXLmiHxtuPondo` | Onto Innovation (Ondo Tokenized) | ONTOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.0871 | 9 | `not covered` | n/a | 7 |
| `ahvtJqt6pkzjnYTMaCKrvjPQszSKyWraiXKvuWKondo` | Teradyne (Ondo Tokenized) | TERon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.1585 | 9 | `not covered` | n/a | 7 |
| `aKzjn2ZdWySSGPSSDTY2HUpcSCmemSahTXihrpyondo` | Southern (Ondo Tokenized) | SOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 6.2801 | 9 | `not covered` | n/a | 7 |
| `B5KufqHkskgGYwMXtL8FSHgREAkMQvE3ykhH5Kmondo` | Albemarle (Ondo Tokenized) | ALBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.9905 | 9 | `not covered` | n/a | 7 |
| `b98FynyBEkdhP4Y3QUvKG36nms4oMsxEZUrCBMvondo` | Alpha and Omega Semiconductor (Ondo Tokenized) | AOSLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 8.0110 | 9 | `not covered` | n/a | 7 |
| `BAU83kqEqhyiexfAMQhZZE5KnGogSqh17fJc44Sondo` | US Brent Oil Fund (Ondo Tokenized) | BNOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 8.9479 | 9 | `not covered` | n/a | 7 |
| `bM2VSRfbYPt29YRD9F2wTCSCSQaHtNCuz1znNDCondo` | STMicroelectronics (Ondo Tokenized) | STMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.1618 | 9 | `not covered` | n/a | 7 |
| `cFDP5SsUBeKrV1RkKHdaofHBSfRW8cBd7DiaPTSLAon` | Dell Technologies (Ondo Tokenized) | DELLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.1214 | 9 | `not covered` | n/a | 7 |
| `cfxyRHXjqoKN6hF3oEGu1bpEEFGcEiVXoNG4UUCondo` | Fabrinet (Ondo Tokenized) | FNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.9969 | 9 | `not covered` | n/a | 7 |
| `CqQyAZjB9LGFTG95eiadGTkfhd9QA12ProeKsQmondo` | Deere (Ondo Tokenized) | DEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.2037 | 9 | `not covered` | n/a | 7 |
| `cRx9VtwwPTZbVk1DjbMyKzrMWn7nJA22UpMyzFYondo` | Tower Semiconductor (Ondo Tokenized) | TSEMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.8358 | 9 | `not covered` | n/a | 7 |
| `CsN1Tyz467bSFLPGd6MJyZhPNtwDaWZtX8ixHWyondo` | PIMCO 0-5 Year High Yield Corporate Bond Index ETF (Ondo Tokenized) | HYSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.0723 | 9 | `not covered` | n/a | 7 |
| `cY3kDrNWP6DUZcWSQmA6Y4Nf7q5qS5kZ8zF9iLnondo` | Ciena (Ondo Tokenized) | CIENon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.2771 | 9 | `not covered` | n/a | 7 |
| `CZ3FxxSto7tsjkSkqMek1C5p3RCFFmkwKqW57nbondo` | Franklin High Yield Corporate ETF (Ondo Tokenized) | FLHYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.0894 | 9 | `not covered` | n/a | 7 |
| `D4uWxzR5StYC6sTRhVts8Eboy3pmVtHeNC62dnQondo` | iShares 7-10 Year Treasury Bond ETF (Ondo Tokenized) | IEFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.3281 | 9 | `not covered` | n/a | 7 |
| `D8KT4Jd8qiKKTfkM8ejSKCpWGR1o3GFvnQGp5ERondo` | Franklin Income Equity Focus ETF (Ondo Tokenized) | INCEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 7.5144 | 9 | `not covered` | n/a | 7 |
| `dAc8yWUrVra9v2PGsn3LT18oybsM62ysQ4ikWcpondo` | MACOM Technology Solutions Holdings (Ondo Tokenized) | MTSIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.3886 | 9 | `not covered` | n/a | 7 |
| `Dig28Tf1ufhCBAsjTmFkXCgcNgMqDMYj5A2rDQmondo` | Newmont (Ondo Tokenized) | NEMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.9148 | 9 | `not covered` | n/a | 7 |
| `doPqjCxi6UkANkvMz5fSuYGEo5PGppVpTZMeB5vondo` | Kanzhun (Ondo Tokenized) | BZon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.0977 | 9 | `not covered` | n/a | 7 |
| `dSHPFuMMjZqt7xDYGWrexXTSkdEZAiZngqymQF2ondo` | iShares Russell 1000 Growth ETF (Ondo Tokenized) | IWFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.3065 | 9 | `not covered` | n/a | 7 |
| `DsLQ18ooPjiHYuiuQ5Jz8PNCpVaKe3FhAYpvMxWondo` | Global X US Infrastructure Development ETF (Ondo Tokenized) | PAVEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 8.7991 | 9 | `not covered` | n/a | 7 |
| `dvj2kKFSyjpnyYSYppgFdAEVfgjMEoQGi9VaV23ondo` | iShares Russell 2000 ETF (Ondo Tokenized) | IWMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.8189 | 9 | `not covered` | n/a | 7 |
| `DwRtkbsaQMGAS3oMeEGYh6M5vH4X9WECsQgqHjAondo` | abrdn Physical Platinum Shares ETF (Ondo Tokenized) | PPLTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.3339 | 9 | `not covered` | n/a | 7 |
| `dYDS22uTX8CtiyixnXY9fMVGAkxbemVAjbCaWVbondo` | FuelCell Energy (Ondo Tokenized) | FCELon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.5869 | 9 | `not covered` | n/a | 7 |
| `dYF78b65HS62V3pku2uYFyektYzAhx9YACv4hWfondo` | Vishay Precision Group (Ondo Tokenized) | VPGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 7.9468 | 9 | `not covered` | n/a | 7 |
| `e83tWWrVsVk1hRGNz5BCwNr9TMBNWixmoUhWgYcondo` | Rockwell Automation (Ondo Tokenized) | ROKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.8776 | 9 | `not covered` | n/a | 7 |
| `EAwP9LGNjTkQ2YeKE6CGKqBYtrJ6APFvRe7KCMmondo` | SolarEdge Technologies (Ondo Tokenized) | SEDGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 9.3302 | 9 | `not covered` | n/a | 7 |
| `Es2ipHL7qXBcLmZ4N7LP9PHBHaWaTMTAkxDwGGjondo` | US Natural Gas Fund (Ondo Tokenized) | UNGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.2086 | 9 | `not covered` | n/a | 7 |
| `EUbJjmDt8JA222M91bVLZs211siZ2jzbFArH9N3ondo` | McDonald's (Ondo Tokenized) | MCDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 6.9015 | 9 | `not covered` | n/a | 7 |
| `EXtprP1wzrNo2bByrU9JyzqEg2hQMSCVJakeHHYondo` | Seagate (Ondo Tokenized) | STXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.3175 | 9 | `not covered` | n/a | 7 |
| `f1yQz2fo7S24NqrsfaWDkmQ8xoa8yU72c9rEEBdondo` | Quanta Services (Ondo Tokenized) | PWRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.8859 | 9 | `not covered` | n/a | 7 |
| `F3dMJ9H137YUNc9cpN3gBWDSq4MSRbTFtojH65Uondo` | Vanguard Real Estate ETF (Ondo Tokenized) | VNQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.7600 | 9 | `not covered` | n/a | 7 |
| `f9nfUo4SdhCGfHmm81m3ArgDsatwo2jLjEcgCcYondo` | Vicor (Ondo Tokenized) | VICRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.6652 | 9 | `not covered` | n/a | 7 |
| `fTuoE9pWbVK7EUpUEENBn8Vu226T7kF3YJBTRLPondo` | Cleveland-Cliffs (Ondo Tokenized) | CLFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.3768 | 9 | `not covered` | n/a | 7 |
| `GZ8v4NdSG7CTRZqHMgNsTPRULeVi8CpdWd9wZY8ondo` | Procter & Gamble (Ondo Tokenized) | PGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.8574 | 9 | `not covered` | n/a | 7 |
| `hieZTEZNBU67bMGULK9hWCB9h5jBPKdpRWiXpwkondo` | Sprott Uranium Miners ETF (Ondo Tokenized) | URNMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.0522 | 9 | `not covered` | n/a | 7 |
| `HooDYv5RewLRiMLnEVq3VJqdqxhuE6c5eYvqejMC3e9A` | Robinhood Markets - Backpack Securities | HOOD | _none set_ | n/a — no hook program set | n/a | `not covered` | 5,981.2939 | 6 | `not covered` | n/a | 8 |
| `hpkpc1Xenv5oEpVefk3woWjZa9rxaJxaEaVVA4Fondo` | US Copper Index Fund (Ondo Tokenized) | CPERon | _none set_ | n/a — no hook program set | n/a | `not covered` | 8.8268 | 9 | `not covered` | n/a | 7 |
| `iNTCy1qTsUEZQe3DSocLz1ZXXai34Gdw8THQh5rxFaF` | Intel - Backpack Securities | INTC | _none set_ | n/a — no hook program set | n/a | `not covered` | 5,156.3979 | 6 | `not covered` | n/a | 8 |
| `io3eLhnjT1a94JpzAUMWKqwMYHZRwvtGXjkkXsPondo` | Invesco PHLX Semiconductor ETF (Ondo Tokenized) | SOXQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.0052 | 9 | `not covered` | n/a | 7 |
| `ivdDracs2s7jCP698dJXKSEQdVrNj9hasJL1Uq1ondo` | Shopify (Ondo Tokenized) | SHOPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 4.0017 | 9 | `not covered` | n/a | 7 |
| `k6BPp2Xmf2TYgrZiUyWfUoZBKeqaDbvPoAVgSx2ondo` | iShares TIPS Bond ETF (Ondo Tokenized) | TIPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.5984 | 9 | `not covered` | n/a | 7 |
| `KaSLSWByKy6b9FrCYXPEJoHmLpuFZtTCJk1F1Z9ondo` | iShares 20+ Year Treasury Bond ETF (Ondo Tokenized) | TLTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 9.3382 | 9 | `not covered` | n/a | 7 |
| `kSbeWEe64qpoVb1ZSVxgRnekZ1PwGNJkLyL5gJWondo` | Keel Infrastructure (Ondo Tokenized) | KEELon | _none set_ | n/a — no hook program set | n/a | `not covered` | 5.9371 | 9 | `not covered` | n/a | 7 |
| `KZtqx9BJbpcGY7vdzhqPXM3ECKChxE5YhXaDiwRondo` | Janus Henderson AAA CLO ETF (Ondo Tokenized) | JAAAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.5552 | 9 | `not covered` | n/a | 7 |
| `MFerpBVGKZh2jXN7cbJdXRXQTp6j6pbSnSZrfWrondo` | AbbVie (Ondo Tokenized) | ABBVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 8.9917 | 9 | `not covered` | n/a | 7 |
| `mJf1xT3suXtkXBCfZcE9oUUuyxkvSgqYBWiX7v1ondo` | Disney (Ondo Tokenized) | DISon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.2382 | 9 | `not covered` | n/a | 7 |
| `mmy8WbFRNrjoDsPGqpYmzQAVu7PfGhMCdSRLxZLondo` | Nordic American Tankers (Ondo Tokenized) | NATon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.6797 | 9 | `not covered` | n/a | 7 |
| `MSTRdWXMeZxdE8osAQy3fA4rvTY5rgummDSMEx6U7Nz` | Strategy - Backpack Securities | MSTR | _none set_ | n/a — no hook program set | n/a | `not covered` | 4,527.3186 | 6 | `not covered` | n/a | 8 |
| `MUxEsUKSMACyw5fZf68wxf5FLnZVhtU9CwH8uNNGay1` | Micron Technology - Backpack Securities | MU | _none set_ | n/a — no hook program set | n/a | `not covered` | 7,673.3636 | 6 | `not covered` | n/a | 8 |
| `nQysX1ZsRJ8yTJg8smZTZ91rWcVBabDRqdUEKZHondo` | TaskUs (Ondo Tokenized) | TASKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.2340 | 9 | `not covered` | n/a | 7 |
| `nupQ2BuCfoVeCHVLRDhTjLJanaf5cxZ81KVFqs6ondo` | Nova (Ondo Tokenized) | NVMIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.4267 | 9 | `not covered` | n/a | 7 |
| `o6U1Sm6Vd7EofMyCrL28mrp2QLzgYGgjveHiEQ5ondo` | WisdomTree Floating Rate Treasury Fund (Ondo Tokenized) | USFRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.4001 | 9 | `not covered` | n/a | 7 |
| `ou1uE526v7zmUYP2qCb2LJgfXAyWAtWS9SETtr8ondo` | Opendoor Technologies (Ondo Tokenized) | OPENon | _none set_ | n/a — no hook program set | n/a | `not covered` | 5.6234 | 9 | `not covered` | n/a | 7 |
| `qKtU9A7ij34XmtxaSzYfxCpkgAZzzFsqnUb2kW2ondo` | ProShares Short QQQ (Ondo Tokenized) | PSQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 7.5524 | 9 | `not covered` | n/a | 7 |
| `R2uDbMtmHq5xSS5SserrovdRKdpiqnVBCd2AHLhondo` | Capital One (Ondo Tokenized) | COFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.2404 | 9 | `not covered` | n/a | 7 |
| `R3ywbVQ5t8LNmjQsn2Ngv43dSqyZscQwNag9G3Eondo` | MasTec (Ondo Tokenized) | MTZon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.1555 | 9 | `not covered` | n/a | 7 |
| `SNDKbwMUQvZhnLnxLduradgLHG5KrPuKwpnrkkGRhfH` | Sandisk - Backpack Securities | SNDK | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,424.9641 | 6 | `not covered` | n/a | 8 |
| `SS6AEWhzRrxhL2cXzKKjhFt3rCzmHHGKmFyugDTondo` | Amgen (Ondo Tokenized) | AMGNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.2600 | 9 | `not covered` | n/a | 7 |
| `TTWofwAge91oFhZs7kpQdyrVRkmevgM88xijGvQFbKo` | Take-Two Interactive Software - Backpack Securities | TTWO | _none set_ | n/a — no hook program set | n/a | `not covered` | 1,175.7175 | 6 | `not covered` | n/a | 8 |
| `V8LRV7kWjrx6Prke9oHEHNUiR122BVtyuPciTCTondo` | Sprott Nickel Miners ETF (Ondo Tokenized) | NIKLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 5.4058 | 9 | `not covered` | n/a | 7 |
| `YeK2TdPtGLAme3Phg4pb1GBN2YxKgX5UNVyD4asondo` | NetEase (Ondo Tokenized) | NTESon | _none set_ | n/a — no hook program set | n/a | `not covered` | 1.1931 | 9 | `not covered` | n/a | 7 |
| `YrquZHx3f6sXsnZZAQiVsyQfvHwLmn2XTkDiZ1uondo` | Lumentum Holdings (Ondo Tokenized) | LITEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 3.5529 | 9 | `not covered` | n/a | 7 |
| `Z8aFb6uQJgwFJ4KYKrT8n53aP66xqihodfAu4AKondo` | nLIGHT (Ondo Tokenized) | LASRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 6.0078 | 9 | `not covered` | n/a | 7 |
| `ZcS6FuJ1nAjgwJejUsxkasM6JpEDkdowVyohBCzondo` | Camtek (Ondo Tokenized) | CAMTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 6.9898 | 9 | `not covered` | n/a | 7 |
| `ZDnkXeN5awDioQjP691XFLdgZwDAv19g3fCr9KWondo` | FormFactor (Ondo Tokenized) | FORMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.2674 | 9 | `not covered` | n/a | 7 |
| `ZpJpMhWKCr4m9ZzxApJJwDc5cHiHp2hG1RZdJyvondo` | Worthington Steel (Ondo Tokenized) | WSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 2.8584 | 9 | `not covered` | n/a | 7 |
| `129gRoHKhVg7CvPMrqVsEB4uYZo6zV4yDZX6NBg9ondo` | Abbott (Ondo Tokenized) | ABTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.5870 | 9 | `not covered` | n/a | 7 |
| `12LxMMJYVSf4LoeqjFE47BQQNRciaH9E3nbDfjH4ondo` | Accenture (Ondo Tokenized) | ACNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1789 | 9 | `not covered` | n/a | 7 |
| `5GgRAEmv8ZxF2PR5hY72Qs5x1bnQ6UK2RbTPoqJ3wSwW` | PAX Gold | PAXG | _none set_ | n/a — no hook program set | n/a | `not covered` | 298.5793 | 6 | `not covered` | n/a | 8 |
| `5H1VpMzRuoNtRbPTRCz35ETtEUtnkt8hJuQb9v7ondo` | Blackrock, Inc. (Ondo Tokenized) | BLKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.4170 | 9 | `not covered` | n/a | 7 |
| `83P1gCFBZfGRCwJuBt9juxJKEsZwejJoG66eTZ6ondo` | DoorDash (Ondo Tokenized) | DASHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.7758 | 9 | `not covered` | n/a | 7 |
| `aCx5G8ewGTSzozEn8KmSsr9cvfyFWzGnr22GjFXondo` | Himax Technologies (Ondo Tokenized) | HIMXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1749 | 9 | `not covered` | n/a | 7 |
| `aGn43ed4kjATwbVqsAuwAT24XcG9xABCcyQsFpqondo` | MaxLinear (Ondo Tokenized) | MXLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.4204 | 9 | `not covered` | n/a | 7 |
| `BchJRy2snmhJZf3rQ9LJ3ePs2BGfYgfvQNo31d2ondo` | Goldman Sachs (Ondo Tokenized) | GSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.3661 | 9 | `not covered` | n/a | 7 |
| `bjbrNi96mXAzgvxSuGJ2SRJ5U4N8agbG7wUAKAjondo` | SAP (Ondo Tokenized) | SAPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1333 | 9 | `not covered` | n/a | 7 |
| `BmXVAFyfpW7VuVYeWDtbFtLx7sek2mZt3BEsGgAondo` | iShares MSCI Chile ETF (Ondo Tokenized) | ECHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.7414 | 9 | `not covered` | n/a | 7 |
| `bvjmEwQBqbMr6rnx5a74boBz6nmA1DNThujPnNAondo` | Williams (Ondo Tokenized) | WMBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.5167 | 9 | `not covered` | n/a | 7 |
| `bWrYATfytuRwGoDbpxy16aQbMbCZDv8DURuLCAhondo` | EQT (Ondo Tokenized) | EQTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1063 | 9 | `not covered` | n/a | 7 |
| `cfPLN9WXD2BTkbZhRZMVXPmVSiRo44hJWRtnaC8ondo` | iShares Core S&P MidCap ETF (Ondo Tokenized) | IJHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.5209 | 9 | `not covered` | n/a | 7 |
| `CPWkMURVvcnX8hGjqCTb8i5LkzV3VSvyk7SeJi8ondo` | iShares Core S&P Total US Stock Market ETF (Ondo Tokenized) | ITOTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1601 | 9 | `not covered` | n/a | 7 |
| `E1aUS5nyv7kaBzdQzPVJW5zfaMgoUJpKYzdnFS2ondo` | JD.com (Ondo Tokenized) | JDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.8484 | 9 | `not covered` | n/a | 7 |
| `EEy57xbaLcUrN1HXj2vz8VWxeWFK1eZQZo4aWbrondo` | iShares 1-3 Year Treasury Bond ETF (Ondo Tokenized) | SHYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.5373 | 9 | `not covered` | n/a | 7 |
| `esgtAV7yKf7Ei3Q92VmXcEGkoqY2UqCHzZvCWhgondo` | Fundrise Innovation Fund (Ondo Tokenized) | VCXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.3154 | 9 | `not covered` | n/a | 7 |
| `EvsME8gdnEwPLbTnhrGVDwrY35zBuB8hEGCq59Hondo` | Union Pacific Corporation (Ondo Tokenized) | UNPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.4425 | 9 | `not covered` | n/a | 7 |
| `f4ucqqnktrkdDAnwqcAAiA9Lggz6NAHJ3zFwipnondo` | Core Scientific (Ondo Tokenized) | CORZon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.8420 | 9 | `not covered` | n/a | 7 |
| `f7iz4BQsnjw95EUyFiBKAnKgo7oBrycfzQdtmDwondo` | Hut 8 (Ondo Tokenized) | HUTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1470 | 9 | `not covered` | n/a | 7 |
| `FGmUDXqA3AbWfo5b3NUcsvwoUFCF4tr9ea6uercondo` | Carvana (Ondo Tokenized) | CVNAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.2590 | 9 | `not covered` | n/a | 7 |
| `FL7QzUq58pvkDxkftJm7RqRWgqYEFZwXuvAMsUnondo` | Vertex Pharmaceuticals (Ondo Tokenized) | VRTXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.2160 | 9 | `not covered` | n/a | 7 |
| `FRAGB4KZGLMy3wH1nBajP3Q17MHnecEvTPT6wb4pX5MB` | Fragmetric Staked BTC | fragBTC | `fragnA…iK3iF3` | **YES — mutable** | `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj` | 391854457 | 9.8170 | 8 | `not covered` | yes (8) | 3 |
| `Gc1aT3ay7FXL3qdAW7cNSXYPDsGavy7qiACuxwxondo` | Grindr (Ondo Tokenized) | GRNDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1976 | 9 | `not covered` | n/a | 7 |
| `jmnrdSzu293vKTWyEx3A2ZRVxxytJKW1wD3CLzkondo` | Arteris (Ondo Tokenized) | AIPon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.3301 | 9 | `not covered` | n/a | 7 |
| `js1cCZRNx8ircYiQJuhBNMnsA9owr6ZLYx6z2uNondo` | Extreme Networks (Ondo Tokenized) | EXTRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.3949 | 9 | `not covered` | n/a | 7 |
| `kBUAHgGHFthfnwarWxqYxHqVDnqqieJkXb6kvroondo` | Bitdeer Technologies (Ondo Tokenized) | BTDRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.9570 | 9 | `not covered` | n/a | 7 |
| `KuiYLPVq65qixD9TgvxBC576C4gG6vVTCdbh2zFondo` | Vanguard Value ETF (Ondo Tokenized) | VTVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.6975 | 9 | `not covered` | n/a | 7 |
| `M6agiXbNgy8Xon9ngiW4ZDPbMFcNCTMkMMkshZyondo` | Invesco Optimum Yld Dvsfd Cmd Str No K-1 ETF (Ondo Tokenized) | PDBCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.3837 | 9 | `not covered` | n/a | 7 |
| `MtEXKVN3Pcggy8MPA3eJr15H6SK3RXheScqj9qtondo` | Home Depot (Ondo Tokenized) | HDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.2347 | 9 | `not covered` | n/a | 7 |
| `nagL8iWMNLZVuKFk3bUGDaHyT5ZY4bNfUzsdtGHondo` | Hesai Group (Ondo Tokenized) | HSAIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.3407 | 9 | `not covered` | n/a | 7 |
| `ndHvUEgrvZquSR6wZv2cG1AiBr7e7HGuWvfPULcondo` | REalloys (Ondo Tokenized) | ALOYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.9734 | 9 | `not covered` | n/a | 7 |
| `nwPWRVFCbU3cdXWdJsuwomC5u459xPFdP2vYsmVondo` | AAON (Ondo Tokenized) | AAONon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.2162 | 9 | `not covered` | n/a | 7 |
| `pDY4GPJfZcNETPG7myXeafQfgJqqVkn81bMYDyfondo` | T-Mobile US (Ondo Tokenized) | TMUSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1423 | 9 | `not covered` | n/a | 7 |
| `PjtfUiw6Hwd8PZ94EcUw8mBSYxp7SjjzSLeNTDKondo` | Citigroup (Ondo Tokenized) | Con | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.2111 | 9 | `not covered` | n/a | 7 |
| `UP5s1srLaHDc4SwJqLPa3A48x5R7ofN3hZWxWEZondo` | PG&E (Ondo Tokenized) | PCGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1113 | 9 | `not covered` | n/a | 7 |
| `uwh6Z6c2F8WZfUSK1A8VBfA9AwJKN5T2bvQwVFLondo` | Global X Artificial Intelligence & Technology ETF (Ondo Tokenized) | AIQon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.3108 | 9 | `not covered` | n/a | 7 |
| `uzQx2MnWr7drR5gdNXssJrFKQkLFSdw4EpfaQ5Nondo` | iShares MSCI EAFE Value ETF (Ondo Tokenized) | EFVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.1220 | 9 | `not covered` | n/a | 7 |
| `v34vtrbcjDswpFDixpVFThmUWeM1RTZwtWcp5FBondo` | iShares S&P Small-Cap 600 Value ETF (Ondo Tokenized) | IJSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.9976 | 9 | `not covered` | n/a | 7 |
| `wtwpt5yJbButAhjpYhtg4uvUgCQN4LVgvLq2AxEondo` | SPDR Bloomberg 1-3 Month T-Bill ETF (Ondo Tokenized) | BILon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.9953 | 9 | `not covered` | n/a | 7 |
| `ZjYCwYeG85TbV5oXkCkvWQTNPh2PgTQ8X4nxpbyondo` | TE Connectivity (Ondo Tokenized) | TELon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.4809 | 9 | `not covered` | n/a | 7 |
| `ZWUSgDGQTQPGJyipzgJKcPhxgZzSBi4q6dqQbgCondo` | Aehr Test Systems (Ondo Tokenized) | AEHRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.2205 | 9 | `not covered` | n/a | 7 |
| `auLvQAhUzPuy2SQBSq2T6AofPGNkR4nZ83P8pjuondo` | MYR Group (Ondo Tokenized) | MYRGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0136 | 9 | `not covered` | n/a | 7 |
| `c5ug15fwZRfQhhVa6LHscFY33ebVDHcVCezYpj7ondo` | iBoxx $ High Yield Corporate Bond ETF (Ondo Tokenized) | HYGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0511 | 9 | `not covered` | n/a | 7 |
| `CgnZbDNzBfaLyJqUtd4esKLShRp7RznQuwP4uQaondo` | abrdn Physical Precious Metals Basket Shares ETF (Ondo Tokenized) | GLTRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0229 | 9 | `not covered` | n/a | 7 |
| `cnc6M1zXLdrGR5LAQVcaJDfgezMiVWNtGQsVy1Kondo` | Charles Schwab (Ondo Tokenized) | SCHWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0816 | 9 | `not covered` | n/a | 7 |
| `DnvbCqRuUYssmKVRBRNwkUnptHitH4ZZTt1KVuZondo` | VanEck Oil Services ETF (Ondo Tokenized) | OIHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0372 | 9 | `not covered` | n/a | 7 |
| `Edik9MoFp8LAXS9HNu2gRFyihwYqDqv4ZmNmVT9ondo` | Linde plc (Ondo Tokenized) | LINon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0226 | 9 | `not covered` | n/a | 7 |
| `edLdFJVVR532qhcrNTJjLAmhmyV7NsctbWVokMBondo` | Lowe's (Ondo Tokenized) | LOWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0121 | 9 | `not covered` | n/a | 7 |
| `F3V1fKLKv7H8aNdt9TC6GQ3X4LayEfGHsPi8Umaondo` | VinFast Auto (Ondo Tokenized) | VFSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0510 | 9 | `not covered` | n/a | 7 |
| `gfTDvjLp8K5gNDFaLMvoTZWJJY6PmVQfdPaUU7eondo` | Oceaneering International (Ondo Tokenized) | OIIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0945 | 9 | `not covered` | n/a | 7 |
| `go6DXMdM5zHTC9G16BwAYA8rKwGRhy9M5uudNdBondo` | Iridium Communications (Ondo Tokenized) | IRDMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0957 | 9 | `not covered` | n/a | 7 |
| `i7ZS13SF6BCKbzvLujp2UqLNMgM1XVnZ7A7wC6tondo` | SLB (Ondo Tokenized) | SLBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0986 | 9 | `not covered` | n/a | 7 |
| `ja4bMvHL3Hw9Ey33VGWyDeXvrHvQWyBnK4GSmCUondo` | VeriSign (Ondo Tokenized) | VRSNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0187 | 9 | `not covered` | n/a | 7 |
| `jYcn4hHgyq1fS46YgecQY9N1gLU3sAxKA3DZVAPondo` | Keysight Technologies (Ondo Tokenized) | KEYSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0146 | 9 | `not covered` | n/a | 7 |
| `jzCvs2Pk8tDcfsFRqnEMjurgaQW4iQfEkandUR8ondo` | Spotify (Ondo Tokenized) | SPOTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0233 | 9 | `not covered` | n/a | 7 |
| `kcc5QzXDCQ61qQ5Nbpi2RppnRSzhG1XQNXkjXwoondo` | Primoris Services (Ondo Tokenized) | PRIMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0259 | 9 | `not covered` | n/a | 7 |
| `ko48myqhBuXyL9WAp6pTzHWsdKsGKSditJVoGTSondo` | AMETEK (Ondo Tokenized) | AMEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0377 | 9 | `not covered` | n/a | 7 |
| `kWmjV2XdK5tbV6kZrM8grS6EGFmuH5i5HFW3YyLondo` | TTM Technologies (Ondo Tokenized) | TTMIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0164 | 9 | `not covered` | n/a | 7 |
| `LmTMwmZLNZszn3qpjmnbhfP12U4qWDivaEBwSBSondo` | Analog Devices (Ondo Tokenized) | ADIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0187 | 9 | `not covered` | n/a | 7 |
| `m7mWfvhyPikY3esNwTk8U1JRbcBijmzHgqiqx3xondo` | Breakwave Tanker Shipping ETF (Ondo Tokenized) | BWETon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0939 | 9 | `not covered` | n/a | 7 |
| `micfqeFfvD9iDKKzuqRHXerFxG8K5VfY8CgrcQoondo` | Tsakos Energy Navigation (Ondo Tokenized) | TENon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0637 | 9 | `not covered` | n/a | 7 |
| `mnYetf4bWKX8HihNk1XLNYj8BPPy9PdkDFPV97Zondo` | Okeanis Eco Tankers (Ondo Tokenized) | ECOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0857 | 9 | `not covered` | n/a | 7 |
| `mPAqB3y5N7fWmEh1BoVtrLhZKBkQe7LjBCrYUNbondo` | Teekay Tankers (Ondo Tokenized) | TNKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0323 | 9 | `not covered` | n/a | 7 |
| `mrNSd1y72F7Dx2Uip4vidtsJKKd8iJatTKGX6Pvondo` | Westlake (Ondo Tokenized) | WLKon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0326 | 9 | `not covered` | n/a | 7 |
| `mvAUPvwKPW4rbbTXkqCvcZEG45XCeRHSVcLVym8ondo` | Nucor (Ondo Tokenized) | NUEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0112 | 9 | `not covered` | n/a | 7 |
| `nDetEKBEk9chztCXSYNrU5F63s2RCEQCxT7BhxDondo` | Lattice Semiconductor (Ondo Tokenized) | LSCCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0184 | 9 | `not covered` | n/a | 7 |
| `nkbH2doD7nU4CkKVwzmd6UV4d2AaGy24NHzsh6tondo` | ACM Research (Ondo Tokenized) | ACMRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0632 | 9 | `not covered` | n/a | 7 |
| `rki25TZmDh94spjeoyyGWjkVEYSzcVvaAbddXGuondo` | Global X MSCI Argentina ETF (Ondo Tokenized) | ARGTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0497 | 9 | `not covered` | n/a | 7 |
| `sxyg1VTSzy5zYANUK7hntNtmFAWoXGJq95AcHuVondo` | Pinterest (Ondo Tokenized) | PINSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0625 | 9 | `not covered` | n/a | 7 |
| `syb82jXkHWbcWgxoRqrvAcoCdsAb3y1fnCYo561ondo` | Global X Lithium & Battery Tech ETF (Ondo Tokenized) | LITon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0936 | 9 | `not covered` | n/a | 7 |
| `T699bgtXQw4CJ59rQ4VzLsupVQUzoL5RmuhHnKrondo` | Thermo Fisher Scientific (Ondo Tokenized) | TMOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0125 | 9 | `not covered` | n/a | 7 |
| `ThwGDsXZ6iKubWuEQjmDxGwF3bUERDGbBXvcbjFondo` | Oscar Health (Ondo Tokenized) | OSCRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0264 | 9 | `not covered` | n/a | 7 |
| `wuzf2FDZTRbRY3ZnndMeQ38Wk9YTDGGXTA63nUyondo` | iShares 3-7 Year Treasury Bond ETF (Ondo Tokenized) | IEIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0393 | 9 | `not covered` | n/a | 7 |
| `ZsCDHjWFyndwgbHMs4AHYwJZQMgmAn72ESQj2b5ondo` | Atkore (Ondo Tokenized) | ATKRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0340 | 9 | `not covered` | n/a | 7 |
| `14VXAhoa1R74vi1ZuiQyGLJrnDMfoFBPJSCpGVz3ondo` | Apollo Global Management (Ondo Tokenized) | APOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0087 | 9 | `not covered` | n/a | 7 |
| `9PMjLqd8zPdKkJUXarnit5t7tPL3cCscwHzy7ATondo` | Trip.com Group (Ondo Tokenized) | TCOMon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0062 | 9 | `not covered` | n/a | 7 |
| `E86mX2yb3HLbJM6gRtZQ6dCYmLh6MSDZadu9SCPondo` | Regeneron Pharmaceuticals (Ondo Tokenized) | REGNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0066 | 9 | `not covered` | n/a | 7 |
| `eL1buL9zFxFhfRbjMfyPu2q9HSAJkUUnHVUgkPdondo` | Celestica (Ondo Tokenized) | CLSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0070 | 9 | `not covered` | n/a | 7 |
| `erp2t2My8UoFgyRt39EmnnSiDUwUM5aNKw5piBKondo` | Trane Technologies (Ondo Tokenized) | TTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0053 | 9 | `not covered` | n/a | 7 |
| `gbHFTMkuMQUy5xrgoCBdaQ2XYvNyjWAYcnRPh9Condo` | Opera (Ondo Tokenized) | OPRAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0019 | 9 | `not covered` | n/a | 7 |
| `gnoSQSNTNZHViqVfxCcPDVxcRA29mrJL7C6JqYLondo` | WisdomTree US Quality Dividend Growth Fund (Ondo Tokenized) | DGRWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0059 | 9 | `not covered` | n/a | 7 |
| `igWFQo1W64cQN6QUWYRXhM1UvpPuYTYtLELbDYqqqon` | Jabil (Ondo Tokenized) | JBLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0073 | 9 | `not covered` | n/a | 7 |
| `m3m2HAANsAf2Y3BkdBixDgtrrFHnZDp4NqVh9obondo` | WESCO International (Ondo Tokenized) | WCCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0065 | 9 | `not covered` | n/a | 7 |
| `NKyzy31w2J7odLb2CW3Ft4fpKXkW3LBt1pvpkVLondo` | Coupang (Ondo Tokenized) | CPNGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0069 | 9 | `not covered` | n/a | 7 |
| `ZmiDoowvkpp1Qgx4mmY3qtsHbNV1oE12ApKCbZNondo` | Hubbell (Ondo Tokenized) | HUBBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0051 | 9 | `not covered` | n/a | 7 |
| `mhZ69E1vDnAsQJXAwarLYSX5tmgeMajXBJ2rXAcondo` | iShares Flexible Income Active ETF (Ondo Tokenized) | BINCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0.0008 | 9 | `not covered` | n/a | 7 |
| `5U9o49BoQNU6bBMswvmBs3R4GZmYSyrnTN4ncX4ondo` | iShares Systematic Bond ETF (Ondo Tokenized) | SYSBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `7RGwPnmoaqypagKnJNywkgo1FWvYMPerSMekLVNaSeHJ` | Percolator Position — LONG | PERC-POS | `FqhKJT…5tJmTS` | **YES — mutable** | `7JVQvrAfzj3aasLxCkoLYX5KQcrb5nEZhUe5Qa8PvV5G` | 415118659 | 1 | 0 | `not covered` | yes (6) | 4 |
| `aqEnHXRnXEQwDXEiFSEU4xHziw3Fco4b5JPkTtnondo` | Enbridge (Ondo Tokenized) | ENBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `AutxDYK4QARmFGCpQFQuet2kND3tzP5nZGRww9Tx8btp` | Percolator Position — LONG | PERC-POS | `FqhKJT…5tJmTS` | **YES — mutable** | `7JVQvrAfzj3aasLxCkoLYX5KQcrb5nEZhUe5Qa8PvV5G` | 415118659 | 1 | 0 | `not covered` | yes (5) | 4 |
| `CYAwMGyuNSDu7NpuccNwcxMNS5Bu9akxU2Jooyiondo` | Franklin Focused Growth ETF (Ondo Tokenized) | FFOGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `CYqLHM92EhmF83iNgfN4A1j2ckjsHigRvXu7xHCondo` | Franklin Responsibly Sourced Gold ETF (Ondo Tokenized) | FGDLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `CZ9GBn1okotqKNUUqoxk4PF2JVi59bw5GWvVo6Dondo` | Franklin US Large Cap Multifactor Index ETF (Ondo Tokenized) | FLQLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `dhEXYTmQKbYBH3wbWTMqeZZpADSRprM4jiGYbUMondo` | LightPath Technologies (Ondo Tokenized) | LPTHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `dWFwjcUKdc7bPH9GEebpJVmEmUjvQTgEWGVR9WYondo` | Penguin Solutions (Ondo Tokenized) | PENGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `eqzwohR9oCR6sravF4y5HyUwyvCDbnfSYqiiFrXondo` | Generac Holdings (Ondo Tokenized) | GNRCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `eSu547weHVErV8nax42PyJzPT8JodhBfXLDp5vyondo` | Kopin (Ondo Tokenized) | KOPNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `fcfpT8y5fpEBJjqmjKLpscZYzVjxR95ErJsb31jondo` | iShares Floating Rate Loan Active ETF (Ondo Tokenized) | BRLNon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `feZXF2iFspS6QKE4LSXeSESRXgrtvzbE3dZSyydondo` | iShares Investment Grade Systematic Bond ETF (Ondo Tokenized) | IGEBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `fkznXN9GALK7f9zVr2RwRHWCPhwoima4zB3JbbNondo` | iShares Aaa - A Rated Corporate Bond ETF (Ondo Tokenized) | QLTAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `fRFzaZfGSXPf2r4oBgBBXpisRovMaJZjv1aCQBsondo` | Powell Industries (Ondo Tokenized) | POWLon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `fznj92AnTcQ6mAFvt68JgLJS5pHag5uPmJ7LmSLondo` | iShares High Yield Active ETF (Ondo Tokenized) | BRHYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `g3jQMP79SxnH1KisVw3C4SBpa8gSbPAocNJruJFondo` | iShares Large Cap Core Active ETF (Ondo Tokenized) | BLCRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `g4kT9HEg7rN4e5ZaEGHmzpkdM8qMbsZSHJojKeCondo` | iShares US Industry Rotation Active ETF (Ondo Tokenized) | INROon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `g7vMfs5FrR8JjieeGC3c9sJaYPp4G3jGPfF4tkyondo` | iShares US Equity Factor Rotation Active ETF (Ondo Tokenized) | DYNFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `gfKuBLive7Q35MYgxPgNx7qx524zQJ9RiDZJFZoondo` | iShares Systematic Alternatives Active ETF (Ondo Tokenized) | IALTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `gNhrgh21pQozQoc7YtvhdKF7eJnSKwWa9dzHnaxondo` | iShares International Country Rotation Active ETF (Ondo Tokenized) | COROon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `gPwmyo4BM4qgYYCTVgA4eJmzsnYNVMUJYBecYkCondo` | iShares Total Return Active ETF (Ondo Tokenized) | BRTRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `gtKc3PtKfUH7vbvYLJ1HCRXCpQK1Wpgevn8e6gUondo` | Leonardo DRS (Ondo Tokenized) | DRSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `hESwwvKsJH4p7Xib5rrM921Ng19cwcQGtxyrgSJondo` | General Dynamics (Ondo Tokenized) | GDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `hKVpWfYwP1VJ9BcBTPRcovcSpEkvnaN8eXwFoCMondo` | Vanguard Energy ETF (Ondo Tokenized) | VDEon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `ieocA48cBX3oiVECgosMGxG649wnf7R8EkVrA5fondo` | United Microelectronics (Ondo Tokenized) | UMCon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `iicfp8Efr4WfGAP9gXmYzdxmNFi1LV3iVudAmCnondo` | Flex (Ondo Tokenized) | FLEXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `iJtKb1CWnWdgJhs7HgSZvLmSJABGGMc97QeuG7tondo` | Skyworks Solutions (Ondo Tokenized) | SWKSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `jbzBdFNddeEiJXGcVH4DE2qUyYfTtyY2vaHJDEZondo` | Vishay Intertechnology (Ondo Tokenized) | VSHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `jCPs1JpVKAwevND3jzeDGAUBBFkJ5TUtiu2SxLbondo` | Ultra Clean Holdings (Ondo Tokenized) | UCTTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `jDoTgDRKSgVzkKdkaHZL3DiVmDM4YtYWwRG6Tgfondo` | Axcelis Technologies (Ondo Tokenized) | ACLSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `jiwgLgWJ8f6aEsM6hcSCrXLNnGpYfjmCVbqqAcwondo` | Methode Electronics (Ondo Tokenized) | MEIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `jwCKwGoJfx1p4K5XCwqPrq1xyJU1g26Tmf6UcDcondo` | Digi Power X (Ondo Tokenized) | DGXXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `jYMxpcgARQCdvQ15H1vvRCnBUbUEEQgSnS6SsfTondo` | Cohu (Ondo Tokenized) | COHUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `jYxKRFuXr6PEkzPpf1wWF7DhLL4gxGJ95Pv2NGrondo` | iShares Expanded Tech-Software ETF (Ondo Tokenized) | IGVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `kmppRwWb2odH6D4JWj8Lq9WshMyyUeCYssWQFhiondo` | Lincoln Electric (Ondo Tokenized) | LECOon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `m3XghfWMqmVE81LKLVxd1FVCKjqYAUxH8bMHGhzondo` | Forgent Power Solutions (Ondo Tokenized) | FPSon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `mFyszXnJf8BFR8H4o33pCZS1T36BH9LjtG3gTpdondo` | Scorpio Tankers (Ondo Tokenized) | STNGon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `mV5mof9x8nDirrHwT7g16MarvHbnRvz2zN2S4Cspyon` | International Seaways (Ondo Tokenized) | INSWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `n7DwzSkv1SBkcA9qj8LU9sZ9sRn72Z6spU2w2b9ondo` | Steel Dynamics (Ondo Tokenized) | STLDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `nbwNoPaFYNY2c3u4iK6U59ySC2ehFrpjdpfbyLDondo` | United States Antimony (Ondo Tokenized) | UAMYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `nLTgFdT7x37oXMbZoZxbQ1787qSPVRLXo7JPRkLondo` | CEVA (Ondo Tokenized) | CEVAon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `nNyVbs9Qty6wU2YcP5KFh4SUxNWTdPtL2W1bTMrondo` | Emerson Electric (Ondo Tokenized) | EMRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `o3pnLke4uti6hY3LTfb2wVBpHeWG7znjJHj6VXtondo` | Harmonic (Ondo Tokenized) | HLITon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `sDtEN5uwUJJCFJ95x2rPjPqNx5UWUbHQ2ucceUzondo` | iShares Securitized Income Active ETF (Ondo Tokenized) | SECUon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `siVse6kjZb9ihaXHaqoG3mhHyTPEnNCkvSDTheoondo` | Global X Defense Tech ETF (Ondo Tokenized) | SHLDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `t5XWftMCacS1p3xrg14ARaxgEvEM5R241kxHGqrondo` | Global X Space Tech ETF (Ondo Tokenized) | ORBXon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `teUYhoQUgqsFp9ZwYBUHfuUHdVvbNx9N8spESGqondo` | iShares Euro High Yield Corporate Bond USD Hedged ETF (Ondo Tokenized) | EUHYon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `teZfcA6zpP476eKzED1daqBWDtuwbk9e2Ejk2cpondo` | iShares J.P. Morgan EM Local Currency Bond ETF (Ondo Tokenized) | LEMBon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `th3tot4SRq6jgEyJ568NEh42MM82RSJ3NkiWeNzondo` | iShares Defense Industrials Active ETF (Ondo Tokenized) | IDEFon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `tzuC3sZnHg7spuAFhdCqivx9qtJg15qUBUpCJx1ondo` | iShares Global Government Bond USD Hedged Active ETF (Ondo Tokenized) | GGOVon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `ucQ3VfWAx9pkCN4Kg84zE56FtB4FJN2kQH4ArYYondo` | VanEck CLO ETF (Ondo Tokenized) | CLOIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `uiSLmtLdqxtbQq5gkwYBvBrZpnSNXZn8h6sjLsDondo` | Global X Silver Miners ETF (Ondo Tokenized) | SILon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `uyWDgDZqL6x2V86i7vwJTKPuyg2u79UYaBe5yt7ondo` | Global X Blockchain ETF (Ondo Tokenized) | BKCHon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `vr8RQPDmYQBruiYsFSV3KZyoWFEsEejxzMCdWrBondo` | iShares US Technology ETF (Ondo Tokenized) | IYWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `wCr7YFeYDWyYSebsoMY75g8c9pguGeVB3rT6kYjondo` | Global X S&P 500 Covered Call ETF (Ondo Tokenized) | XYLDon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `wxPFbh4dVrTWPGHHbVVeTHH7GK2uQwnTm5C8X3Fondo` | AB Ultra Short Income ETF (Ondo Tokenized) | YEARon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `Z7G1bRFYH47se4g1ppqSgtMzeJs4JjzzFPmt7iAondo` | nVent Electric (Ondo Tokenized) | NVTon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `ZifkbVBh94FSETjAfoLw587nxmGsYtXayAAUQgzondo` | Power Integrations (Ondo Tokenized) | POWIon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `ZKzkbFi4n3NQmRA9i5T7jVPSN2XERwxfHUf4p2pondo` | iShares High Yield Corporate Bond BuyWrite Strategy ETF (Ondo Tokenized) | HYGWon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |
| `ZTABSukbFUFcuCYpMFHxN18aB4kPL2NkpZpgnXPondo` | Ichor Holdings (Ondo Tokenized) | ICHRon | _none set_ | n/a — no hook program set | n/a | `not covered` | 0 | 9 | `not covered` | n/a | 7 |

## Row detail

Showing **31 of 625** rows: every row that names a hook program, plus one representative for each distinct hook authority. The remaining 594 rows share a configuration with a representative shown here and are listed in full, with every field, in `census.json`. Nothing is omitted from the dataset — only from this rendering.

### Fragmetric Squared (FRAG²)

- **Mint:** `FRAG2gPNXozPpYcn2a8zK7YdtfNXCLsioZNwZXwTQ3cP`
- **Name / symbol:** Fragmetric Squared / FRAG² — source: `token-metadata-extension`
- **Supply:** 20,914,801.7774 (raw `20914801777483318`, decimals 9)
- **Mint authority:** `3b3RHaeKdGGrbuWsbtMLa3CnFgUTFZ4TLGy9Ui2Aag1m`
- **Freeze authority:** burned / none
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3`
- **Hook `authority`:** `fragSkuEpEmdoj9Bcyawk9rBdsChcVJLWHfj9JX1Gby`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj`
- **Last deployed slot:** 391854457
- **Loader:** bpf-upgradeable
- **ProgramData account:** `BUoMp38gkcjxguwowhhH5sxi5u7Abpi3wSZKkTkCGEFi`

**ExtraAccountMetaList**

- **Derived PDA:** `ChZq1ySohMBCogH6mwEbn8yGWg3rXGRoEnxkpAfCTqHy`
- **Exists:** yes
- **Accounts in list:** 8

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | pda-of-hook-program | _seed config_ `010466756e640301…` | false | true |
| 1 | pda-of-hook-program | _seed config_ `0106726577617264…` | false | true |
| 2 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 3 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 4 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 5 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 6 | pda-of-hook-program | _seed config_ `01115f5f6576656e…` | false | false |
| 7 | literal-pubkey | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | false | false |

**All mint extensions (3):** TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.734Z._

---

### Fragmetric Staked SWTCH (fragSWTCH)

- **Mint:** `FRAGW7L9BxkCMbivRN5HE2iXuA196v3fHA86GY16nV4L`
- **Name / symbol:** Fragmetric Staked SWTCH / fragSWTCH — source: `token-metadata-extension`
- **Supply:** 10,403,001.8180 (raw `10403001818051240`, decimals 9)
- **Mint authority:** `AHANaLPqPUPkTJsx95EPc27VFwE2Xrqcx2smB5c29HaZ`
- **Freeze authority:** burned / none
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3`
- **Hook `authority`:** `fragSkuEpEmdoj9Bcyawk9rBdsChcVJLWHfj9JX1Gby`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj`
- **Last deployed slot:** 391854457
- **Loader:** bpf-upgradeable
- **ProgramData account:** `BUoMp38gkcjxguwowhhH5sxi5u7Abpi3wSZKkTkCGEFi`

**ExtraAccountMetaList**

- **Derived PDA:** `484Mma6dFgqsGVFBkiheKuKXmDh6ETu8eP2kM8ZMfzss`
- **Exists:** yes
- **Accounts in list:** 8

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | pda-of-hook-program | _seed config_ `010466756e640301…` | false | true |
| 1 | pda-of-hook-program | _seed config_ `0106726577617264…` | false | true |
| 2 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 3 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 4 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 5 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 6 | pda-of-hook-program | _seed config_ `01115f5f6576656e…` | false | false |
| 7 | literal-pubkey | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | false | false |

**All mint extensions (3):** TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.744Z._

---

### Fragmetric Staked JTO (fragJTO)

- **Mint:** `FRAGJ157KSDfGvBJtCSrsTWUqFnZhrw4aC8N8LqHuoos`
- **Name / symbol:** Fragmetric Staked JTO / fragJTO — source: `token-metadata-extension`
- **Supply:** 1,238,521.0479 (raw `1238521047916681`, decimals 9)
- **Mint authority:** `ETbNmGejjPc1dswSZTdLDe8eUBeWvWokYPcFNgzYX9jj`
- **Freeze authority:** burned / none
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3`
- **Hook `authority`:** `fragSkuEpEmdoj9Bcyawk9rBdsChcVJLWHfj9JX1Gby`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj`
- **Last deployed slot:** 391854457
- **Loader:** bpf-upgradeable
- **ProgramData account:** `BUoMp38gkcjxguwowhhH5sxi5u7Abpi3wSZKkTkCGEFi`

**ExtraAccountMetaList**

- **Derived PDA:** `EdXLGBLySrvKXnpkUGVERrzZcHACDHaVPBEGBhDNuZxa`
- **Exists:** yes
- **Accounts in list:** 8

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | pda-of-hook-program | _seed config_ `010466756e640301…` | false | true |
| 1 | pda-of-hook-program | _seed config_ `0106726577617264…` | false | true |
| 2 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 3 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 4 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 5 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 6 | pda-of-hook-program | _seed config_ `01115f5f6576656e…` | false | false |
| 7 | literal-pubkey | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | false | false |

**All mint extensions (3):** TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.691Z._

---

### Fragmetric Restaked SOL (fragSOL)

- **Mint:** `FRAGSEthVFL7fdqM8hxfxkfCZzUvmg21cqPJVvC1qdbo`
- **Name / symbol:** Fragmetric Restaked SOL / fragSOL — source: `token-metadata-extension`
- **Supply:** 56,126.5842 (raw `56126584236413`, decimals 9)
- **Mint authority:** `3TK9fNePM4qdKC4dwvDe8Bamv14prDqdVfuANxPeiryb`
- **Freeze authority:** burned / none
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3`
- **Hook `authority`:** `fragSkuEpEmdoj9Bcyawk9rBdsChcVJLWHfj9JX1Gby`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj`
- **Last deployed slot:** 391854457
- **Loader:** bpf-upgradeable
- **ProgramData account:** `BUoMp38gkcjxguwowhhH5sxi5u7Abpi3wSZKkTkCGEFi`

**ExtraAccountMetaList**

- **Derived PDA:** `9cvMWR3SkF7MXS1CAbhacwoxFM4tGSPuhpFuL8XJ1CDb`
- **Exists:** yes
- **Accounts in list:** 8

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | pda-of-hook-program | _seed config_ `010466756e640301…` | false | true |
| 1 | pda-of-hook-program | _seed config_ `0106726577617264…` | false | true |
| 2 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 3 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 4 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 5 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 6 | pda-of-hook-program | _seed config_ `01115f5f6576656e…` | false | false |
| 7 | literal-pubkey | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | false | false |

**All mint extensions (3):** TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.680Z._

---

### Staked JUP (stJUP)

- **Mint:** `stJUPZMmAWA1PNVPXCvqVK6MHABr4yFo5rv2JTethCa`
- **Name / symbol:** Staked JUP / stJUP — source: `token-metadata-extension`
- **Supply:** 64,061.0328 (raw `64061032878`, decimals 6)
- **Mint authority:** `3HwwFBdmnRQM1K7oLev1gc1oKFPXnuhGJFaDvc4JQwCJ`
- **Freeze authority:** `3HwwFBdmnRQM1K7oLev1gc1oKFPXnuhGJFaDvc4JQwCJ`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `wJUPXhGwC88LZeG1DXaYing3WB1Q4YvwJcK77bidNGv`
- **Hook `authority`:** `3HwwFBdmnRQM1K7oLev1gc1oKFPXnuhGJFaDvc4JQwCJ`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `De3YSj45A3mGo9pp8CSyMooG6o4SaneZ3ms4ngbk2FCU`
- **Last deployed slot:** 385923063
- **Loader:** bpf-upgradeable
- **ProgramData account:** `E36BZppbbZbC8xf9Us5KseR6uXKdU6ydXtY9pfL3VsK2`

**ExtraAccountMetaList**

- **Derived PDA:** `3nifY4DJGaFuHGMgQChd8PHrp1A3A12SQMG616pYdKd3`
- **Exists:** yes
- **Accounts in list:** 1

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | literal-pubkey | `Sysvar1nstructions1111111111111111111111111` | false | false |

**All mint extensions (3):** MetadataPointer(18), TransferHook(14), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.748Z._

---

### Fragmetric Staked BTC (fragBTC)

- **Mint:** `FRAGB4KZGLMy3wH1nBajP3Q17MHnecEvTPT6wb4pX5MB`
- **Name / symbol:** Fragmetric Staked BTC / fragBTC — source: `token-metadata-extension`
- **Supply:** 9.8170 (raw `981707672`, decimals 8)
- **Mint authority:** `DGWv49JvpJcy23UNUqGRuex9FVK8v5dnBdDowszY4RFG`
- **Freeze authority:** burned / none
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3`
- **Hook `authority`:** `fragSkuEpEmdoj9Bcyawk9rBdsChcVJLWHfj9JX1Gby`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `XEhpR3UauMkARQ8ztwaU9Kbv16jEpBbXs9ftELka9wj`
- **Last deployed slot:** 391854457
- **Loader:** bpf-upgradeable
- **ProgramData account:** `BUoMp38gkcjxguwowhhH5sxi5u7Abpi3wSZKkTkCGEFi`

**ExtraAccountMetaList**

- **Derived PDA:** `GNJsoqrWKoXnAB79efbqjEgusHRim5DHCGs56cGRaoKi`
- **Exists:** yes
- **Accounts in list:** 8

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | pda-of-hook-program | _seed config_ `010466756e640301…` | false | true |
| 1 | pda-of-hook-program | _seed config_ `0106726577617264…` | false | true |
| 2 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 3 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 4 | pda-of-hook-program | _seed config_ `0109757365725f66…` | false | true |
| 5 | pda-of-hook-program | _seed config_ `010b757365725f72…` | false | true |
| 6 | pda-of-hook-program | _seed config_ `01115f5f6576656e…` | false | false |
| 7 | literal-pubkey | `fragnAis7Bp6FTsMoa6YcH8UffhEw43Ph79qAiK3iF3` | false | false |

**All mint extensions (3):** TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.717Z._

---

### Percolator Position — LONG (PERC-POS)

- **Mint:** `7RGwPnmoaqypagKnJNywkgo1FWvYMPerSMekLVNaSeHJ`
- **Name / symbol:** Percolator Position — LONG / PERC-POS — source: `token-metadata-extension`
- **Supply:** 1 (raw `1`, decimals 0)
- **Mint authority:** burned / none
- **Freeze authority:** `F3VitQrFSk61j31tgfv8kPutNnKuqPewJhSj9kHBP3xq`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `FqhKJT9gtScjrmfUuRMjeg7cXNpif1fqsy5Jh65tJmTS`
- **Hook `authority`:** `F3VitQrFSk61j31tgfv8kPutNnKuqPewJhSj9kHBP3xq`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `7JVQvrAfzj3aasLxCkoLYX5KQcrb5nEZhUe5Qa8PvV5G`
- **Last deployed slot:** 415118659
- **Loader:** bpf-upgradeable
- **ProgramData account:** `HrTF4XotNRpfKCNaMHJkTNafb4PfkpLYicFxmrFmrvAB`

**ExtraAccountMetaList**

- **Derived PDA:** `2mXhAPd2XKJMVGXX33y1ZzBGvgQABVAK3xXyWQfrJArg`
- **Exists:** yes
- **Accounts in list:** 6

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | literal-pubkey | `BB9MtuDKWTeb58XCrWMqyjdGUQfCeueby6GRcv2swm4V` | false | true |
| 1 | literal-pubkey | `CDu48T84hqL5qx4geRsVGjsJmqCK57sRkDS2SrEYmb6C` | false | true |
| 2 | literal-pubkey | `ESa89R5Es3rJ5mnwGybVRG1GrNt9etP11Z5V2QWD4edv` | false | false |
| 3 | literal-pubkey | `F3VitQrFSk61j31tgfv8kPutNnKuqPewJhSj9kHBP3xq` | false | false |
| 4 | literal-pubkey | `Sysvar1nstructions1111111111111111111111111` | false | false |
| 5 | literal-pubkey | `FqhKJT9gtScjrmfUuRMjeg7cXNpif1fqsy5Jh65tJmTS` | false | false |

**All mint extensions (4):** MetadataPointer(18), TransferHook(14), MintCloseAuthority(3), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.759Z._

---

### Percolator Position — LONG (PERC-POS)

- **Mint:** `AutxDYK4QARmFGCpQFQuet2kND3tzP5nZGRww9Tx8btp`
- **Name / symbol:** Percolator Position — LONG / PERC-POS — source: `token-metadata-extension`
- **Supply:** 1 (raw `1`, decimals 0)
- **Mint authority:** burned / none
- **Freeze authority:** `F3VitQrFSk61j31tgfv8kPutNnKuqPewJhSj9kHBP3xq`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** `FqhKJT9gtScjrmfUuRMjeg7cXNpif1fqsy5Jh65tJmTS`
- **Hook `authority`:** `F3VitQrFSk61j31tgfv8kPutNnKuqPewJhSj9kHBP3xq`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** **YES — mutable**
- **Upgrade authority:** `7JVQvrAfzj3aasLxCkoLYX5KQcrb5nEZhUe5Qa8PvV5G`
- **Last deployed slot:** 415118659
- **Loader:** bpf-upgradeable
- **ProgramData account:** `HrTF4XotNRpfKCNaMHJkTNafb4PfkpLYicFxmrFmrvAB`

**ExtraAccountMetaList**

- **Derived PDA:** `37V2S8n7qE55dwu2x92fZyftzqyAxGRL5QSex9PFoUYb`
- **Exists:** yes
- **Accounts in list:** 5

| # | kind | address | signer | writable |
|---|---|---|---|---|
| 0 | literal-pubkey | `BZJ8f9o7dQFG4AhryzD784m4t7LbRmjoQgYSQEAHnSfB` | false | true |
| 1 | literal-pubkey | `6akNPYQLyg2nGLDtGAoykB8ZtuoAEwGhxreXaDWncya2` | false | false |
| 2 | literal-pubkey | `ESa89R5Es3rJ5mnwGybVRG1GrNt9etP11Z5V2QWD4edv` | false | false |
| 3 | literal-pubkey | `F3VitQrFSk61j31tgfv8kPutNnKuqPewJhSj9kHBP3xq` | false | false |
| 4 | literal-pubkey | `Sysvar1nstructions1111111111111111111111111` | false | false |

**All mint extensions (4):** MetadataPointer(18), TransferHook(14), MintCloseAuthority(3), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.762Z._

---

### Pump (PUMP)

- **Mint:** `pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn`
- **Name / symbol:** Pump / PUMP — source: `token-metadata-extension`
- **Supply:** 842,438,521,123.2676 (raw `842438521123267689`, decimals 6)
- **Mint authority:** burned / none
- **Freeze authority:** burned / none
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `DMdBa812dBW1CHVhmTyUyVcrBnSbZbfoFC7U14k4riH1`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (3):** TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.763Z._

---

### Ondo US Dollar Token (USDon)

- **Mint:** `ZPFtoCe7WWqG4N3ZFRccS8T9SMBeHsd1Vmgv2i7ondo`
- **Name / symbol:** Ondo US Dollar Token / USDon — source: `token-metadata-extension`
- **Supply:** 12,652,832.5299 (raw `12652832529922482`, decimals 9)
- **Mint authority:** `9foMHsSDq7nMg4WPusSz9eY7tyxyukqborA8GyU5cUxD`
- **Freeze authority:** `51QVCuHfL1FeNjd8BDeffCKhCcAYoULnVB3yjNhShiuK`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `9foMHsSDq7nMg4WPusSz9eY7tyxyukqborA8GyU5cUxD`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** ScaledUiAmount(25), PermanentDelegate(12), MetadataPointer(18), Pausable(26), DefaultAccountState(6), ConfidentialTransferMint(4), TransferHook(14), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.771Z._

---

### USDGO (USDGO)

- **Mint:** `72puLt71H93Z9CzHuBRTwFpL4TG3WZUhnoCC7p8gxigu`
- **Name / symbol:** USDGO / USDGO — source: `token-metadata-extension`
- **Supply:** 1,139,610,694.7 (raw `1139610694700000`, decimals 6)
- **Mint authority:** `C2QJ4HKLWzWRNprAmKoyd6YqXouVHFZuLKujdqtF4ZDt`
- **Freeze authority:** `FiV6goxf5fYfw9y7XwuG8bVAG6bqTb1sR1rrLomjkXa3`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `8N2NFYQ5VMaoDGMAcUbfzdeJqvok6LQs2E9BxDK6mMAE`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (10):** MetadataPointer(18), PermanentDelegate(12), TransferFeeConfig(1), ConfidentialTransferFeeConfig(16), ConfidentialTransferMint(4), TransferHook(14), MintCloseAuthority(3), Pausable(26), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.776Z._

---

### PayPal USD (PYUSD)

- **Mint:** `2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo`
- **Name / symbol:** PayPal USD / PYUSD — source: `token-metadata-extension`
- **Supply:** 685,054,479.4213 (raw `685054479421367`, decimals 6)
- **Mint authority:** `8Jornc27vtAYPkwDzsZVgLQchAYyC8nD7aCNPCDV8Qk2`
- **Freeze authority:** `2apBGMsS6ti9RyF5TwQTDswXBWskiJP2LD4cUEDqYJjk`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `2apBGMsS6ti9RyF5TwQTDswXBWskiJP2LD4cUEDqYJjk`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MintCloseAuthority(3), PermanentDelegate(12), TransferFeeConfig(1), ConfidentialTransferMint(4), ConfidentialTransferFeeConfig(16), TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.669Z._

---

### CASH (CASH)

- **Mint:** `CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH`
- **Name / symbol:** CASH / CASH — source: `token-metadata-extension`
- **Supply:** 120,898,455.1848 (raw `120898455184802`, decimals 6)
- **Mint authority:** `HJT2TXrhbWta2ax7V86vcnmX7ZmAVzua4v2yrGwchXB7`
- **Freeze authority:** `AyCP3oW19DHZKvx8oU6mvseW2qn7XfmQ5STrXPa6prY5`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `3etmwgxP4Lt2LLEyYpN2f9oKKi1onGy5XHRSP4BRq2vb`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (7):** MintCloseAuthority(3), PermanentDelegate(12), DefaultAccountState(6), ConfidentialTransferMint(4), TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.669Z._

---

### USDBridge (USDB)

- **Mint:** `ENL66PGy8d8j5KNqLtCcg4uidDUac5ibt45wbjH9REzB`
- **Name / symbol:** USDBridge / USDB — source: `token-metadata-extension`
- **Supply:** 117,892,427.82 (raw `117892427820000`, decimals 6)
- **Mint authority:** `3ZGf3ERiitfTR9RCChchfo7QWmSfH1WArJ3jjrtMXnKa`
- **Freeze authority:** `DGQzo58aPR5i5hQtbRiwrhBJamTc4PxnnB79jHPyDoA`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `GGXxderQwPcCEXuoQPAcQSf9GJ4P7mwpkFKifsEsqSxf`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (7):** MintCloseAuthority(3), PermanentDelegate(12), DefaultAccountState(6), ConfidentialTransferMint(4), TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `seed-verify`. Observed at 2026-08-08T10:26:05.670Z._

---

### DFDV xStock (DFDVx)

- **Mint:** `Xs2yquAgsHByNzx68WJC55WHjHBvG9JsMB7CWjTLyPy`
- **Name / symbol:** DFDV xStock / DFDVx — source: `token-metadata-extension`
- **Supply:** 1,983,197.0787 (raw `198319707870293`, decimals 8)
- **Mint authority:** `7pt9tkctJPK7PPNQJ77GKg8ZffSF6QxoMiCFYHxrtaCj`
- **Freeze authority:** `JDq14BWvqCRFNu1krb12bcRpbGtJZ1FLEakMw6FdxJNs`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `5aMNNLQJwAEeoemTEMkv5NVjqKwvvefRYCQ5Z67HFvEq`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), PermanentDelegate(12), DefaultAccountState(6), ScaledUiAmount(25), Pausable(26), ConfidentialTransferMint(4), TransferHook(14), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.765Z._

---

### Anduril PreStocks (ANDURIL)

- **Mint:** `PresTj4Yc2bAR197Er7wz4UUKSfqt6FryBEdAriBoQB`
- **Name / symbol:** Anduril PreStocks / ANDURIL — source: `token-metadata-extension`
- **Supply:** 10,227.7358 (raw `10227735870549`, decimals 9)
- **Mint authority:** `WV9PJN7XTmTLVwbutCLFxp8TyePee6Xq5mRq6Fti5Wc`
- **Freeze authority:** `WV9PJN7XTmTLVwbutCLFxp8TyePee6Xq5mRq6Fti5Wc`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `WV9PJN7XTmTLVwbutCLFxp8TyePee6Xq5mRq6Fti5Wc`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (10):** PermanentDelegate(12), DefaultAccountState(6), TransferFeeConfig(1), ConfidentialTransferMint(4), ConfidentialTransferFeeConfig(16), TransferHook(14), ScaledUiAmount(25), MetadataPointer(18), Pausable(26), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.763Z._

---

### Shift S&P500 3x Short (SPX3S)

- **Mint:** `67ik3PpEXBJA1km29rZMMKwhgvvjrKpNMoaZyTsSHFT`
- **Name / symbol:** Shift S&P500 3x Short / SPX3S — source: `token-metadata-extension`
- **Supply:** 26,768.4957 (raw `2676849570154`, decimals 8)
- **Mint authority:** `2CeU1GEWbhXXZvypMfAPa2AzyvF3yhrG7AqUyFoDqxZf`
- **Freeze authority:** `2CeU1GEWbhXXZvypMfAPa2AzyvF3yhrG7AqUyFoDqxZf`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `2CeU1GEWbhXXZvypMfAPa2AzyvF3yhrG7AqUyFoDqxZf`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.776Z._

---

### Shift Tesla 2x Long (TSL2L)

- **Mint:** `6afjZE5Qv9WF5K1adBgTxtWyenJ7ZerH6BVAzmoSHFT`
- **Name / symbol:** Shift Tesla 2x Long / TSL2L — source: `token-metadata-extension`
- **Supply:** 43,300.8305 (raw `4330083050105`, decimals 8)
- **Mint authority:** `21bymdv3CB8QFa5taouuTcrgTVLjH9vKVEScEKqKGRZd`
- **Freeze authority:** `21bymdv3CB8QFa5taouuTcrgTVLjH9vKVEScEKqKGRZd`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `21bymdv3CB8QFa5taouuTcrgTVLjH9vKVEScEKqKGRZd`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.763Z._

---

### Shift Semiconductor 3x Short (SOX3S)

- **Mint:** `7GoxZQ7gCh1mg1b3AUqd7cyPqiUp4y2NRxM9A5zSHFT`
- **Name / symbol:** Shift Semiconductor 3x Short / SOX3S — source: `token-metadata-extension`
- **Supply:** 75,651.4408 (raw `7565144086658`, decimals 8)
- **Mint authority:** `76ThePy3xFjiAvEn2dxymehQJBGoD2vywfYVNgXGVJVA`
- **Freeze authority:** `76ThePy3xFjiAvEn2dxymehQJBGoD2vywfYVNgXGVJVA`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `76ThePy3xFjiAvEn2dxymehQJBGoD2vywfYVNgXGVJVA`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.766Z._

---

### AUSD (AUSD)

- **Mint:** `AUSD1jCcCyPLybk1YnvPWsHQSrZ46dxwoMniN4N2UEB9`
- **Name / symbol:** AUSD / AUSD — source: `token-metadata-extension`
- **Supply:** 3,395,562.7746 (raw `3395562774682`, decimals 6)
- **Mint authority:** `EARe2Bbuv3y8K1tvmGfjxTTjE6cXKSkR96kM4RURLgbP`
- **Freeze authority:** `6QZAZqTmvvSCNLsJvwtkvk4FjbxstS7p2TQR9duwPSuH`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `D4qz7qXVHaxzMkcgfvesUeh8JVyWmsr4knUdMR2zLUYX`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MintCloseAuthority(3), PermanentDelegate(12), TransferFeeConfig(1), ConfidentialTransferMint(4), ConfidentialTransferFeeConfig(16), TransferHook(14), MetadataPointer(18), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.766Z._

---

### Shift Tesla 1x Short (TSL1S)

- **Mint:** `bNPXng6hSVas7LWiNQyvpGcPYtY1ZmFY6WP49ymSHFT`
- **Name / symbol:** Shift Tesla 1x Short / TSL1S — source: `token-metadata-extension`
- **Supply:** 10,044.9749 (raw `1004497494190`, decimals 8)
- **Mint authority:** `9eo5QkvdxsAU6kdAbAABWpbq1TGvsxPkLoroPwgxY4o1`
- **Freeze authority:** `9eo5QkvdxsAU6kdAbAABWpbq1TGvsxPkLoroPwgxY4o1`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `9eo5QkvdxsAU6kdAbAABWpbq1TGvsxPkLoroPwgxY4o1`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.763Z._

---

### Staked Solstice (stSLX)

- **Mint:** `GxHksENo754dKj6kv5d2z7ey9KwE7YSRYgRCtoFYd2yq`
- **Name / symbol:** Staked Solstice / stSLX — source: `token-metadata-extension`
- **Supply:** 4,600,111.8074 (raw `4600111807488`, decimals 6)
- **Mint authority:** `GxHksENo754dKj6kv5d2z7ey9KwE7YSRYgRCtoFYd2yq`
- **Freeze authority:** `GxHksENo754dKj6kv5d2z7ey9KwE7YSRYgRCtoFYd2yq`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `GxHksENo754dKj6kv5d2z7ey9KwE7YSRYgRCtoFYd2yq`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (5):** MetadataPointer(18), MintCloseAuthority(3), DefaultAccountState(6), TransferHook(14), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.767Z._

---

### XO Cash (XO)

- **Mint:** `xoUSDq85Rjsb6SbUwJyreFgeWQvxdkT7R3c3g7s6p5Y`
- **Name / symbol:** XO Cash / XO — source: `token-metadata-extension`
- **Supply:** 2,482,117.7871 (raw `2482117787132`, decimals 6)
- **Mint authority:** `F4fpAN5ZSFm9QJ5WTWemgnV6ktwwWQS5DPB4m1pCJinu`
- **Freeze authority:** `AgNSjv3CWETjQgcLK5MkTzRSt3KirbrBqGagjv5AKbCR`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `AgNSjv3CWETjQgcLK5MkTzRSt3KirbrBqGagjv5AKbCR`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (7):** MetadataPointer(18), ConfidentialTransferMint(4), TransferHook(14), Pausable(26), PermanentDelegate(12), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.767Z._

---

### Shift S&P500 3x Long (SPX3L)

- **Mint:** `12y35E6btjazuaSjjwq99MobbycbkFsFvm8s5QpaSHFT`
- **Name / symbol:** Shift S&P500 3x Long / SPX3L — source: `token-metadata-extension`
- **Supply:** 2,902.4698 (raw `290246984702`, decimals 8)
- **Mint authority:** `CoghvrToe8SZTta5Q6cb2BnVki6WXXGMogeSiea5vNte`
- **Freeze authority:** `CoghvrToe8SZTta5Q6cb2BnVki6WXXGMogeSiea5vNte`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `CoghvrToe8SZTta5Q6cb2BnVki6WXXGMogeSiea5vNte`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.763Z._

---

### Agant GBP (GBPA)

- **Mint:** `DYoCmA91VE8REbWNw3kM736PN7vv97qc2jr5wmUbuNtZ`
- **Name / symbol:** Agant GBP / GBPA — source: `token-metadata-extension`
- **Supply:** 200,012 (raw `200012000000`, decimals 6)
- **Mint authority:** `AkRcEoab3ECQ4GoDgVb9jE9wVMVeSksR3TwGCmdNEtB8`
- **Freeze authority:** `BRi183SZJLrCVAqFQ69Zi95UdrumSpazdeuM4nLKQz2X`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `BRi183SZJLrCVAqFQ69Zi95UdrumSpazdeuM4nLKQz2X`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (9):** MetadataPointer(18), MintCloseAuthority(3), ConfidentialTransferMint(4), ConfidentialTransferFeeConfig(16), PermanentDelegate(12), Pausable(26), TransferFeeConfig(1), TransferHook(14), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.775Z._

---

### Shift Semiconductor 3x Long (SOX3L)

- **Mint:** `Hyhxfb6riaqCV333GynmnCXCEQK3goTznFj7k4dSHFT`
- **Name / symbol:** Shift Semiconductor 3x Long / SOX3L — source: `token-metadata-extension`
- **Supply:** 3,967.3836 (raw `396738365992`, decimals 8)
- **Mint authority:** `2g5JvVx2C6si9XoLoMjr1CEyK8Mt597qptsrNN1RZ4WB`
- **Freeze authority:** `2g5JvVx2C6si9XoLoMjr1CEyK8Mt597qptsrNN1RZ4WB`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `2g5JvVx2C6si9XoLoMjr1CEyK8Mt597qptsrNN1RZ4WB`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.766Z._

---

### Shift SpaceX 2x Long (SPCX2L)

- **Mint:** `BcVDiSc5DTp8imZE4Nx2abUhhgA3KCxJ4M5g7aHLSHFT`
- **Name / symbol:** Shift SpaceX 2x Long / SPCX2L — source: `token-metadata-extension`
- **Supply:** 249.9964 (raw `24999646619`, decimals 8)
- **Mint authority:** `ELt7GJcL4jxVoF1snNjxjegPKjuELxi13ut5f8R7vgH`
- **Freeze authority:** `ELt7GJcL4jxVoF1snNjxjegPKjuELxi13ut5f8R7vgH`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `ELt7GJcL4jxVoF1snNjxjegPKjuELxi13ut5f8R7vgH`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.765Z._

---

### RoboStrategy - Backpack Securities (BOT)

- **Mint:** `BoTx8y9ynfdxf5ZjWtCoBVkff52qKA82ysaLU8ZM6d8T`
- **Name / symbol:** RoboStrategy - Backpack Securities / BOT — source: `token-metadata-extension`
- **Supply:** 39,847.8770 (raw `39847877029`, decimals 6)
- **Mint authority:** `HcSDK8nSoSft3VMP2d8ASnXnzDJnnY4Ak2xkhBtHgQ4H`
- **Freeze authority:** `2cVYpagTt7ZGc3mmTXBa7fAznUtx5DUu6aCq8uVDaf4a`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `2cVYpagTt7ZGc3mmTXBa7fAznUtx5DUu6aCq8uVDaf4a`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), PermanentDelegate(12), DefaultAccountState(6), Pausable(26), ConfidentialTransferMint(4), TransferHook(14), ScaledUiAmount(25), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.763Z._

---

### PiggyBank SPYx (pbSPYx)

- **Mint:** `E65CoK961Rs5LzKhGZxbKsB7xpFhYhXogH8nhr8zamTK`
- **Name / symbol:** PiggyBank SPYx / pbSPYx — source: `token-metadata-extension`
- **Supply:** 513.9518 (raw `51395189947`, decimals 8)
- **Mint authority:** `5CgRTdywEQ7LK7SRM5NAgsuSWxnswREW6VeZ4i9jHCRf`
- **Freeze authority:** burned / none
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `5CgRTdywEQ7LK7SRM5NAgsuSWxnswREW6VeZ4i9jHCRf`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (4):** MetadataPointer(18), ScaledUiAmount(25), TransferHook(14), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.766Z._

---

### Shift SpaceX 2x Short (SPCX2S)

- **Mint:** `FtBpBcLU4Epjm2nnuQNRYGkFM6jfsXrcGKJSiKCtSHFT`
- **Name / symbol:** Shift SpaceX 2x Short / SPCX2S — source: `token-metadata-extension`
- **Supply:** 395.7177 (raw `39571779077`, decimals 8)
- **Mint authority:** `4mU3jH1iEA78LJ9YPfFYnN4ABty6xMBxndajFg3iToaK`
- **Freeze authority:** `4mU3jH1iEA78LJ9YPfFYnN4ABty6xMBxndajFg3iToaK`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `4mU3jH1iEA78LJ9YPfFYnN4ABty6xMBxndajFg3iToaK`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.765Z._

---

### Shift SpaceX (SPCX1L)

- **Mint:** `HMtfKJDqiAbY6damtfGisodK4sotG4Vc3wiLmTXmSHFT`
- **Name / symbol:** Shift SpaceX / SPCX1L — source: `token-metadata-extension`
- **Supply:** 129.0615 (raw `12906159852`, decimals 8)
- **Mint authority:** `2zeCwcRVjPc9XW9P2NWz3yhK6UHae6Z2N2s1iaPKVf26`
- **Freeze authority:** `2zeCwcRVjPc9XW9P2NWz3yhK6UHae6Z2N2s1iaPKVf26`
- **Holder count:** `not covered` — not covered — requires getProgramAccounts

**Transfer hook**

- **Hook program id:** _null — the extension is present but no program is invoked on transfer_
- **Hook `authority`:** `2zeCwcRVjPc9XW9P2NWz3yhK6UHae6Z2N2s1iaPKVf26`
  - This key can point the mint at a **different** hook program. That is separate from, and additional to, whether the current hook program is itself upgradeable.
- **Hook program upgradeable:** n/a — no hook program set
- **Upgrade authority:** n/a
- **Last deployed slot:** `not covered`
- **Loader:** `not covered`
- **ProgramData account:** `not covered`
- **Note:** TransferHook extension present but program_id is null — no program is invoked on transfer

**ExtraAccountMetaList**

- **Derived PDA:** `not covered`
- **Exists:** `not covered`
- **Accounts in list:** `not covered`
- **Note:** no hook program id — PDA undefined

**All mint extensions (8):** MetadataPointer(18), ScaledUiAmount(25), Pausable(26), PermanentDelegate(12), ConfidentialTransferMint(4), TransferHook(14), DefaultAccountState(6), TokenMetadata(19)

_Discovered by: `jupiter-verified-list`. Observed at 2026-08-08T10:26:05.774Z._

---

## Reproduction

See `METHOD.md` in this directory. Short version:

```bash
export SOLANA_RPC_URL="https://your-endpoint"   # needs getProgramAccounts for a complete scan
node src/census/cli.mjs
```

Every row above is derived from a raw RPC response cached under `data/census/.cache/`, so the parse can be re-checked without re-scanning.
