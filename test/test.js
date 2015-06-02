var submarine = require('../index.js')
var fs = require('fs')
var test = require('tape')
var path = require('path')
var tmp = path.resolve(require('os').tmpdir(), 'submarine')
var inputPath = path.resolve(tmp, 'content')
var outputPath = path.resolve(tmp, 'site')
var cheerio = require('cheerio')
var rimraf = require('rimraf')
var fakeData = require('./fakeData.js')
var called = false
var options

// Teardown, buildup, and test
rimraf(tmp, function () {
  fs.mkdir(tmp, function (err) {
    if (err) return console.log(err)

    fakeData(inputPath, function (filenames) {
      options = {
        input_dir: inputPath,
        output_dir: outputPath,
        header: 'Cool World',
        footer: 'All rights abandoned.'
      }

      // Run command to convert
      submarine(options, function (err) {
        if (err) {
          return console.log(err)
        }

        console.log('Files built. <3')
        called = true
        startTests(filenames)
      })
    })
  })
})

// Test begin
function startTests (filenames) {
  test('basics', function (t) {
    t.assert(called, 'callback is called')
    t.end()
  })

  fs.readdir(outputPath, function (err, files) {
    if (err) return console.log(err)

    test('has the right files', function (t) {
      t.equal(files.length, 6, 'created 6 files?')
      t.ok(files.indexOf('index.html') >= 0, 'index.html exists?')

      filenames.forEach(function (name) {
        fs.readFile(path.resolve(outputPath, name + '.html'), function (err, data) {
          t.error(err, name + '.html exists?')
          t.ok(data.toString().match('<strong>' + name + '</strong>'), name + '.html contains html including the name?')
        })
      })

      fs.readdir(outputPath + '/assets', function (err, files) {
        if (err) return console.log(err)
        t.ok(files.indexOf('main.css') >= 0, 'assets/main.css exists?')
      })

      t.end()
    })
  })

  test('flags work', function (t) {
    fs.readFile(path.resolve(outputPath, 'index.html'), function (err, data) {
      if (err) return console.log(err)

      var $ = cheerio.load(data.toString())
      t.equal($('.site-header').text().trim(), 'Cool World', 'has header?')
      t.equal($('.site-footer').text().trim(), 'All rights abandoned.', 'has footer?')
      t.end()
    })
  })
}
