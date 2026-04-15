# syntax=docker/dockerfile:1.7

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    CI=1
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate
WORKDIR /workspace

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile=false --ignore-scripts

FROM deps AS build
COPY packages/shared packages/shared
COPY apps/worker apps/worker
RUN pnpm --filter @lingora/shared run typecheck || true
RUN pnpm --filter @lingora/worker run build

FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN useradd --system --create-home --uid 1001 lingora
COPY --from=build /workspace/apps/worker/dist ./dist
COPY --from=build /workspace/apps/worker/package.json ./
COPY --from=build /workspace/packages/shared ./packages/shared
COPY --from=build /workspace/node_modules ./node_modules
USER lingora
CMD ["node", "dist/index.js"]
