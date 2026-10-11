#!/usr/bin/env node
/**
 * Thin CLI over the Google Stitch MCP server (https://stitch.googleapis.com/mcp).
 *
 * Authentication is read from the STITCH_API_KEY environment variable; no
 * credential is ever written to disk or passed as an argument.
 *
 * Usage:
 *   node scripts/stitch-cli.mjs tools
 *   node scripts/stitch-cli.mjs projects
 *   node scripts/stitch-cli.mjs screens <projectId>
 *   node scripts/stitch-cli.mjs call <toolName> '<jsonArgs>'
 *   node scripts/stitch-cli.mjs call <toolName> @path/to/args.json
 */
import { readFile } from "node:fs/promises";
import { StitchToolClient } from "@google/stitch-sdk";

const apiKey = process.env.STITCH_API_KEY;
if (!apiKey) {
  console.error("STITCH_API_KEY is not set.");
  process.exit(2);
}

const [, , command, ...rest] = process.argv;
const client = new StitchToolClient({ apiKey });

function out(value) {
  console.log(JSON.stringify(value, null, 2));
}

async function readArgs(spec) {
  if (!spec) return {};
  if (spec.startsWith("@")) return JSON.parse(await readFile(spec.slice(1), "utf8"));
  return JSON.parse(spec);
}

try {
  switch (command) {
    case "tools": {
      const { tools } = await client.listTools();
      out(tools.map((t) => t.name));
      break;
    }
    case "projects": {
      out(await client.callTool("list_projects", {}));
      break;
    }
    case "screens": {
      out(await client.callTool("list_screens", { projectId: rest[0] }));
      break;
    }
    case "call": {
      const [tool, spec] = rest;
      const args = await readArgs(spec);
      const started = Date.now();
      const result = await client.callTool(tool, args);
      console.error(`[stitch-cli] ${tool} finished in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      out(result);
      break;
    }
    default:
      console.error("Usage: stitch-cli.mjs <tools|projects|screens|call> [...]");
      process.exit(2);
  }
} finally {
  await client.close();
}
