'use strict'

const mongoose = require('mongoose')
const { chat, voting, event } = require('./models')
const { Chats, Votings, Events } = require('./repositories')

mongoose.Promise = global.Promise

const factory = config => {
  const { uri, options = { useMongoClient: true } } = config

  const connection = mongoose.createConnection(uri, options)

  const models = {
    Chat: chat.factory(connection),
    Voting: voting.factory(connection),
    Event: event.factory(connection)
  }

  const repositories = {
    chats: new Chats(models.Chat),
    votings: new Votings(models.Voting),
    events: new Events(models.Event)
  }

  return { connection, models, repositories }
}

module.exports = { factory }
