---
layout: post
categories: [development, svelte]
tags: [svelte, setup]
title:  "Setup dev environment Svelte"
authors: [hydor112]
---
**Requirements**
- [pnpm](https://pnpm.io/installation) 8.15.1 or newer
- [nodejs](https://nodejs.org/en/download/current) 20.11.0 or newer
- [postgresql](https://www.postgresql.org/download/)
- Discord Bot with Administrator on any of your servers
  - In OAuth2 add redirect 
    - ```http://localhost:15401/oauth/callback``` for Development
    - ```Insert Official Domain``` for live WIP
  - Invitation Link with the right permission
    - ```https://discord.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=395137436736&INSERT_REDIRECT_URI```
      - Replace "INSERT_CLIENT_ID_HERE" with your Bot Client ID (OAUTH2)
      - Replace "INSERT_REDIRECT_URI" with one of the OAuth2redirect uris

**Clone the repo**
- ```git clone git@github.com:frontier-consolidated/frcn-web.git```


**Prepare Svelte**
- Installing and compiling ```pnpm run setup```
- Prepare Database ```pnpm run db-migrate``` in ./apps/backend
- run ```pnpm run backend:dev```
- run ```pnpm run backend:web```

If Sharp Error appears run ``` pnpm env use --global 21```
