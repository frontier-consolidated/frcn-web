FROM node:20.8-alpine AS base
# build args
ARG SRC=/app/src
ARG PROD=/prod
# envs
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=80

RUN corepack enable
RUN apk add --update curl git


# Build
FROM base AS build
COPY . $SRC
WORKDIR $SRC

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter=backend db-generate

RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod $PROD/backend
RUN pnpm deploy --filter=web --prod $PROD/web

# Copy generated prisma client to backend node_modules
RUN find . -type d -name '.prisma' | xargs cp -rt $PROD/backend/node_modules

# Delete environment files since we only needed them for building
RUN find $PROD -name ".env" -exec rm {} \;
RUN find $PROD -name ".env.*" -exec rm {} \;

# Delete source files
RUN rm -rf $PROD/backend/src
RUN rm -rf $PROD/web/src


# Backend App
FROM base AS backend
COPY --from=build $PROD/backend $PROD/backend
COPY --from=build $SRC/scripts/backend/entrypoint.sh $PROD/backend
WORKDIR $PROD/backend
EXPOSE $PORT
ENTRYPOINT ["sh", "entrypoint.sh"]


# Web App
FROM base AS web
COPY --from=build $PROD/web $PROD/web
WORKDIR $PROD/web
EXPOSE $PORT
CMD ["pnpm", "start"]