#!/usr/bin/env bash

WORKING_DIR="$(pwd)"
TEMP_DIR="$WORKING_DIR/temp"
BUILD_NAME="build"
GIT_URL="https://github.com/frontier-consolidated/frcn-events-app.git"
GIT_BRANCH="main"


# Remove previous builds
rm -rfv "$TEMP_DIR"

# Clone repository
cd "$TEMP_DIR" || exit
git clone "$GIT_URL" "$BUILD_NAME"

cd "$BUILD_NAME" || exit

git fetch
sleep 1s
git checkout "$GIT_BRANCH"
sleep 2s

# Build images
source "build.sh"
build

copyFiles $WORKING_DIR

cd "$WORKING_DIR" || exit

# Stop current services and restart with new images
docker compose down
docker compose up -d