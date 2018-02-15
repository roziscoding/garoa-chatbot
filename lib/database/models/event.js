'use strict'

const { Schema } = require('mongoose')

const properties = {
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false,
    default: () => null
  },
  time: {
    type: String,
    required: false,
    default: () => null
  },
  place: {
    type: String,
    required: false,
    default: 'Garoa Hacker Clube'
  }
}

const options = {
  id: false,
  collection: 'events',
  strict: true,
  safe: true,
  timestamps: false
}

const schema = new Schema(properties, options)

const factory = connection => {
  return connection.model('Event', schema)
}

module.exports = schema
module.exports.factory = factory
