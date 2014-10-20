var submarine  = require('../index.js')
var fs         = require('fs')
var test       = require('tape')
var path       = require('path')
var tmp        = require('os').tmpdir()
var inputName  = 'content'
var inputPath  = path.resolve(tmp, inputName)
var outputPath = path.resolve(tmp, 'site')
var cheerio    = require('cheerio')
var rimraf     = require('rimraf')
var fakeData   = require('./fakeData.js')

// Teardown, buildup, and test
rimraf(inputPath, function() {
  fakeData(inputName, doTest)
})

function doTest(filenames) {
  // Run command to convert
  submarine(inputPath, outputPath, 'Cool World', 'All rights abandoned.')

  // Test begin
  fs.readdir(outputPath, function(err, files) {
    test('has right files', function(t) {
      t.equal( files.length, 5, 'created 5 files?')
      filenames.forEach(function(name) {
        t.assert( files.indexOf(name + '.html') >= 0, name + '.html exists?')
      })
      t.assert( files.indexOf('index.html') >= 0, 'index.html exists?')
      t.end()
    })
  })

  test('flags work', function(t) {
    fs.readFile(path.resolve(outputPath, 'index.html'), function(err, data) {
      var $ = cheerio.load(data.toString())
      t.equal( $('.site-header').text().trim(), 'Cool World', 'has header?')
      t.equal( $('.site-footer').text().trim(), 'All rights abandoned.', 'has footer?')
      t.end()
    })
  })
}
