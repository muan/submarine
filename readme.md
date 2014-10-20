# Submarine [![Build Status](https://travis-ci.org/muan/submarine.svg?branch=master)](https://travis-ci.org/muan/submarine)

Submarine takes a directory full of markdown files and convert them into a static site of HTML pages, including a table of contents page.

![](https://nodei.co/npm/submarine.png?downloads=true&stars=true)

## Install

```
npm install submarine -g
```

## Usage

Submarine takes 2 arguments, `[input_dir]` for where the markdown files live, and `[output_dir]` for where your static site will live. Like so:

```
$ submarine [input_dir] [output_dir] --header=[headerTEXT] --footer=[footerTEXT]
```

## Example

Imagine your file structure looks like this:

```
guide/
  1_hello_world.md
  2_sup_world.md
  3_cool_story_world.md
  4_yolo_world.md
```

Then run this in this directory:

```
$ submarine guide site --header=Submarine --footer='Nice footer.'
```

The markdown files in `./guide` will be converted, and a static site will be created in `./site`. Your new file structure will look like this:

```
guide/
  1_hello_world.md
  2_sup_world.md
  3_cool_story_world.md
  4_yolo_world.md
site/
  1_hello_world.html
  2_sup_world.html
  3_cool_story_world.html
  4_yolo_world.html
  index.html
```

![](http://cl.ly/image/0i0j3T3W1b1W/Image%202014-10-19%20at%2011.31.41%20PM.png)

![](http://cl.ly/image/3J3z413c1R0v/Image%202014-10-19%20at%2011.34.05%20PM.png)
