const path = require('path')
const fs = require('fs')
const { rm, mkdir, readdir, copyFile } = require('fs/promises')

const from = path.join(__dirname, 'files')
const to = path.join(__dirname, 'files-copy')

async function copyFolder(base, target) {
  await rm(target, { recursive: true, force: true })
  await mkdir(target)
  await readdir(base).then((elements) => {
    elements.forEach((item) =>
      copyFile(path.join(base, item), path.join(target, item))
    )
  })
}

copyFolder(from, to)
