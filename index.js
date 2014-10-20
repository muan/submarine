var fs = require('fs')
var path = require('path')
var marked = require('marked')
var hb = require('handlebars')

module.exports = submarine

function submarine(options, callback) {
  // input_dir, output_dir, header, footer
  options.header = options.header || "Submarine"
  options.footer = options.footer || ""

  var input = path.resolve(process.cwd(), options.input_dir)
  var validInput = fs.existsSync(input)

  if(validInput) {
    boardSubmarine(options)
  } else {
    callback('\033[91mThe input directory `./' + options.input_dir + '` does not exist.\033[0m')
  }

  function boardSubmarine(options) {
    var template = getTemplate(options.header, options.footer)

    createFolderMaybe(options.output_dir, function() {
      fs.readdir(path.resolve(process.cwd(), options.input_dir), function(err, files) {
        if (err) return callback(err)
        files = files.filter(function(n) { return n.match(/.+\..+$/) }).sort()
        makeFiles(files, options, callback)
      })
    })
  }

  function createFolderMaybe(output_dir, proceed) {
    // Create output_dir if doesn't exist
    if(!fs.existsSync(path.resolve(process.cwd(), output_dir))) {
      fs.mkdir(path.resolve(process.cwd(), output_dir), function(err) {
        if (err) return callback(err)
        proceed()
      })
    } else {
      proceed()
    }
  }
}

function makeFiles(files, options, callback) {
  fs.writeFile(path.resolve(process.cwd(), options.output_dir, 'index.html'), generateIndexHTML(options, files), function (err) {
    if (err) return callback(err)

    // Write markdowns into HTML
    var i = 0
    var t = true
    files.forEach(function(name) {
      fs.readFile(path.resolve(process.cwd(), options.input_dir, name), function(err, file) {
        if (t && err) { t = false; return callback(err) }
        var index = files.indexOf(name)
        var html = generateMdHTML(options, file.toString(), files[index-1], files[index+1])

        fs.writeFile(path.resolve(process.cwd(), options.output_dir, getFilename(name) + '.html'), html, function (err) {
          if (t && err) { t = false; return callback(err) }
          i++

          if (files.length === i) {
            callback()
          }
        })
      })
    })
  })
}

// Helpers live here

function generateMdHTML(options, text, previous, next) {
  var template = getTemplate(options.header, options.footer)
  var html = marked(text)
  return template({
    content: html, 
    previous: getFilename(previous),
    next: getFilename(next)
  })
}

function generateIndexHTML(options, files) {
  var template = getTemplate(options.header, options.footer)
  var list = files.map(function(file) {
    var name = getFilename(file)
    return { href: name + '.html', name: name }
  })
  return template({index: list})
}

function getFilename(name) {
  return name ? path.basename(name, path.extname(name)) : ""
}

function getTemplate(header, footer) {
  file = fs.readFileSync(__dirname + '/template/index.html').toString()
  hb.registerPartial('header', (header || "Submarine"))
  hb.registerPartial('footer', (footer || ""))
  return hb.compile(file.toString())
}
