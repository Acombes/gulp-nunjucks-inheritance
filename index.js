const es = require('event-stream')
const vfs = require('vinyl-fs')
const nunjucksGraph = require('nunjucks-graph')

/* Utils */
const union = (...arrays) => {
  const obj = {}

  arrays.forEach(array => {
    if (!(array instanceof Array)) {
      array = [ array ]
    }

    array.forEach(item => {
      obj[ item.toString() ] = ''
    })
  })

  return Object.keys(obj)
}
const getRoots = (graph, files) => files.reduce((results, filePath) => {
  if (graph [ filePath ].parents.length) {
    return union(results, getRoots(graph, graph[ filePath ].parents))
  } else {
    return union(results, filePath)
  }
}, [])


let stream

function gulpNunjucksInheritance (options) {
  options = options || {}

  const files = []

  function writeStream (currentFile) {
    if (currentFile && currentFile.contents.length) {
      files.push(currentFile)
    }
  }

  function endStream () {
    if (files.length) {
      const graph = nunjucksGraph.parseDir(options.base, options).getSimpleIndex()
      const filesPaths = getRoots(graph, files.map(file => file.path))

      vfs.src(filesPaths, { 'base': options.base })
        .pipe(es.through(
          function (f) {
            stream.emit('data', f)
          },
          function () {
            stream.emit('end')
          }
        ))
    } else {
      stream.emit('end')
    }
  }

  stream = es.through(writeStream, endStream)
  return stream
}

module.exports = gulpNunjucksInheritance
