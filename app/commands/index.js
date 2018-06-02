'use strict'

const factory = (app, config) => {
  app.command('echo', require('./echo'))
}

module.exports = { factory }
