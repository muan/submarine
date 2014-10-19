var submarine  = require('../index.js')
var fs         = require('fs')
var test       = require('tape')
var path       = require('path')
var tmp        = require('os').tmpdir()
var inputPath  = path.resolve(tmp, 'content')
var outputPath = path.resolve(tmp, 'site')
var filenames  = ['hello_world', 'cool_story_world', 'sup_world', 'yolo_world']
var cheerio    = require('cheerio')

// Create content dir
if(!fs.existsSync(inputPath)) {
  fs.mkdir(inputPath, function(err) {
    if (err) return console.log(err)
  })
}

// Create markdown content
filenames.forEach(function(name) {
  var index = filenames.indexOf(name)
  var md = fakeMarkdown(name)
  fs.writeFile(path.resolve(inputPath, name + '.md'), md, function (err) {
    if (err) return console.log(err)
  })
})

function fakeMarkdown(name) {
  return '# ' + name + '\n**' + name + '**, wow!'
}

// Run command to convert
submarine(inputPath, outputPath, 'Cool World', 'All rights abandoned.')

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
