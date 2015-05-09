# Submarine [![Build Status](https://travis-ci.org/muan/submarine.svg?branch=master)](https://travis-ci.org/muan/submarine) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Submarine takes a directory full of markdown files and convert them into a static site of HTML pages, including a table of contents page.

![](https://nodei.co/npm/submarine.png?downloads=true&stars=true)

## Install

```
npm install submarine -g
```

## Usage

### API Example

```javascript
var submarine = require('submarine')
var options = {
  input_dir: 'content',
  output_dir: 'site',
  header: 'API Example', // optional
  footer: 'hi this shows in the footer', // optional
  template: 'custom/default.html' // optional
}

submarine(options, callback)

function callback (err) {
  if(err) return console.log(err)
  console.log('how wonderful.')
}
```

### Command Line

Submarine takes 2 arguments, `[input_dir]` for where the markdown files live, and `[output_dir]` for where your static site will live.

```shell
Usage: submarine [input_directory] [output_directory]

Options:
  --header=<header>    customize static site header, default to "Submarine"
  --footer=<footer>    customize static site footer
  --template=<file>    use a custom template
  --version            prints current version
```

### Command Line Example

Imagine your file structure looks like this:

```shell
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

```shell
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

## Template

You can specify a custom template with `--template=cooltemplate.html`, see [the default template](https://github.com/muan/submarine/blob/master/template/index.html) for an example. It's super easy, just write a single HTML file that contains these variables:

- `{{> header }}` a string, retrived through options.header
- `{{> footer }}` a string, retrived through options.footer
- `{{# index }}` an array of objects(markdown -> html pages), each has 2 keys: `href`, `name`
- `{{{ content }}}` markdown converted to HTML
- `{{ previous }}` file name of the previous page
- `{{ next }}` file name of the next page

Note that currently submarine does not support separate asset files, so please include the styles and scripts in the HTML template.

## License

MIT

## About

This, as well as many node modules now exist in the world, was inspired by a conversation with [@maxogden](https://github.com/maxogden). Perhaps you should hang out with him some time too.
