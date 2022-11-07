const path = require('path')
const { readdir, stat } = require('fs')

const fullPath = path.join(__dirname, 'secret-folder')

readdir(fullPath, (err, i) => {
  i.forEach((item) => {
    let fileProperties = path.parse(item)
    stat(path.resolve(fullPath, item), (err, file) => {
      if (!file.isFile()) {
        return
      }

      console.log(
        `${fileProperties.name} - ${fileProperties.ext.replace('.', '')} - ${
          file.size / 1024
        } kb`
      )
    })
  })
})
