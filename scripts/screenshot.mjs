#!/usr/bin/env node
/**
 * Visual spot-check for Design 1.
 *
 * Starts nothing itself: point it at a running server, and it screenshots each
 * implemented route at the 1440px desktop canvas DESIGN.md specifies, writing
 * PNGs under designs/verification/ for side-by-side comparison with the
 * exported Stitch screens in designs/01-acceso-y-usuarios/.
 *
 * The playwright module is resolved from an explicit path because the
 * repository does not ship a browser dependency; set PLAYWRIGHT_MODULE_DIR to
 * override.
 *
 * Usage: node scripts/screenshot.mjs [baseUrl]
 */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = `${ROOT}designs/verification`;
const BASE = process.argv[2] ?? "http://localhost:3100";
const PW_DIR =
  process.env.PLAYWRIGHT_MODULE_DIR ??
  "/Users/alountk/.npm/_npx/9833c18b2d85bc59/node_modules";

const ROUTES = [
  { id: "01-inicio-sesion", path: "/login" },
  { id: "02-registro-alumno", path: "/registro" },
  { id: "03-recuperar-contrasena", path: "/recuperar" },
  { id: "04-inicio-alumno", path: "/" },
  { id: "05-inicio-profesor", path: "/?rol=profesor" },
  { id: "06-inicio-administracion", path: "/?rol=administracion" },
  { id: "07-perfil-y-ajustes", path: "/ajustes" },
  // Design 2 — appended as each screen lands
  { id: "01-calendario-mes", path: "/calendario" },
  { id: "02-calendario-semana", path: "/calendario?vista=semana" },
  { id: "03-detalle-clase", path: "/calendario?vista=semana&clase=c-m2" },
  { id: "04-mis-reservas", path: "/calendario/mis-reservas" },
];

const require = createRequire(`${PW_DIR}/`);
const { chromium } = require("playwright");

/**
 * The cached playwright build and the installed browser revisions do not line
 * up, so the script can point at an already-downloaded Chromium instead of
 * fetching another ~170MB. Pass CHROMIUM_EXECUTABLE to override; by default it
 * picks the newest revision under the Playwright browser cache.
 */
async function resolveExecutablePath() {
  if (process.env.CHROMIUM_EXECUTABLE) return process.env.CHROMIUM_EXECUTABLE;
  const { readdir, access } = await import("node:fs/promises");
  const cache =
    process.env.PLAYWRIGHT_BROWSERS_PATH ??
    `${process.env.HOME}/Library/Caches/ms-playwright`;
  let entries = [];
  try {
    entries = await readdir(cache);
  } catch {
    return undefined;
  }

  /* Revisions are named chromium-<n>; the app bundle inside varies
     (chrome-mac / chrome-mac-arm64, Chromium.app / Google Chrome for
     Testing.app), so search for the Contents/MacOS binary instead of
     guessing the path. */
  const revisions = entries
    .filter((name) => /^chromium-\d+$/.test(name))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));

  async function findBinary(dir, depth) {
    if (depth > 5) return undefined;
    let items;
    try {
      items = await readdir(dir, { withFileTypes: true });
    } catch {
      return undefined;
    }
    if (dir.endsWith("Contents/MacOS")) {
      const binary = items.find((item) => item.isFile());
      if (binary) return `${dir}/${binary.name}`;
    }
    for (const item of items) {
      if (!item.isDirectory()) continue;
      const found = await findBinary(`${dir}/${item.name}`, depth + 1);
      if (found) return found;
    }
    return undefined;
  }

  for (const revision of revisions) {
    const binary = await findBinary(`${cache}/${revision}`, 0);
    if (binary) {
      try {
        await access(binary);
        return binary;
      } catch {
        /* keep looking */
      }
    }
  }
  return undefined;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const executablePath = await resolveExecutablePath();
  if (executablePath) console.log(`  Chromium: ${executablePath}`);
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results = [];
  for (const route of ROUTES) {
    const url = `${BASE}${route.path}`;
    const consoleErrors = [];
    const onError = (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    };
    page.on("console", onError);

    const response = await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(250); // let webfonts settle before capture

    /*
     * Resize the viewport to the full document height before shooting. A
     * fullPage capture scrolls and stitches, which drags any position:sticky
     * element (the week grid's day header, the app shell's top bar) to its
     * stuck offset mid-capture and renders the page as if it were broken. With
     * a viewport tall enough to hold the whole document there is nothing to
     * scroll and the sticky elements stay where a reader sees them.
     */
    const height = await page.evaluate(() =>
      Math.min(Math.max(document.body.scrollHeight, 900), 24000),
    );
    await page.setViewportSize({ width: 1440, height });
    await page.waitForTimeout(150);

    const path = `${OUT}/${route.id}.png`;
    await page.screenshot({ path, fullPage: true });
    page.off("console", onError);

    const record = {
      id: route.id,
      path: route.path,
      status: response?.status() ?? 0,
      title: await page.title(),
      consoleErrors,
      file: `designs/verification/${route.id}.png`,
    };
    results.push(record);
    console.log(
      `  ${record.status}  ${route.path.padEnd(26)} -> ${record.file}` +
        (consoleErrors.length ? `  (${consoleErrors.length} errores de consola)` : ""),
    );
  }

  await browser.close();
  await writeFile(`${OUT}/manifest.json`, `${JSON.stringify(results, null, 2)}\n`);
  const failed = results.filter((r) => r.status !== 200 || r.consoleErrors.length > 0);
  console.log(`\n${results.length} rutas capturadas, ${failed.length} con fallos`);
  if (failed.length) process.exitCode = 1;
}

await main();
