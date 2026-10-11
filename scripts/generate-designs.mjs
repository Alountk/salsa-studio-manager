#!/usr/bin/env node
/**
 * Generate the three Salsa Studio Manager design projects in Google Stitch.
 *
 * Reads the plan from ./design-plan.mjs and ./../DESIGN.md, then for every plan
 * project: creates the Stitch project (reusing an existing one with the same
 * title), uploads DESIGN.md as its design theme, derives the project design
 * system from it, and generates every planned screen with that design system.
 *
 * The run is idempotent and resumable: it only creates what the manifest does
 * not already record, and re-running after an interruption continues where it
 * stopped.
 *
 * Usage:
 *   node scripts/generate-designs.mjs --setup     # projects + design systems only
 *   node scripts/generate-designs.mjs --generate  # screens only
 *   node scripts/generate-designs.mjs             # everything
 *   node scripts/generate-designs.mjs --only <key>            # one project
 *   node scripts/generate-designs.mjs --only <key>:<screenId> # one screen
 *
 * Requires STITCH_API_KEY in the environment.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { StitchToolClient } from "@google/stitch-sdk";
import { projects, BASE_PROMPT, totalScreens } from "./design-plan.mjs";

if (!process.env.STITCH_API_KEY) {
  console.error("STITCH_API_KEY is not set.");
  process.exit(2);
}

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST_PATH = `${ROOT}designs/manifest.json`;
const DESIGN_MD_PATH = `${ROOT}DESIGN.md`;
const CONCURRENCY = 3;
const MODEL_ID = "GEMINI_3_8_FLASH";

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const SETUP = flag("--setup") || (!flag("--setup") && !flag("--generate"));
const GENERATE = flag("--generate") || (!flag("--setup") && !flag("--generate"));
const ONLY = value("--only");

const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });

function log(msg) {
  console.error(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return { projects: {} };
  }
}

async function saveManifest(manifest) {
  await mkdir(`${ROOT}designs`, { recursive: true });
  manifest.updatedAt = new Date().toISOString();
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

/** Runs `worker` over `items` with at most `limit` in flight, logging as it goes. */
async function pool(items, limit, worker) {
  const queue = [...items];
  const results = [];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      try {
        results.push(await worker(item));
      } catch (err) {
        results.push({ error: err?.message ?? String(err), item });
      }
    }
  });
  await Promise.all(runners);
  return results;
}

async function findProjectByTitle(title) {
  const res = await client.callTool("list_projects", {});
  const list = res?.projects ?? [];
  return list.find((p) => p.title === title);
}

function projectIdOf(project) {
  return String(project.name).replace(/^projects\//, "");
}

async function ensureProject(entry, manifest) {
  const existing = await findProjectByTitle(entry.title);
  const project = existing ?? (await client.callTool("create_project", { title: entry.title }));
  const projectId = projectIdOf(project);
  const rec = (manifest.projects[entry.key] ??= {
    title: entry.title,
    projectId,
    summary: entry.summary,
    assetId: null,
    designMdScreenInstance: null,
    screens: [],
  });
  rec.projectId = projectId;
  log(`${entry.key}: project ${projectId} (${existing ? "reused" : "created"})`);
  await saveManifest(manifest);
  return rec;
}

async function ensureDesignSystem(entry, rec, manifest) {
  const info = await client.callTool("get_project", { name: `projects/${rec.projectId}` });

  if (!info.screenInstances?.length) {
    const designMd = await readFile(DESIGN_MD_PATH, "utf8");
    const b64 = Buffer.from(designMd, "utf8").toString("base64");
    const uploaded = await client.callTool("upload_design_md", {
      projectId: rec.projectId,
      designMdBase64: b64,
    });
    rec.designMdScreenInstance = {
      id: uploaded.id,
      sourceScreen: uploaded.sourceScreen,
    };
    log(`${entry.key}: DESIGN.md uploaded (${uploaded.id})`);
    await saveManifest(manifest);
  }

  if (!rec.assetId) {
    const listed = await client.callTool("list_design_systems", { projectId: rec.projectId });
    const first = listed.designSystems?.[0];
    if (first?.name) {
      rec.assetId = String(first.name).replace(/^assets\//, "");
      log(`${entry.key}: design system reused ${rec.assetId}`);
      await saveManifest(manifest);
      return rec;
    }
    const instance =
      rec.designMdScreenInstance ?? {
        id: info.screenInstances[0].id,
        sourceScreen: info.screenInstances[0].sourceScreen,
      };
    const created = await client.callTool("create_design_system_from_design_md", {
      projectId: rec.projectId,
      selectedScreenInstance: { id: instance.id, sourceScreen: instance.sourceScreen },
    });
    rec.assetId = created.assetId;
    log(`${entry.key}: design system ${rec.assetId}`);
    await saveManifest(manifest);
  }
  return rec;
}

async function generateScreen(entry, rec, screen, manifest) {
  const started = Date.now();
  const args = {
    projectId: rec.projectId,
    prompt: `${BASE_PROMPT}\n\n${screen.prompt}`,
    deviceType: "DESKTOP",
    modelId: MODEL_ID,
  };
  if (rec.assetId) args.designSystem = rec.assetId;

  const generated = await client.callTool("generate_screen_from_text", args);
  // The tool returns a session payload; the screen lives at the projection
  // path outputComponents[].design.screens[0] and carries its own download URLs.
  const projected = (generated.outputComponents ?? [])
    .map((c) => c?.design?.screens)
    .find((screens) => screens != null)?.[0];
  if (!projected?.name) {
    throw new Error(`no screen projection for ${screen.id}`);
  }

  const record = {
    id: screen.id,
    title: screen.title,
    screenId: String(projected.name).split("/screens/").pop(),
    name: projected.name,
    stitchTitle: projected.title ?? null,
    htmlUrl: projected.htmlCode?.downloadUrl ?? null,
    imageUrl: projected.screenshot?.downloadUrl ?? null,
    width: projected.width ?? null,
    height: projected.height ?? null,
    durationMs: Date.now() - started,
  };

  rec.screens = rec.screens.filter((s) => s.id !== screen.id);
  rec.screens.push(record);
  await saveManifest(manifest);
  log(
    `${entry.key} / ${screen.id} done in ${(record.durationMs / 1000).toFixed(1)}s` +
      `${record.htmlUrl ? " +html" : " NO-html"}${record.imageUrl ? " +img" : " NO-img"}`,
  );
  return record;
}

async function main() {
  const manifest = await loadManifest();

  let planned = projects;
  if (ONLY) {
    const [key, screenId] = ONLY.split(":");
    planned = projects.filter((p) => p.key === key);
    if (screenId) {
      planned = planned.map((p) => ({ ...p, screens: p.screens.filter((s) => s.id === screenId) }));
    }
  }

  for (const entry of planned) {
    if (SETUP) {
      const rec = await ensureProject(entry, manifest);
      await ensureDesignSystem(entry, rec, manifest);
    }
    if (!GENERATE) continue;

    const rec = manifest.projects[entry.key];
    if (!rec) throw new Error(`Project ${entry.key} not set up. Run with --setup first.`);

    const done = new Set(rec.screens.map((s) => s.id));
    const pending = entry.screens.filter((s) => !done.has(s.id));
    if (!pending.length) {
      log(`${entry.key}: all ${entry.screens.length} screens already generated`);
      continue;
    }
    log(`${entry.key}: generating ${pending.length}/${entry.screens.length} screens`);

    const results = await pool(pending, CONCURRENCY, (screen) =>
      generateScreen(entry, rec, screen, manifest),
    );
    const failed = results.filter((r) => r?.error);
    for (const f of failed) log(`ERROR ${f.item?.id}: ${f.error}`);
    log(`${entry.key}: ${pending.length - failed.length} ok, ${failed.length} failed`);
    await saveManifest(manifest);
  }

  const counts = Object.fromEntries(
    Object.entries(manifest.projects).map(([k, v]) => [k, `${v.screens.length} screens`]),
  );
  log(`manifest: ${JSON.stringify(counts)} of ${totalScreens} planned`);
}

try {
  await main();
} finally {
  await client.close();
}
