'use strict'

const env = require('sugar-env')

module.exports = {
  telegram: {
    token: env.get('TELEGRAM_TOKEN')
  }
}
