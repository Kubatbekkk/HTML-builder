const path = require('path')
const fs = require('fs')
const { readdir } = require('fs/promises')
const styles = path.join(__dirname, 'styles')

readdir(styles, { withFileTypes: true }).then((elements) => {
  const writer = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css')
  )
  elements.forEach((item) => {
    const filePath = path.join(styles, item.name)
    const name = path.basename(filePath)
    const type = path.extname(filePath)

    if (type === '.css') {
      const watch = fs.createReadStream(path.join(styles, name))
      watch.on('data', (data) => {
        writer.write(data + '\n')
      })
    }
  })
})
