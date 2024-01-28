#!/usr/bin/env bash

function copyFiles() {
    cp docker-compose.yml $1

    mkdir -p "$1/scripts"
    cp apps/backend/entrypoint.sh "$1/scripts"
}

function build() {
    docker build -t "events.frcn.space/backend" --target backend .
    docker build -t "events.frcn.space/web" --target web .
}

if [ $1 = "run" ]; then
    build
fi