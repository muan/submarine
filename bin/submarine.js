#!/usr/bin/env node

var fs = require('fs-extra');
var submarine = require('../index.js');
var args = require('minimist')(process.argv.slice(2));
var options = {
    input_dir: args._[0],
    output_dir: args._[1],
    header: args.header,
    footer: args.footer,
    template: args.template,
    assets: args.assets
};

if (args.version) {
    console.log(require('../package.json').version);
    process.exit(0);
} else if (args._.length === 0) {
    console.log('Usage: submarine [input_directory] [output_directory]\n');
    console.log('Options: ');
    console.log('  --header=<header>    customize static site header, default to "Submarine"');
    console.log('  --footer=<footer>    customize static site footer');
    console.log('  --template=<file>    use a custom template');
    console.log('  --assets=<directory> use a custom assets directory, defaults to "template/assets"');
    console.log('  --version            prints current version ');
    console.log();
    process.exit(0);
} else {
    submarine(options, function(err) {
        if (err) {
            console.log(err);
            process.exit(1);
        } else {
            console.log('Built, yay! Open ' + options.output_dir + '/index.html to check it out!');
            process.exit(0);
        }
    });
}
