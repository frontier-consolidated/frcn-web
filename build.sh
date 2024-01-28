#!/usr/bin/env bash

function copyFiles() {
    cp docker-compose.yml $1

    mkdir -p "$1/scripts"
    cp -r ./scripts "$1/scripts"
    rm "$1/scripts/deploy.sh"

    mkdir -p "$1/env"
    touch "$1/env/.backend"
    touch "$1/env/.web"
    touch "$1/env/.database"
}

function build() {
    docker build -t "events.frcn.space/backend" --target backend .
    docker build -t "events.frcn.space/web" --target web .
}

if [ $1 = "run" ]; then
    build
fi