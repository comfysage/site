+++
title = "creating a colorscheme"
date = 2025-03-12
description = "a small guide based on my own experiences"
[taxonomies]
tags = ["colorscheme"]
+++

ever since I started using open source applications and code editors I got
sucked into the magic of syncing the themes of my different applications.
there's just something amazing about having all your applications using the
same styles and colors.

naturally I got inspired by the thousands of colorschemes out there and created
my own, and then my next one, and then my next one. I have to admit that my
first few attempts lacked… a certain touch. while it was really fun to change
my applications to use a palette that *I* created, the end result was pretty
bad. apparently, selecting random colors without thinking about their
relationship to eachother isnt the best recipe for creating a coherent color
scheme.

in this small guide I will attempt to lay out some of tips I can give you in your
own colorscheme journey. these tips are based on my extensive time researching
color theory, both in creating colorschemes and art in
general.

### where to start

the best thing is to start with a concept. use a scene, videogame or movie you
like as inspiration. next, collect some images relating to your concept. by
creating a moodboard, you quickly have access to reference material for your
colorscheme.

### finding your neutral colors

every colorscheme starts with a background color. it is quite difficult to
select foreground colors until you know which color they will contrast with;
think of black on white for most websites. select a color in your reference
material that has a soft hue to it. try not to use a color that pops. instead
look for the color that is used as a backdrop. this color will often be either
blue, red-ish or purple. this is because most scenery in your daily
life is made of these colors; think of shadowy areas, surfaces lit up by the
sun and night scenery respectively.

after you've selected your background color, we need a foreground color. theres
two ways to go about this. method one is shifting the lightness of your
background color up and shifting the saturation all the way down. using this
method, you get a quite analogous neutral palette. these palettes are perfect
for when you want to add other colors that pop. the second
  method is the same as the first one but follows up by shifting the hue of your
  foreground color by 180 degrees. this method will result in a complementary
  neutral palette, which makes your final colorscheme look quite vibrant.

next up is creating your neutral shades. this can simply be done by
incrementally changing the components of your background color until they reach
the value of your foreground color.

### how to select colors

look in your reference material for a *single* color that you find
representative of your concept. next, crank up the lightness and
saturation until you're content with your color. this color will be the main
color used for syntax.

for the rest of your palette, use the same saturation and lightness but move
  the hue over about 60 to 90 degrees each time. by selecting colors that
  differ only in *one* component, either hue or lightness or saturation, you
  create a palette that looks quite harmonious.

### adjusting your colors

you might notice that some of your colors look a little off. this is because
saturation and lightness in the hsl (or hsv) color space is not perceptually
uniform. this means that, to the human eye, colors with the same saturation and
lightness don't *look* like they have the same saturation and lightness. to the
human eye, a blue or purple will look darker than a green or yellow. you
have to take this into account while creating your colorscheme.

if you have a palette that is generally pretty vibrant but some colors look
  washed out, try decreasing their brightness and increasing their saturation.
  the inverse can be said for a pastel palette: do some colors look darker or
  dirtier? try increasing their lightness and decreasing their saturation.

in general, there are a few rules for a coherent palette: your reds and oranges
will have a higher saturation than your other colors, whereas your blues and
greens will have a lower saturation.

### look at community resources

to further help you on your journey I have selected a collection of resources I
discovered while researching colorschemes. the end result of these resources
might not look like something *you* would want to create. nevertheless, it's
important to look at the choices these developers made and think about how you
could apply their ideas to your own work.

an important resource that got me started on my colorscheme journey was
[cocopon](https://github.com/cocopon)'s vimconf 2017 [presentation](https://speakerdeck.com/cocopon/creating-your-lovely-color-scheme) on creating a
colorscheme.

next, look at documentation for well-known palettes. many popular themes have
in-depth documentation on their palettes. they may even share some of the
knowledge theyve gained on the journey they took to create the colorscheme.
here's a selection of resources to start:

- [the nord theme documentation](https://www.nordtheme.com/docs/colors-and-palettes)
- [the rose-pine documentation](https://rosepinetheme.com/palette/)
- [the catppuccin style guide](https://github.com/catppuccin/catppuccin/blob/main/docs/style-guide.md)
- [the solarized documentation](https://ethanschoonover.com/solarized/)
