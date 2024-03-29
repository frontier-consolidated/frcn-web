#!/usr/bin/env bash

export PRISMA_SKIP_POSTINSTALL_GENERATE=true

BUILD_DIR=$1
HOSTNAME=$2

mkdir -p $BUILD_DIR

# Remove .gitignore files as pnpm will respect these by default
find . -name ".gitignore" -exec rm {} \;

pnpm --config.dedupe-peer-dependents=false --filter ./packages/adapter install
pnpm --filter ./packages/adapter build
pnpm install --frozen-lockfile

pnpm --filter=backend db-generate

echo "VITE_API_BASEURL=https://$HOSTNAME" > apps/web/.env.production

pnpm run --filter=\!./packages/adapter build
pnpm deploy --filter=backend --prod $BUILD_DIR/backend
pnpm deploy --filter=web --prod $BUILD_DIR/web

# Copy generated prisma client to backend node_modules
find . -type d -name '.prisma' | xargs cp -rt $BUILD_DIR/backend/node_modules

# Delete environment files since we only needed them for building
find $BUILD_DIR -name ".env" -exec rm {} \;
find $BUILD_DIR -name ".env.*" -exec rm {} \;

# Cleanup backend folder
rm -rf $BUILD_DIR/backend/src

# Cleanup web folder
rm -rf $BUILD_DIR/web/src
rm -rf $BUILD_DIR/web/server
rm -rf $BUILD_DIR/web/static
rm -rf $BUILD_DIR/web/.svelte-kit
rm -f $BUILD_DIR/web/.eslintrc $BUILD_DIR/web/codegen.yml $BUILD_DIR/web/postcss.config.cjs $BUILD_DIR/web/svelte.config.js $BUILD_DIR/web/tailwind.config.cjs $BUILD_DIR/web/tsconfig.json $BUILD_DIR/web/vite.config.ts