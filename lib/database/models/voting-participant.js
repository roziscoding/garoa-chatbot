'use strict'

const { Schema } = require('mongoose')

const properties = {
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false,
    default: () => null
  }
}

const options = {
  id: false,
  _id: false,
  strict: true,
  safe: true,
  timestamps: false,
  versionKey: false
}

const schema = new Schema(properties, options)

const factory = connection => {
  throw new Error('Cannot instantiate subdocument!')
}

module.exports = schema
module.exports.factory = factory
