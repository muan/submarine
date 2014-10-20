#!/usr/bin/env node

var fs = require('fs')
var submarine = require('../index.js')
var args = require('minimist')(process.argv.slice(2))
var options = {
  input_dir: args._[0],
  output_dir: args._[1],
  header: args.header,
  footer: args.footer
}

submarine(options, function(err) {
  if (err) return console.log(err)
  console.log('Built, yay! Open ' + options.output_dir + '/index.html to check it out!')
})
