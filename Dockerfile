FROM node:23-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG PUBLIC_POSTHOG_KEY

WORKDIR /app
COPY . /app

RUN corepack enable

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ENV PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

RUN rm -rf \
    /app/src \
    /app/static \
    /app/docker-compose.yml \
    /app/Dockerfile \
    /app/tsconfig.json
RUN rm -rf .[!.]* ..?*

EXPOSE 3000
CMD [ "pnpm", "start" ]
