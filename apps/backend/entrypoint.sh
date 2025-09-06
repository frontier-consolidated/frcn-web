#!/usr/bin/env bash

pnpm db:deploy
NODE_ENV=production pnpm start
