#!/usr/bin/env node
/**
 * Export every generated Stitch screen into this repository as a local artifact.
 *
 * For each screen recorded in designs/manifest.json it downloads the screen's
 * HTML source and its rendered screenshot PNG from the signed URLs returned by
 * the generation call, and writes them under designs/<project-dir>/.
 *
 * The signed URLs come from the Stitch API response, so run this while they are
 * still valid; a later refresh means regenerating or re-fetching the screen.
 *
 * Usage: node scripts/export-designs.mjs
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { projects } from "./design-plan.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST_PATH = `${ROOT}designs/manifest.json`;
const CONCURRENCY = 6;

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function download(url, path) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.slice(0, 80)}...`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path, buf);
  return buf.length;
}

async function pool(items, limit, worker) {
  const queue = [...items];
  const out = [];
  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, async () => {
      while (queue.length) out.push(await worker(queue.shift()));
    }),
  );
  return out;
}

async function main() {
  const manifest = await readJson(MANIFEST_PATH);
  const dirByKey = Object.fromEntries(projects.map((p) => [p.key, p.dir]));

  const jobs = [];
  for (const [key, rec] of Object.entries(manifest.projects)) {
    const dir = `${ROOT}designs/${dirByKey[key]}`;
    await mkdir(dir, { recursive: true });
    for (const screen of rec.screens) {
      jobs.push({ key, dir, screen });
    }
  }

  log(`exporting ${jobs.length} screens from ${Object.keys(manifest.projects).length} projects`);

  const results = await pool(jobs, CONCURRENCY, async ({ key, dir, screen }) => {
    const base = `${dir}/${screen.id}`;
    const written = {};
    try {
      if (screen.htmlUrl) written.html = await download(screen.htmlUrl, `${base}.html`);
      if (screen.imageUrl) written.png = await download(screen.imageUrl, `${base}.png`);
      log(`${key}/${screen.id}: ${Object.entries(written).map(([k, v]) => `${k} ${(v / 1024).toFixed(0)}KB`).join(", ") || "nothing"}`);
      return { key, id: screen.id, ...written };
    } catch (err) {
      log(`ERROR ${key}/${screen.id}: ${err.message}`);
      return { key, id: screen.id, error: err.message };
    }
  });

  const failed = results.filter((r) => r.error);
  const html = results.filter((r) => r.html).length;
  const png = results.filter((r) => r.png).length;
  log(`done: ${html} html, ${png} png, ${failed.length} failed`);

  const summary = {
    exportedAt: new Date().toISOString(),
    screens: results.length,
    html,
    png,
    failed: failed.map((f) => `${f.key}/${f.id}`),
  };
  await writeFile(`${ROOT}designs/export-summary.json`, `${JSON.stringify(summary, null, 2)}\n`);
  if (failed.length) process.exitCode = 1;
}

function log(msg) {
  console.error(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

await main();
