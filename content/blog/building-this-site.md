+++
title = "building this site"
date = 2025-01-22
description = "my tiny adventure in static site generation"
[taxonomies]
tags = ["site"]
+++

## static site generation

while looking for a static site generator for my site i tried a few interesting
  tools, like hugo and astro. i even tried building my own ssg (which failed
  miserably). in the end i discovered zola, simple static site generator
  written in rust. zola uses tera templates to build sites with minimal effort.

zola separates content from templates. where markdown files can specify which
templates to use.

### templates

here is my blog page. it specifies a template to use for the section. in this
template i can use zola's section variables to create a dynamic posts page
(which i'll get into in a bit).

```markdown
+++
title = "blog"
description = "questionable ideas put to paper"
sort_by = "date"
template = "pages/blog.html"
page_template = "pages/post.html"
+++
```

the blog page also specifies a `page_template`. this is the template that will
be used for all child pages (my blogposts).

in my `pages/blog.html` template i can use zola's section variables to iterate
over all my blogposts and generate a list at build time.

```tera
{% block content %}
  {{ section.content | safe }}
  <ul class="blog-previews">
    {% for page in section.pages %}
      {% include "partials/blogpreview.html" %}
    {% endfor %}
  </ul>
{% endblock content %}
```

## build and deploy

to ease building and deploying the site i use nix to setup my tools and build.
because the site is static i simply can use github pages to deploy.

the nix builder simply takes zola as a buildinput and runs the build. i then
copy the static content to the `$out` directory.

```nix
stdenvNoCC.mkDerivation {
  src = ./.;

  nativeBuildInputs = [
    zola
  ];

  buildPhase = ''
    runHook preBuild
    zola build
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp -r public/* $out

    runHook postInstall
  '';
}
```

deployment is done using a single github action you can find [here](https://github.com/comfysage/site/blob/6a576c27f773cecbb3aec5adfc844d0efca7cddf/.github/workflows/deploy.yml).

## resources

also *none* of this would've been possible without the amazing support and help from [isabelroses](https://github.com/isabelroses).
