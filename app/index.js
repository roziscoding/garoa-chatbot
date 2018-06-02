'use strict'

const commands = require('./commands')
const botify = require('@rjmunhoz/botify')

module.exports = botify((app, config) => {
  commands.factory(app, config)
})
