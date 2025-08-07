default: build

prefix := 'dist'

dev:
  zola serve -p 3000 --drafts

build:
  zola build

install:
  mkdir -p {{prefix}}
  cp -r public/* {{prefix}}

lint:
  typos content/**/*

lint-fix:
  typos content/**/* -w
