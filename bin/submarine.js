#!/usr/bin/env node

var fs = require('fs')
var submarine = require('../index.js')
var input_dir = process.argv[2]
var output_dir = process.argv[2]

if(!fs.existsSync('./' + input_dir)) {
  console.warn('\033[91mThe input directory you specify does not exist.\033[0m')
} else {
  submarine(process.argv[2], process.argv[3])
}
