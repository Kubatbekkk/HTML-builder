const path = require('path')
const fs = require('fs')
const { stdin, stdout, exit } = require('process')

const filePath = path.join(__dirname, 'text.txt')
const writer = fs.createWriteStream(filePath)

stdout.write(`Нажмите Ctrl + C для выхода или введите exit
              Введите текст: `)

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit()
  }
  writer.write(data.toString())
})

process.on('exit', () => {
  stdout.write('\nЗапись выполнена')
})

process.on('SIGINT', exit)
