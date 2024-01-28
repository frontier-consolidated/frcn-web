#!/usr/bin/env bash

GIT_URL="$1"
GIT_BRANCH="$2"

printf "Deploying from $GIT_URL $GIT_BRANCH"

WORKING_DIR="$(pwd)"
TEMP_DIR="$WORKING_DIR/temp"
BUILD_NAME="build"
APP_DIR="$WORKING_DIR/$GIT_BRANCH"


# Remove previous builds
rm -rfv "$TEMP_DIR"

# Clone repository
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR" || exit
git clone "$GIT_URL" "$BUILD_NAME"

cd "$BUILD_NAME" || exit

git fetch
sleep 1s
git checkout "$GIT_BRANCH"
sleep 2s

# Build images
source "build.sh"
build $GIT_BRANCH

# Copy necessary files e.g. docker-compose.yml to APP_DIR
mkdir -p "$APP_DIR"
copyFiles $APP_DIR

# Check if files are ready to run app
checkFiles $APP_DIR
cd "$APP_DIR" || exit

if [ -f "$APP_DIR/docker-compose.yml" ]; then
    # Stop current services and restart with new images
    GIT_BRANCH=$GIT_BRANCH docker compose down
    GIT_BRANCH=$GIT_BRANCH docker compose up -d
else
    printf "docker-compose.yml not found at $APP_DIR"
    exit 1
fi
