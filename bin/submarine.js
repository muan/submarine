#!/usr/bin/env node

var fs = require('fs')
var submarine = require('../index.js')
var args = require('minimist')(process.argv.slice(2))
var input_dir = args._[0]
var output_dir = args._[1]
var header = args.header
var footer = args.footer

if(!fs.existsSync('./' + input_dir)) {
  console.warn('\033[91mThe input directory you specify does not exist.\033[0m')
} else {
  submarine(input_dir, output_dir, header, footer)
}
