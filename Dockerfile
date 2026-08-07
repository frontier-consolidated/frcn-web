ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm AS base

# PNPM
ARG PNPM_VERSION=10
ARG PNPM_STORE=/pnpm/store

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest --force
RUN corepack enable
RUN corepack prepare pnpm@${PNPM_VERSION} --activate

RUN --mount=type=cache,id=pnpm,target=${PNPM_STORE} \
    pnpm config set store-dir ${PNPM_STORE}

ARG PUBLIC_POSTHOG_KEY

WORKDIR /app
COPY . .

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
ENV PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm check
RUN pnpm build

FROM base AS prod
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

RUN rm -rf \
    /app/src \
    /app/static \
    /app/docker-compose.yml \
    /app/Dockerfile \
    /app/tsconfig.json
RUN rm -rf .[!.]* ..?*

COPY entrypoint.sh /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT [ "/app/entrypoint.sh" ]
