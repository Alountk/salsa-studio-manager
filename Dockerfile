# Docker image for the salsa studio billing tool (spec S5 — Dokploy).
#
# Deliberately NOT `output: "standalone"`: `docker exec pnpm seed` /
# `pnpm change-password` run tsx scripts against the live database, and the
# standalone bundle does not trace CLI tooling (ledger ruling, T13). `next
# start` over a production node_modules serves the app and keeps exec tools
# working in the same container.

FROM node:22-slim AS build
RUN npm i -g pnpm@12.18.0
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:22-slim AS runner
RUN npm i -g pnpm@12.18.0 \
 && apt-get update \
 && apt-get install -y --no-install-recommends sqlite3 \
 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production \
    DATABASE_PATH=/data/studio.db
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/.next ./.next
COPY public ./public
COPY scripts ./scripts
COPY src/lib ./src/lib
COPY tsconfig.json ./
EXPOSE 3000
CMD ["pnpm", "start"]
