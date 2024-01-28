#!/usr/bin/env bash

WORKING_DIR="$(pwd)"
TEMP_DIR="$WORKING_DIR/temp"
BUILD_NAME="build"
APP_DIR="$WORKING_DIR/$1"
GIT_URL="https://github.com/frontier-consolidated/frcn-events-app.git"
GIT_BRANCH="$1"


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

copyFiles $APP_DIR

cd "$APP_DIR" || exit

if [ -f "$APP_DIR/docker-compose.yml" ]; then
    # Stop current services and restart with new images
    docker compose down
    docker compose up -d
else
    printf "docker-compose.yml not found at $APP_DIR"
    exit 1
fi
