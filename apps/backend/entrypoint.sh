#!/usr/bin/bash

pnpm db:deploy
NODE_ENV=production pnpm start
