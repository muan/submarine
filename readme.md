# Submarine

Submarine takes a directory full of markdown files and convert them into a static site of HTML pages, including a table of content page.

## Install

```
npm install submarine -g
```

## Usage

Pretend your file structure looks like this:

```
guide/
  1_hello_world.md
  2_sup_world.md
  3_cool_story_world.md
  4_bye_world.md
```

Submarine takes 2 arguments, `[input_dir]` for where the markdown files live, and `[output_dir]` for where your static site will live.

```
submarine guide site
```

This command will convert the markdown files in `./guide`, and create a static site in `./site`.

