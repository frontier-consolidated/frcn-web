FROM node:23-bookworm AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG PUBLIC_POSTHOG_KEY
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

WORKDIR /app
COPY . /app

RUN corepack enable

FROM base AS aws-auth
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends python3 curl zip

RUN curl --insecure "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_DEFAULT_REGION=eu-central-1

RUN aws codeartifact --region eu-central-1 login --tool npm --repository l3dev --domain packages --namespace @l3dev

FROM aws-auth AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM aws-auth AS build
ENV PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
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
