'use strict'

const types = require('../types')

module.exports = {
  [types.ACTION]: require('./action'),
  [types.TEXT]: require('./text'),
  [types.STICKER]: require('./sticker'),
  [types.LOCATION]: require('./location'),
  [types.ALERT]: require('./alert')
}
