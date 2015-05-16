var fs = require('fs')
var filenames = ['hello_world', 'cool_story_world', 'sup_world', 'yolo_world']
var path = require('path')

module.exports = function (inputPath, callback) {
  var i = 0

  // Create content dir
  fs.mkdir(inputPath, function (err) {
    if (err) {
      return console.log(err)
    }
  })

  // Create markdown content
  filenames.forEach(function (name) {
    i++
    var md = '# ' + name + '\n**' + name + '**, wow!'

    fs.writeFile(path.resolve(inputPath, name + '.md'), md, function (err) {
      if (err) {
        return console.log(err)
      }
    })
  })

  callback(filenames)
}
