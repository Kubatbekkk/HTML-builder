const path = require('path')
const { createReadStream } = require('fs')
const { stdout } = require('process')
const rStream = createReadStream(path.join(__dirname, 'text.txt'), 'utf-8')

rStream.pipe(stdout)
rStream.on('error', (err) => {
  console.log(err.message)
})
