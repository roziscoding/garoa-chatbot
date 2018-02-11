'use strict'

const mongoose = require('mongoose')
const { chat, voting } = require('./models')
const { Chats, Votings } = require('./repositories')

mongoose.Promise = global.Promise

const factory = config => {
  const { uri, options = {} } = config

  const connection = mongoose.createConnection(uri, options)

  const models = {
    Chat: chat.factory(connection),
    Voting: voting.factory(connection)
  }

  const repositories = {
    chats: new Chats(models.Chat),
    votings: new Votings(models.Voting)
  }

  return { connection, models, repositories }
}

module.exports = { factory }
