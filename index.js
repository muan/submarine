var fs = require('fs')
var path = require('path')
var marked = require('marked')
var hb = require('handlebars')
var ncp = require('ncp')
var t = true
var i = 0

module.exports = submarine

function submarine (options, callback) {
  options.header = options.header || 'Submarine'
  options.footer = options.footer || ''

  var input = path.resolve(process.cwd(), options.input_dir)
  var invalidInput = !fs.existsSync(input)

  if (invalidInput) {
    callback('\x1B[91mThe input directory `./' + options.input_dir + '` does not exist.\x1B[0m')
  } else if (!options.output_dir) {
    callback('\x1B[91mPlease provide an output directory.\x1B[0m')
  } else {
    boardSubmarine(options)
  }

  function boardSubmarine (options) {
    createFolderMaybe(options.output_dir, function () {
      fs.readdir(path.resolve(process.cwd(), options.input_dir), function (err, files) {
        if (t && err) { t = false; return callback(err) }

        files = files.filter(function (n) {
          return n.match(/.+\..+$/)
        }).sort()

        makeFiles(files, options, callback)
      })
    })
  }

  function createFolderMaybe (output_dir, proceed) {
    // Create output_dir if doesn't exist
    if (!fs.existsSync(path.resolve(process.cwd(), output_dir))) {
      fs.mkdir(path.resolve(process.cwd(), output_dir), function (err) {
        if (t && err) { t = false; return callback(err) }

        proceed()
      })
    } else {
      proceed()
    }
  }

  function getTemplate (proceed) {
    var templatePath

    if (options.template) {
      templatePath = path.resolve(process.cwd(), options.template)
    } else {
      templatePath = path.resolve(__dirname, 'template/index.html')
    }

    if (!fs.existsSync(templatePath)) {
      return callback('\x1B[91mThe template directory `' + templatePath + '` does not exist.\x1B[0m')
    }

    hb.registerPartial('header', (options.header || 'Submarine'))
    hb.registerPartial('footer', (options.footer || ''))

    fs.readFile(templatePath, function (err, data) {
      if (t && err) {
        t = false
        return callback(err)
      }

      var template = hb.compile(data.toString())
      proceed(template)
    })
  }

  function makeFiles (files) {
    copyAssets()

    writeIndex(files, function (err) {
      if (t && err) {
        t = false
        return callback(err)
      }

      // Write markdowns into HTML
      files.forEach(function (name) {
        fs.readFile(path.resolve(process.cwd(), options.input_dir, name), function (err, file) {
          if (t && err) {
            t = false
            return callback(err)
          }

          var index = files.indexOf(name)
          var pages = {
            prev: files[index - 1],
            next: files[index + 1]
          }

          writeHTML(name, file.toString(), pages, function (i) {
            if (files.length === i) {
              callback()
            }
          })
        })
      })
    })
  }

  function copyAssets () {
    var assetsPath

    if (options.assets_dir) {
      assetsPath = path.resolve(process.cwd(), options.assets_dir)
    } else {
      assetsPath = path.resolve(__dirname, 'template/assets')
    }

    // check that the assets directory exists
    if (!fs.existsSync(assetsPath)) {
      return callback('\x1B[91mThe assets directory `' + assetsPath + '` does not exist.\x1B[0m')
    }

    ncp(assetsPath, options.output_dir + '/' + path.basename(assetsPath), function (err) {
      if (t && err) { t = false; return callback(err) }
    })
  }

  function writeHTML (file, filecontent, pages, finishing) {
    getTemplate(function (template) {
      var html = template({
        content: marked(filecontent),
        previous: getFilename(pages.prev),
        next: getFilename(pages.next)
      })

      fs.writeFile(path.resolve(process.cwd(), options.output_dir, getFilename(file) + '.html'), html, function (err) {
        if (t && err) { t = false; return callback(err) }

        i++
        finishing(i)
      })
    })
  }

  function writeIndex (files, proceed) {
    getTemplate(function (template) {
      var list = files.map(function (file) {
        var name = getFilename(file)

        return {
          href: name + '.html',
          name: name
        }
      })

      var html = template({index: list})

      fs.writeFile(path.resolve(process.cwd(), options.output_dir, 'index.html'), html, function (err) {
        proceed(err)
      })
    })
  }
}

function getFilename (name) {
  return name ? path.basename(name, path.extname(name)) : ''
}
