var fs        = require('fs')
var tmp       = require('os').tmpdir()
var filenames = ['hello_world', 'cool_story_world', 'sup_world', 'yolo_world']
var path      = require('path')

module.exports = function(inputName, callback) {
  var inputPath = path.resolve(tmp, inputName)
  var i = 0

  // Create content dir
  if(!fs.existsSync(inputPath)) {
    fs.mkdir(inputPath, function(err) {
      if (err) return console.log(err)
    })
  }

  // Create markdown content
  filenames.forEach(function(name) {
    i++
    var index = filenames.indexOf(name)
    var md = '# ' + name + '\n**' + name + '**, wow!'
    
    fs.writeFile(path.resolve(inputPath, name + '.md'), md, function (err) {
      if (err) return console.log(err)
    })
  })

  callback(filenames)
}
