---
layout: post
categories: [jekyll, development]
tags: [jekyll, setup]
title:  "Setup jekyll dev environment"
authors: [hydor112]
---
**Requirements**
- Ruby 3.3.0 or newer with msys2
  - [Ruby](https://rubyinstaller.org/) (with devkit)  (manual installation)
  - ```choco install ruby``` (Chocolatey install)

**Preparing Jekyll**
- ```cd ./docs/```
- ```bundler install```

**Start local Jekyll instance**
- ```bundle exec jekyll serve --livereload``` (in ./docs/)
