prefix := 'dist'

build:
  zola build

install:
  mkdir -p {{prefix}}
  cp -r public/* {{prefix}}

lint:
  typos content/**/*

lint-fix:
  typos content/**/* -w
