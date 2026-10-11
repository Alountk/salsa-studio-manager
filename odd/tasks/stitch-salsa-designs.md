# Feature: stitch-salsa-designs

## Goal

Produce three high-fidelity UI designs with their complete user flows for a salsa
studio management web application, authored in Google Stitch and driven through the
Stitch MCP server. Export the resulting artifacts (screen HTML, screenshots, design
system) into this repository, together with one flow document per design.

Deliverable is design, not application code. No runtime, no framework, no build.

## Non-goals

- Implementing any application code, database model, or API.
- Choosing a production stack.
- Pixel-perfect React/Tailwind conversion (a later feature).

## Acceptance criteria

1. The `stitch` MCP server is registered in Pi and reports a connected state with its
   tools listed.
2. Three Stitch projects exist, one per design, each named after this repository.
3. Every screen listed in the three flow documents exists in the corresponding Stitch
   project, and the flow documents name them.
4. Exported artifacts live under `designs/`, and `docs/flows/` holds one document per
   design describing the screens, the entry point, and the step-by-step flow.
5. No credential is written into this repository.

## Tasks

| # | Task | Status | Evidence |
| - | ---- | ------ | -------- |
| 1 | Scaffold project layout and ODD tracking | done | `README.md`, `odd/tasks/`, `docs/flows/`, `designs/` |
| 2 | Register the Stitch MCP server in Pi and verify connection | done | `pi mcp list` → `stitch: connected, 15 tools` |
| 3 | Design 1 — Access and users: create Stitch project and generate flow screens | done | project `6775861207096503195`, design system `ef9fee23b77b4be1a75efdc46fa1d84b`, 7/7 screens |
| 4 | Design 2 — Calendar and classes: create Stitch project and generate flow screens | done | project `7073475385354350392`, design system `8b3e71b2135846a490d9c4e258d764e6`, 8/8 screens |
| 5 | Design 3 — Billing: create Stitch project and generate flow screens | done | project `2093881141495994042`, design system `525ed1d326274f1b81ab1966c0fb119f`, 8/8 screens |
| 6 | Export design artifacts into `designs/` | done | 23 `.html` + 23 `.png`, 0 failed (`designs/export-summary.json`) |
| 7 | Write the three flow documents under `docs/flows/` | done | 124 / 143 / 133 lines, 23/23 screens documented |
| 8 | Final verification and close-out report | done | checks below, all green |

## Findings

- **DESIGN.md format.** Stitch does not accept free-form design documentation. The
  project `designTheme` uses YAML frontmatter (`name`, `colors`, `typography`,
  `spacing`) with Material-3-style token names, followed by Markdown sections. The
  repository `DESIGN.md` is written in that exact format so `upload_design_md` can
  consume it and `create_design_system_from_design_md` can derive tokens from it.
- **`selectedScreenInstance` is strictly `{ id, sourceScreen }`.** Passing the extra
  `width`/`height` fields that `upload_design_md` returns is rejected with
  `Request contains an invalid argument`.
- **Generation returns a session payload, not a screen object.** The screen lives at
  `outputComponents[].design.screens[0]` and carries `name`, `prompt`, `title`,
  `htmlCode.downloadUrl`, and `screenshot.downloadUrl`. Reading `name` off the top
  level yields `undefined`.
- **`list_screens` does not enumerate generated screens.** It only returns the
  `DESIGN.md` source screen; `get_project.screenInstances` also stays at 1. Generated
  screens are reachable only by their resource name through `get_screen`. The
  generation response is therefore the only reliable record, which is why the
  manifest is written synchronously per screen and re-running is idempotent.
- **Consequence for a lost response.** A screen whose generation response was not
  persisted has no recoverable identifier and must be regenerated; there is no
  `delete_screen` tool to clean up a duplicate.

## Verification

Automated checks run against the repository after generation; all green:

| Check | Result |
| ----- | ------ |
| Plan screens = manifest screens = exported `.html` = exported `.png`, per project | 7 / 8 / 8 on all four sides |
| Every screen has `htmlUrl` and `imageUrl` in the manifest | 23/23 |
| Artifact paths cited in the three flow documents exist on disk | 23/23 cited, 0 missing |
| Screen ids cited in the flow documents exist in `design-plan.mjs` | 23 cited, 0 unknown |
| Planned screens covered by at least one flow document | 23/23, none uncovered |
| README flow-doc links resolve | 3/3 |
| Raw `STITCH_API_KEY` present anywhere in the repository | 0 files |
| `pi mcp list` still reports the Stitch server | `stitch: connected, 15 tools` |

Spot-checked by rendering: `02-calendario-y-clases/05-crear-clase` shows the duration
stepper (`1 h` / `1,5 h` / `2 h` / Personalizado), the live calendar preview, the
conflict check, and the Spanish copy — on the terracotta/Outfit/Inter tokens from
`DESIGN.md`.

## Known gaps for the next session

- `list_screens` does not enumerate generated screens, so the Stitch projects cannot
  be re-inventoried through the API. `designs/manifest.json` is the only record; keep
  it committed.
- The seven screens generated in the *first* (broken-projection) run of
  `generate-designs.mjs` left orphaned screen resources in project
  `6775861207096503195`. They are not enumerable and there is no `delete_screen`
  tool; the manifest entries were cleared and the screens regenerated, so the
  documented seven are the current ones.
- Whether the generated screens render in the Stitch web UI should be confirmed by
  opening the three projects at `stitch.withgoogle.com` — the API view only ever
  returns the `DESIGN.md` source screen.

## Notes

- Stitch MCP endpoint: `https://stitch.googleapis.com/mcp` (streamable HTTP,
  stateless). Auth header `X-Goog-Api-Key` sourced from `${STITCH_API_KEY}`.
- A Pi session reads `mcp.json` at start; a server added mid-session needs `/reload`
  before its tools are callable from that session.
