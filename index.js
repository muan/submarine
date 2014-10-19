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
    var i = 0

    // Write index
    var index = template({content: generateIndex(files)})
    fs.writeFile('./' + output_dir + '/index.html', index, function (err) {
      if (err) return console.log(err)
    })

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

function generateHTML(text, before, after) {
  var html = marked(text)
  html += lastHTML(before)
  html += nextHTML(after)
  return template({content: html})
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

function lastHTML(file) {
  if(file) {
    return '<a class="lastp navlink" href="' + toDotHTML(file) + '">Previous: ' + file + '</a>'
  } else { return '' }
}

function nextHTML(file) {
  if(file) {
    return '<a class="nextp navlink" href="' + toDotHTML(file) + '">Next: ' + file + '</a>'
  } else { return '' }
}
