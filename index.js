var fs = require('fs')
var marked = require('marked')
var hb = require('handlebars')

var template = getTemplate()
module.exports = submarine

function submarine(input_dir, output_dir) {
  // Create output_dir if doesn't exist
  if(!fs.existsSync('./' + output_dir)) {
    fs.mkdir('./' + output_dir, function(err) {
      if (err) return console.log(err)
    })
  }

  // Create html files
  fs.readdir('./' + input_dir, function(err, files) {
    if (err) return console.log(err)
    files = files.filter(function(n) { return n.match(/.+\..+$/) })

    // Write index
    var index = template({content: generateIndex(files)})
    fs.writeFile('./' + output_dir + '/index.html', index, function (err) {
      if (err) return console.log(err)
    })

    // Write markdowns into HTML
    var i = 0
    files.forEach(function(name) {
      fs.readFile('./' + input_dir + '/' + name, function(err, file) {
        var html = generateHTML(file.toString(), files[i-1], files[i+1])
        var filename = RegExp(/(.+)\.md$/).exec(name)[1]
        fs.writeFile('./' + output_dir + '/' + filename + '.html', html, function (err) {
          if (err) return console.log(err)
        })
        i++
      })
    })
  })

  console.log('Done and done, open `' + output_dir + '/index.html` to have a look!')
}

function generateHTML(text, previous, next) {
  var html = marked(text)
  return template({
    content: html, 
    previous: (previous ? previous.replace(/\.md/, '') : ''),
    next: (next ? next.replace(/\.md/, '') : '')
  })
}

function generateIndex(files) {
  var item = hb.compile('<li><a href="{{ href }}">{{ name }}</a></li>')
  var list = files.map(function(file) {
    return item({ href: toDotHTML(file), name: file })
  }).join('')
  return '<ol>' + list + '</ol>'
}

function toDotHTML(filename) {
  return filename.replace(/\.md/, '.html')
}

function getTemplate() {
  file = fs.readFileSync(__dirname + '/template/index.html').toString()
  return hb.compile(file.toString())
}
