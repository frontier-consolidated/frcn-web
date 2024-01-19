FROM node:20.8-alpine AS base
# build args
ARG SRC=/app/src
ARG PROD=/prod
# envs
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apk add --update curl git


# Build
FROM base AS build
COPY . $SRC
WORKDIR $SRC
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=backend --prod $PROD/backend
RUN pnpm deploy --filter=web --prod $PROD/web


# Backend App
FROM base AS backend
COPY --from=build $PROD/backend $PROD/backend
WORKDIR $PROD/backend
EXPOSE $PORT
CMD ["pnpm", "start"]


# Web App
FROM base AS web
COPY --from=build $PROD/web $PROD/web
WORKDIR $PROD/web
EXPOSE $PORT
CMD ["pnpm", "start"]