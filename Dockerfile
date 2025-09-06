FROM node:22-trixie AS base

# build args
ARG SRC=/app/src
ARG PROD=/prod

# envs
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=80
ENV NODE_ENV=production

RUN corepack enable
RUN apt install -y --update curl git

# Build
FROM base AS build
COPY . $SRC
WORKDIR $SRC

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Remove .gitignore files as pnpm will respect these by default
RUN find . -name ".gitignore" -exec rm {} \;

# Build custom adapter
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --config.dedupe-peer-dependents=false --filter ./packages/adapter install --frozen-lockfile
RUN pnpm --filter ./packages/adapter build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter=backend db:generate

RUN pnpm run --filter=\!./packages/adapter build
RUN pnpm deploy --filter=backend --prod $PROD/backend
RUN pnpm deploy --filter=web --prod $PROD/web

# Delete environment files since we only needed them for building
RUN find $PROD -name ".env" -exec rm {} \;
RUN find $PROD -name ".env.*" -exec rm {} \;

# Cleanup backend folder
RUN rm -rf $PROD/backend/src

# Cleanup web folder
RUN rm -rf $PROD/web/src && \
    rm -rf $PROD/web/server && \
    rm -rf $PROD/web/static && \
    rm -rf $PROD/web/.svelte-kit && \
    rm -f $PROD/web/.eslintrc $PROD/web/codegen.yml \
        $PROD/web/postcss.config.cjs $PROD/web/svelte.config.js \
        $PROD/web/tailwind.config.cjs $PROD/web/tsconfig.json \
        $PROD/web/vite.config.ts


# Backend App
FROM base AS backend
COPY --from=build $PROD/backend $PROD/backend
COPY --from=build $SRC/apps/backend/entrypoint.sh $PROD/backend
WORKDIR $PROD/backend
EXPOSE $PORT
ENTRYPOINT ["sh", "entrypoint.sh"]


# Web App
FROM base AS web
COPY --from=build $PROD/web $PROD/web
WORKDIR $PROD/web
EXPOSE $PORT
CMD ["pnpm", "start"]
