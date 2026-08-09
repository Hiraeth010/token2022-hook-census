/**
 * cache.mjs — on-disk cache of raw RPC responses.
 *
 * Two jobs:
 *  1. make re-runs cheap, so a scan can be resumed after a rate-limit wall;
 *  2. make the dataset auditable — every published row is derived from a raw response
 *     that is still sitting on disk, so a reviewer can re-parse it without re-scanning.
 *
 * Cache entries record the slot and wall-clock time they were taken at. A cached account
 * is a snapshot, not a live read, and downstream output must date it accordingly.
 */

import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

export class Cache {
  constructor(dir) {
    this.dir = dir;
    this.hits = 0;
    this.misses = 0;
    this.writes = 0;
  }

  async init() {
    await mkdir(join(this.dir, 'accounts'), { recursive: true });
    await mkdir(join(this.dir, 'rpc'), { recursive: true });
  }

  #accountPath(address) {
    return join(this.dir, 'accounts', `${address}.json`);
  }

  #rpcPath(key) {
    const h = createHash('sha256').update(key).digest('hex').slice(0, 32);
    return join(this.dir, 'rpc', `${h}.json`);
  }

  /**
   * Read a cached account. Returns the stored record, or null on a miss.
   * A stored record with `value: null` is a real measurement ("this account did not
   * exist at that slot") and is returned as such — it is not treated as a miss.
   */
  async getAccount(address) {
    const p = this.#accountPath(address);
    if (!existsSync(p)) { this.misses++; return null; }
    try {
      const rec = JSON.parse(await readFile(p, 'utf8'));
      this.hits++;
      return rec;
    } catch (err) {
      console.error(`[cache] corrupt entry for ${address}, ignoring: ${err.message}`);
      this.misses++;
      return null;
    }
  }

  async putAccount(address, value, slot) {
    const rec = { address, value, slot, fetchedAt: new Date().toISOString() };
    await writeFile(this.#accountPath(address), JSON.stringify(rec), 'utf8');
    this.writes++;
    return rec;
  }

  async getRpc(key) {
    const p = this.#rpcPath(key);
    if (!existsSync(p)) { this.misses++; return null; }
    try {
      const rec = JSON.parse(await readFile(p, 'utf8'));
      this.hits++;
      return rec;
    } catch {
      this.misses++;
      return null;
    }
  }

  async putRpc(key, result) {
    const rec = { key, result, fetchedAt: new Date().toISOString() };
    await writeFile(this.#rpcPath(key), JSON.stringify(rec), 'utf8');
    this.writes++;
    return rec;
  }

  async accountCount() {
    try {
      return (await readdir(join(this.dir, 'accounts'))).length;
    } catch {
      return 0;
    }
  }

  stats() {
    return { hits: this.hits, misses: this.misses, writes: this.writes };
  }
}

/** Scan state, so a long run can stop and resume without redoing work. */
export class ScanState {
  constructor(path) {
    this.path = path;
    this.data = {
      version: 1,
      startedAt: null,
      updatedAt: null,
      methodsAttempted: {},
      cursors: {},
      checkedAccounts: [],
      hookMints: [],
      hookPrograms: [],
    };
  }

  async load() {
    if (!existsSync(this.path)) return this;
    try {
      const loaded = JSON.parse(await readFile(this.path, 'utf8'));
      this.data = { ...this.data, ...loaded };
    } catch (err) {
      console.error(`[state] could not read ${this.path}, starting fresh: ${err.message}`);
    }
    return this;
  }

  async save() {
    this.data.updatedAt = new Date().toISOString();
    await writeFile(this.path, JSON.stringify(this.data, null, 2), 'utf8');
  }
}
