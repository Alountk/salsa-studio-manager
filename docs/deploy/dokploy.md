# Deploying with Dokploy

The billing tool runs as a single Docker container with one persistent volume
for its SQLite database (spec S5).

## Service

- **Provider:** Dockerfile (the repository root `Dockerfile`).
- **Port:** `3000` (the image's `next start`).
- **Domain/TLS:** attach your domain in Dokploy; Traefik terminates TLS. The
  app sets the session cookie `secure` in production automatically.

## Environment variables

Set these in Dokploy (names only — values are yours, never commit them):

| Variable | Purpose |
| -------- | ------- |
| `DATABASE_PATH` | Optional. The image already defaults to `/data/studio.db`. |
| `ADMIN_EMAIL` | Email of the single admin account. |
| `ADMIN_PASSWORD` | Initial password. Applied **only when the users table is empty** — later changes go through `change-password`, not this variable. |

## Volume

Mount a named volume at **`/data`**. Everything the container must survive —
the database file — lives there. Docker builds and image updates never touch
it.

## Backup (WAL-safe, runs while the app is live)

The image ships the `sqlite3` CLI for exactly this:

```sh
docker exec <container> sh -c 'mkdir -p /backups && sqlite3 /data/studio.db ".backup /backups/studio-$(date +%F).db" && ls -l /backups'
docker cp <container>:/backups/studio-$(date +%F).db ./studio-backup.db
```

Schedule the first command (host cron or Dokploy task) daily, and copy the
file off the machine afterwards — a backup that only exists on the same disk
as the database is not a backup.

## Restore

1. Stop the service in Dokploy.
2. Replace the database atomically with a one-off container (removing stale
   WAL sidecars is mandatory — a leftover `-wal` from the old file would be
   replayed over the restored backup on the next boot):
   ```sh
   docker run --rm \
     -v <volume>:/d \
     -v "$(pwd)/studio-backup.db":/b:ro \
     alpine sh -c "rm -f /d/studio.db* && cp /b/studio.db /d/studio.db"
   ```
   (`docker exec` cannot be used here: the service container is stopped.)
3. Start the service; open `/login` and verify the data.

> **The first restore must be rehearsed** before you rely on it — the feature's
> closure probe (T14) runs one end to end. An untested backup is not a backup.

## Maintenance commands

```sh
# Demo/development seed (skips itself if students already exist)
docker exec <container> pnpm seed

# Reset the admin password (the replacement for self-service recovery)
docker exec <container> pnpm change-password -- owner@example.com new-password-here
```

> Note: `pnpm` forwards `npm`'s `--` separator to scripts; the CLI drops it,
> so either form works.

## Startup behaviour

On boot the app applies pending migrations, creates the admin from the env vars
if there is no user yet, and generates any due cuota invoices
(`src/instrumentation.ts`). Generation is idempotent — billing pages run it
again on read without ever double-billing.
