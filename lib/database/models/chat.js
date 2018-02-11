'use strict'

const { Schema } = require('mongoose')

const properties = {
  id: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['private', 'group', 'supergroup', 'channel']
  }
}

const options = {
  id: false,
  collection: 'chats',
  strict: true,
  safe: true,
  timestamps: false
}

const schema = new Schema(properties, options)

const factory = connection => {
  return connection.model('Chat', schema)
}

module.exports = schema
module.exports.factory = factory
