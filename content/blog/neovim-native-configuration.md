+++
title = "tending your editor config: building sylvee & lynn"
date = 2025-08-13
description = "my adventure building a native-first neovim experience"
[taxonomies]
tags = ["neovim", "config"]
+++

<!--
### intro

(set the scene and intent)

- why i wanted a quieter, native-first neovim experience

- frustration with sprawling plugin ecosystems and fragile abstractions

- goal: a configuration that feels like neovim, not a replacement for it

- result: sylvee, a native-first neovim distro — and lynn, the small plugin manager that powers it
-->

if you're like me and love configuring your neovim setup, you might reach a
point of customization where the different plugins you're using start holding
you back: different ui or keybinds start fighting eachother and keeping track of
lazy-loading for every plugin becomes unmanageable.

most of the time you'll think to yourself that your setup has become too big and
surely if you just restart from scratch you'll avoid this next time ... but you
never do.

thats why i decided to create a native-first neovim experience. i tried to
focus on bringing features to my editor using built-in building blocks and
components. this meant no [nvim-cmp] or [blink-cmp] and, most importantly, no
[lazy.nvim].

### philosophy and foundation

<!--
### section 1: philosophy and foundation

(what kind of user sylvee is built for)

- starting from neovim’s built-in features

- avoiding wrapping everything in custom logic

- respecting the defaults, only extending when necessary

- the garden metaphor: letting neovim bloom on its own
-->

neovim has become incredibly powerful out-of-the-box and i want to take advantage of that.
so i created [sylvee][], a native-first neovim configuration that builds on the amazing
features that have been added to neovim recently.

to power plugin management i created a wrapper around [`vim.pack`], neovim
nightly's native plugin manager. this wrapper is called [lynn.nvim][], and it
powers the configuration that i made.

## neovim's built-in features

sylvee was built to extend neovim's built-in features. i didn't want to wrap my
clean and powerful editor in a layer of bloated plugins. using neovim's
defaults has become incredibly user-friendly recently and i noticed that i
started deleting custom keymaps i added to my config; neovim's default binds
made more sense than my own.

a perfect example of this is neovim's recent addition of built-in lsp keymaps:
from neovim 0.11 onwards, you'll able to use a bunch of `gr`-prefixed keymaps to access
different lsp-related editor features. these include `grn` to rename a symbol,
`gra` to access code actions and `grr` to get a list of references. similarly,
[tpope's vim-unimpaired](https://github.com/tpope/vim-unimpaired) has been
integrated into neovim: you can now use `bracket + q` to switch items in the
quickfix list and `bracket + b` to navigate the buffer list.

apart from keymaps, a bunch of settings and autocmds are no longer
needed: setting the ['omnifunc'] to lsp completion is done
automatically when an lsp attaches and your folds will use treesitter
when available.

neovim's builtin completion has also been greatly improved: since
version `0.11` you can already enjoy added highlights for matching
results and pre-inserted 'ghost-text', and in neovim nightly there is
now also support for ['autocomplete'] - enabling this option will make the completion popup
automatically appear while typing.

lsp configuration has been a treat since [`vim.lsp.config`] got added.
gone are the days of giant table's with configurations for all your
different lsp's. you can now split all your custom configs up into
files in the `lsp/` directory of your config. these will automatically
get sourced. all you need to do is enable the lsp's you use using
[`vim.lsp.enable`] and thats that. similarly, [nvim-lspconfig] has been
simplified: you no longer have to even `require` this plugin - just
throw it in your plugin list and it works.

<!-- TODO: mention `vim.pack` -->

### sylvee: keeping configuration gentle

<!--

### section 2: keeping configuration gentle

(how sylvee stays legible and minimal)

- using the plugin/ directory for simple autoloading

- only mapping keys when the default is missing

- splitting plugin config into clean, isolated files

- relying on built-in commands over external tools when possible

-->

a core part of sylvee is the idea that configuration should be simple and
minimal. this meant using the `plugin/` to load custom scripts instead of death
by a thousand `require` statements in your `init.lua`.

i didn't add custom keymaps unless a feature did not have a keymap builtin,
like [`:tabnew`] which i bound to `<C-w><tab>`, or when the defaults required
ergonomics that would simply break my hand, like [`<C-^>`] to open the alternate
file which i bound to `<C-j>` (a keymap that surpringly wasn't used yet by neovim).

additionally, i made exceptions for keymaps which i found to better fit neovim's
keymap model: switching tabs made more sense with `bracket + <tab>` than
[`gt/gT`]. although the goal is minimalism, i didn't want to compromise on my
preferences - sylvee can be a little opinionated sometimes.

## lynn - a plugin manager with charm

<!--

### section 3: introducing lynn — a plugin manager with charm

(what problem lynn solves and how it fits)

- why i didn’t want to use lazy.nvim or packer

- neovim 0.12 introduced vim.pack — a good foundation

- lynn as a lightweight wrapper: no magic, just convenience

- declarative plugin spec in one file

- plugin configs in config/ matched by name, sourced with :runtime

- no opts/config nesting or plugin-specific logic

-->

### why i don't like lazy.nvim or packer

over time the neovim community has reinvented plugin management time and time
again - to me the days of `vim-plug` dont feel that far away and we've come a
long way since then. the plugin spec has changed massively: we started out with
simple url strings, expanded with some small options like renaming the plugin
dir or pinning to a version, and ended up with convoluted specs that integrate
both the plugin and your own configuration - thus becoming dependent on the
context of your specific neovim setup.

this evolution was partly caused by the introduction of the
`require('plugin').setup()` convention. whereas plugin used to set
configuration options using global [`vim.g`] variables, they were now set with a
single line of imperative lua code. i find this change way better for clarity
but it didnt come without consequences. since configuration was now set with a
function plugin authors started using this function as the entry point of the
plugin - meaning whether your plugin was lazy-loaded or not became dependent on
when the user runs `setup`. if you're wondering how this is different from how
lazy-loading done previously: neovim has a set of specific
directory names that, if in the runtimepath, will automatically get run or
added to the environment. this includes the `plugin/` dir: authors would put
autocommands in their `plugin/plugin-name.vim` to automatically initialize the
plugin whenever appropiate events happened in the editor.

since the introduction of [packer.nvim] and [lazy.nvim] the plugin spec received a
new `config` function (and with [lazy.nvim] an even simpler `opts` table). now
your configuration for a plugin, which in most cases was just calling `setup`,
could now be done within the plugin spec. ... and now your plugins file is
filled with unrelated configs, differently indented functions, and `opts` tables.

finally, as mentioned earlier, [`vim.pack`] got added in neovim-nightly. this powerful built-in plugin
manager allows you to finally load plugins without the need for a bootstrapped
package manager like [lazy.nvim]. ... except there are some caveats. currently
[`vim.pack`] only has support for the _management_ and _installation_ of plugins,
configuration is entirely up to the user. similarly, lazy-loading is assumed to
be done by plugins themselves (a sentiment that i entirely support). this means
that there are still definitely some limitations to using [`vim.pack`] - which
led me to create [lynn.nvim], a plugin manager that leverages neovim's builtin
features which are responsible for all the heavy lifting and creates a configuration interface that fits
neovim's file based model.

### lynn as a lightweight wrapper: no magic, just convenience

lynn didnt need to do a lot: git cloning, installing, and setting up the plugin
path was already handled by [`vim.pack`]. lynn simply needed to help with urls
(allowing you to use `owner/repo` instead of `https://github.com/owner/repo`),
allow lazy-loading if the plugin doesn't handle it by it self, and
automatically source your config.

the url wrapping simply means that lynn will assume a `owner/repo` format
refers to a github repo. additionally, lynn supports url aliases: you can use
`server:owner/repo` to use a custom git server instead of github.

lazy-loading is kept pretty simple. there's no usercommand wrapping or keymaps
that automatically source the plugin. instead, you can use the `event` field to
create an autocommand for the plugin.

configuration is where most of the magic lies, and funnily enough it's also the
simplest (just a few lines of lua code). lynn will automatically source any lua
file in the `config/` directory of your config that matches the name of the
plugin. for [mini.nvim][] this means lynn will load `config/mini.lua` and for
[fzf-lua][] this means lynn will load `config/fzf.lua`. finding these files is
done by the `:runtime` command - neovim already has a builtin mechanism for
finding files in your setup and there is no need for lua code going over your
filesystem.

## using lynn and sylvee

<!--

### section 4: implementation details

(technical walkthrough for both tools)

- how plugin specs work in lynn

- how `require("lynn").setup("plugins")` integrates with vim.pack.add

- how sylvee calls lynn and sets up the config directory

- using NVIM_APPNAME=sylvee nvim to isolate config

- optional tools: fzf, ripgrep, etc for enhancements

-->

### adding plugins to lynn

plugin specs are quite simple. you're probably already familiar with most of the fields it supports.

a simple example would look like this:

```lua
{
  'owner/repo',
  url = 'https://github.com/owner/repo', -- optionally specify a custom url
  name = "cool-repo", -- optionally rename the plugin
  version = "main", -- pin the plugin to a specific version, allows for the use of `vim.version`
  path = "path/to/plugin", -- optionally specify a custom path
  deps = { "dep1", "dep2" }, -- specify dependencies
  event = "VimEnter", -- specify an autocommand event
  lazy = true, -- lazy-load the plugin
  after = function() end, -- pass a function to run after the plugin is loaded, by default sources the `config/plugin-name.lua` file
  before = function() end, -- pass a function to run before the plugin is loaded
}
```

lazy loading is only done if `lazy` is set to `true` or an autocmd event is
specified. this means that normally lynn will load the plugin after neovim's
configuration stage is done.

there are `after` and `before` fields but in most cases these should not have
to be used. `after` will default to loading your config file so any important
code should go there. `before` is only useful if you want to run code before
the plugin is loaded.

### using sylvee

using sylvee is as simple as cloning the repo and running neovim with [`NVIM_APPNAME`] set to `"sylvee"`.

```bash
git clone https://github.com/comfysage/sylvee.git ~/.config/sylvee
NVIM_APPNAME=sylvee nvim
```

this can be simplified even more by creating a quick wrapper script for sylvee:

```bash
#!/usr/bin/env sh
# ~/.local/bin/sylvee
NVIM_APPNAME=sylvee nvim "$@"
```

## what sylvee and lynn don’t do

<!--

### section 5: tradeoffs and boundaries

(what sylvee and lynn don’t do, on purpose)

- no snapshot lockfiles (you manage updates yourself)

- no plugin-specific helpers or config DSLs

- no complex lazy-loading rules or nested plugin metadata

- this makes lynn less “powerful” than full managers — but more understandable

-->

sylvee and lynn don't aim to solve every problem. they just try to stay out of
your way sylvee is a minimalistic approach that tries to remove the friction of
configuring neovim, and lynn is a small plugin manager that tries to remove
some annoyance with managing plugins. they won't solve all the problems in the
neovim space and they won't fit every use case.

currently lynn does not go well with a nix-wrapped neovim setup. im working on
adding this by allowing you to disable [`vim.pack`] within lynn - effectively
making lynn a lazy-loader for local plugins.

lynn also does not support plugin lock files or snapshots since these features
are entirely dependent on neovim-core's implementation of [`vim.pack`]. [as soon
as this is added][neovim/pr/lock] i will make sure lynn doesn't get in its way.

lynn currently does not support complex lazy-loading rules like `mappings` or
`cmd` fields to load on keymaps and commands since i think these hurt
performance in most situations and are simply not worth the trouble.
additionally, most of these can be implemented manually for specific
edge-cases.

[neovim/pr/lock]: https://github.com/neovim/neovim/issues/34776

## growing your own garden

<!--

### section 6: growing your own garden

(how others can build on this approach)

- using sylvee as a base, or picking just ideas from it

- using lynn standalone in any neovim config

- how the philosophy might scale (or not) for other users

- future thoughts: themed variants, small enhancements, no abstractions

-->

i would also like to note that the philosophy of sylvee and lynn is not to be a
complete solution, but rather a starting point for those that want to build
their own customized configuration.

sylvee is a starting point for your own garden. you can use it as a base, or
pick specific parts that you'd like to use. it can be a really strong base to
build off of, especially for those that prefer a more minimal setup. finding
features within your editor and knowing some of the basics, like the [quickfix
list][neovim/docs/qflist], [grep][neovim/docs/grep] and
[marks][neovim/docs/marks], will help you build your own garden.

you can also use lynn as a standalone plugin manager for your neovim setup.
this might be useful if you want to keep your neovim setup simple and prefer to
use neovim's builtin plugin manager without having to deal with creating your
own lazy-loading solution (ofcourse thats always a viable and fun option).

[neovim/docs/qflist]: https://neovim.io/doc/user/quickfix.html
[neovim/docs/grep]: https://neovim.io/doc/user/quickfix.html#_5.-using-:vimgrep-and-:grep
[neovim/docs/marks]: https://neovim.io/doc/user/motion.html#_7.-marks

<!--

### outro

(closing thoughts)

- this setup works because it trusts neovim

- small tools, small files, small surprises

- sylvee and lynn don’t aim to solve every problem
- they just try to stay out of your way

- if that sounds like your kind of garden, give them a try

-->

i hope that this setup works for you. i personally loved working on it and
learned a lot about how powerful of an editor neovim can be if you try to look
into some of its more complex aspects. the neovim core team has worked really
hard on creating an impressive and customizable out-of-the-box experience. i
admire them for all the work they've done and am looking forward to where we'll
go next.

i've tried my best to work _with_ what neovim provides and _against_ what most
neovim distros are reaching for. i tried to balance neovim's defaults with some
additions that i would love to see in neovim in the future.

if that sounds like your kind of garden, give sylvee and lynn a try. i think
they're something interesting to try out. if you have any questions or feedback
please [let me know](https://github.com/comfysage/sylvee/discussions)!

# references

here are some references that add more context to this blogpost:

- a [section](https://neovim.io/doc/user/lua-plugin.html#_lazy-loading) of the neovim docs explaining how to add lazy-loading to your plugin.
- a [comment](https://github.com/neovim/neovim/issues/35562#issuecomment-3239702727) by [justinmk][] explaining how lazy-loading _should_ be done in neovim.

[sylvee]: https://github.com/comfysage/sylvee "sylvee: minimal & native-first neovim config"
[lynn.nvim]: https://github.com/comfysage/lynn.nvim "lynn.nvim: native-first neovim plugin manager with charm"
['autocomplete']: https://neovim.io/doc/user/options.html#'autocomplete'
['omnifunc']: https://neovim.io/doc/user/options.html#'omnifunc'
[`:tabnew`]: https://neovim.io/doc/user/tabpage.html#%3Atabnew
[`<C-^>`]: https://neovim.io/doc/user/editing.html#CTRL-%5E
[`NVIM_APPNAME`]: https://neovim.io/doc/user/starting.html#_nvim_appname
[`gt/gT`]: https://neovim.io/doc/user/tabpage.html#gt
[`vim.g`]: https://neovim.io/doc/user/lua.html#vim.g
[`vim.lsp.config`]: https://neovim.io/doc/user/lsp.html#_config
[`vim.lsp.enable`]: https://neovim.io/doc/user/lsp.html#vim.lsp.enable()
[`vim.pack`]: https://neovim.io/doc/user/pack.html#_plugin-manager
[blink-cmp]: https://github.com/Saghen/blink.cmp
[fzf-lua]: https://github.com/ibhagwan/fzf-lua
[justinmk]: https://github.com/justinmk
[lazy.nvim]: https://github.com/folke/lazy.nvim "shitty plugin manager"
[mini.nvim]: https://github.com/echasnovski/mini.nvim
[nvim-cmp]: https://github.com/hrsh7th/nvim-cmp
[nvim-lspconfig]: https://github.com/neovim/nvim-lspconfig
[packer.nvim]: https://github.com/wbthomason/packer.nvim
