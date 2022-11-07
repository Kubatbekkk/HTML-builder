const fs = require('fs')
const {
  rm,
  mkdir,
  readFile,
  readdir,
  writeFile,
  copyFile,
} = require('fs/promises')
const path = require('path')

const styles = path.join(__dirname, 'styles')
const assets = path.join(__dirname, 'assets')
// очистка для дальнейшей работы
async function clear() {
  await rm(path.resolve(__dirname, 'project-dist'), {
    recursive: true,
    force: true,
  })
}
// создание директории
async function mkDir() {
  await mkdir(
    path.join(__dirname, 'project-dist', 'assets'),
    { recursive: true },
    (err) => {
      if (err) {
        throw new Error(err)
      }
    }
  )
}
// копирование файлов

async function copyFolder() {
  readdir(assets, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      const fileFrom = path.join(__dirname, 'assets', file.name)
      const fileTo = path.join(__dirname, 'project-dist', 'assets', file.name)
      if (file.isFile()) {
        copyFile(fileFrom, fileTo)
      } else {
        readdir(fileFrom, { withFileTypes: true }).then((direction) => {
          mkdir(path.join(__dirname, 'project-dist', `assets/${file.name}`), {
            recursive: true,
          })
          direction.forEach((dirFile) => {
            const from = path.join(fileFrom, dirFile.name)
            const to = path.join(fileTo, dirFile.name)
            copyFile(from, to)
          })
        })
      }
    })
  })
}
// создание бандла из стилей
function createStylesBundle() {
  readdir(styles, { withFileTypes: true }).then((elements) => {
    const writer = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css')
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
}
// обработка шаблона и создание точки выходного файла
async function htmlBuilder() {
  const template = path.join(__dirname, 'template.html')
  let tempRead = await readFile(template, 'utf-8')
  const compDir = path.join(__dirname, 'components')
  const comps = await readdir(compDir)
  for (let file of comps) {
    const ext = path.extname(file)
    if (ext == '.html') {
      const compName = path.parse(path.join(compDir, file)).name
      let compRead = await readFile(path.join(compDir, file))
      tempRead = tempRead.replace(`{{${compName}}}`, compRead)
    }
  }
  writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    tempRead,
    (err) => {
      if (err) {
        throw err
      }
    }
  )
}
// главная функция как точка входа
async function indexFn() {
  await clear()
  await mkDir()
  await copyFolder()
  createStylesBundle()
  await htmlBuilder()
  return true
}
indexFn()
