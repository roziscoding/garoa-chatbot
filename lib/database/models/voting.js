'use strict'

const { Schema } = require('mongoose')
const Participant = require('./voting-participant')

const properties = {
  chat: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Chat'
  },
  target: {
    type: Participant,
    required: true
  },
  reason: {
    type: String,
    required: false,
    default: () => null
  },
  votes: [{
    type: Participant,
    required: true
  }]
}

const options = {
  id: false,
  collection: 'votings',
  strict: true,
  safe: true,
  timestamps: false
}

const schema = new Schema(properties, options)

const factory = connection => {
  return connection.model('Voting', schema)
}

module.exports = schema
module.exports.factory = factory
