---
layout: post
category: development
tags: [jekyll, svelte, setup]
title:  "Setup dev environment"
authors: [hydor112]
---
**Requirements**
- Svelte-framwork
  - [pnpm](https://pnpm.io/installation) 8.15.1 or newer
  - [nodejs](https://nodejs.org/en/download/current) 20.11.0 or newer
  - [postgresql](https://www.postgresql.org/download/)
  - Discord Bot with Administrator on any of your servers
    - In OAuth2 add redirect ```http://localhost:15401/oauth/callback```
    - Add the Intent option WIP!!!
- Jekyll-framework (docs)
  - [Ruby](https://rubyinstaller.org/) (with devkit) | ```choco install ruby``` (Chocolatey install) 3.3.0 or newer with msys2

**Start with cloning the repo.**
- ```git clone git@github.com:frontier-consolidated/frcn-web.git```

**Preparing Svelte (run from root directory until said otherwise)**
- Installing packages ```pnpm install```
- Building remaining packages ```pnpm --filter=shared build```
- add your discord information in ```./apps/backend/prisma/seeds/00001-User.ts```
- Prepare Database ```pnpm run db-migrate``` in ./apps/backend
- run ```pnpm run backend:dev```
- run ```pnpm run backend:web```

Your Svelte should be working lookup [LinkToErrormd] if you encounter any errors

**Preparing Jekyll**
- ```cd ./docs/```
- ```bundler install```
- ```bundle exec jekyll serve --livereload```

Ruby works best with powershell or cmd
If exec fails add execute in cmd ```bundle add webrick```
