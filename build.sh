#!/usr/bin/env bash

declare -a env_files=(".backend" ".web" ".database")

function copyFiles() {
    cp docker-compose.yml $1

    mkdir -p "$1/scripts"
    cp -r ./scripts "$1"
    rm -rf "$1/scripts/deploy"

    mkdir -p "$1/env"
    for f in "${env_files[@]}"
    do
        touch "$1/env/$f"
    done
}

function checkFiles() {
    for f in "${env_files[@]}"
    do
        if [[ -z $(grep '[^[:space:]]' "$1/env/$f") ]]; then
            printf "Env file $1/env/$f is empty"
            exit
        fi
    done
}

function build() {
    docker build -t "events.frcn.space/backend" --target backend .
    docker build -t "events.frcn.space/web" --target web .
}

if [ $1 = "run" ]; then
    build
fi