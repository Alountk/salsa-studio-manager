# salsa_studio_manager

Web application for managing a salsa dance studio: scheduling, class creation by the
hour, student enrollment, and billing.

**Current stage**: design. The functional scope is expressed as three high-fidelity
UI designs authored in Google Stitch, each covering one end-to-end user flow. No
application code exists yet.

## Scope

The studio runs recurring and one-off classes taught by several teachers in a small
number of rooms. The product has to answer four questions well:

1. **Who is this person?** — students, teachers, and studio admins see different things.
2. **When is there a class, and where?** — a calendar over rooms, teachers, and hours.
3. **How is a class created for a specific hour block?** — duration, capacity, price.
4. **Who owes what?** — single-class charges, class packs, monthly subscriptions, invoices.

## Design flows

| # | Design | Flow | Screens | Flow doc | Stitch project |
| - | ------ | ---- | ------- | -------- | -------------- |
| 1 | Access and users | login, sign-up, roles, password recovery, profile | 7 | [01-access-and-users.md](docs/flows/01-access-and-users.md) | `6775861207096503195` |
| 2 | Calendar and classes | calendar views, availability, create class by hours, booking, attendance | 8 | [02-calendar-and-classes.md](docs/flows/02-calendar-and-classes.md) | `7073475385354350392` |
| 3 | Billing | pricing and class packs, single charge, subscription, invoices, revenue panel | 8 | [03-billing.md](docs/flows/03-billing.md) | `2093881141495994042` |

## Layout

```
DESIGN.md          The design system Stitch generates from (YAML frontmatter + prose)
designs/           23 exported screens: <id>.html and <id>.png per screen, plus manifest.json
designs/01-acceso-y-usuarios/    Design 1 artifacts
designs/02-calendario-y-clases/  Design 2 artifacts
designs/03-facturacion/          Design 3 artifacts
docs/flows/        One document per design: screens, walkthroughs, edge paths, open questions
scripts/           Reproducible generator and exporter for the Stitch MCP server
odd/tasks/         ODD task tracking for this feature
```

## Tooling

The designs are produced through the **Google Stitch MCP server**
(`https://stitch.googleapis.com/mcp`), registered in Pi's user-level MCP
configuration as the `stitch` server and verified with `pi mcp list`. Authentication
uses the `STITCH_API_KEY` environment variable; no credential is stored in this
repository.

## Reproducing or extending the designs

```bash
cd scripts && npm install
node scripts/generate-designs.mjs --setup    # projects + design systems
node scripts/generate-designs.mjs           # all 23 screens (idempotent, resumable)
node scripts/export-designs.mjs             # download HTML + PNG into designs/
```

Screens are declared in `scripts/design-plan.mjs`; add an entry there and re-run the
generator to produce only what is missing.
