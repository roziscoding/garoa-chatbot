const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)

module.exports = {
  async load () {
    const commandFiles = await readdir(path.join(__dirname, 'defs'))
    return commandFiles.reduce((commands, fileName) => {
      const commandName = fileName.split('.')[0]
      commands[commandName] = require(path.join(__dirname, 'defs', fileName))
      return commands
    }, {})
  }
}
