'use strict'

const mongoose = require('mongoose')
const { chat } = require('./models')
const { Chats } = require('./repositories')

mongoose.Promise = global.Promise

const factory = config => {
  const { uri, options = {} } = config

  const connection = mongoose.createConnection(uri, options)

  const models = {
    Chat: chat.factory(connection)
  }

  const repositories = {
    chats: new Chats(models.Chat)
  }

  return { connection, models, repositories }
}

module.exports = { factory }
