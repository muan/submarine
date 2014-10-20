var fs = require('fs')
var path = require('path')
var marked = require('marked')
var hb = require('handlebars')

module.exports = submarine

function submarine(input_dir, output_dir, header, footer) {
  template = getTemplate(header, footer)

  // Create output_dir if doesn't exist
  if(!fs.existsSync(path.resolve(process.cwd(), output_dir))) {
    fs.mkdir(path.resolve(process.cwd(), output_dir), function(err) {
      if (err) return console.log(err)
    })
  }

  // Create html files
  fs.readdir(path.resolve(process.cwd(), input_dir), function(err, files) {
    if (err) return console.log(err)
    files = files.filter(function(n) { return n.match(/.+\..+$/) }).sort()

    // Write index
    fs.writeFile(path.resolve(process.cwd(), output_dir, 'index.html'), indexHTML(files), function (err) {
      if (err) return console.log(err)
    })

    // Write markdowns into HTML
    files.forEach(function(name) {
      fs.readFile(path.resolve(process.cwd(), input_dir, name), function(err, file) {
        if (err) return console.log(err)
        var index = files.indexOf(name)
        var html = generateHTML(file.toString(), files[index-1], files[index+1])
        var filename = getFilename(name)
        fs.writeFile(path.resolve(process.cwd(), output_dir, filename + '.html'), html, function (err) {
          if (err) return console.log(err)
        })
      })
    })
  })

  console.log('Done and done, open `' + output_dir + '/index.html` to have a look!')
}

function generateHTML(text, previous, next) {
  var html = marked(text)
  return template({
    content: html, 
    previous: getFilename(previous),
    next: getFilename(next)
  })
}

function getFilename(name) {
  return name ? path.basename(name, path.extname(name)) : ""
}

function indexHTML(files) {
  var list = files.map(function(file) {
    var name = getFilename(file)
    return { href: name + '.html', name: name }
  })
  return template({index: list})
}

function getTemplate(header, footer) {
  file = fs.readFileSync(__dirname + '/template/index.html').toString()
  hb.registerPartial('header', (header || "Submarine"))
  hb.registerPartial('footer', (footer || ""))
  return hb.compile(file.toString())
}
