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

FROM base AS installer

WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=${PNPM_STORE} \
    pnpm install --frozen-lockfile

FROM base AS prod-installer

WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=${PNPM_STORE} \
    pnpm install --prod --frozen-lockfile

FROM installer AS builder

ARG PUBLIC_POSTHOG_KEY
ENV PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY

RUN pnpm check
RUN pnpm build

FROM base AS prod

WORKDIR /app

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY --from=prod-installer /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT [ "/app/entrypoint.sh" ]
