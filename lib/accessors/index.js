'use strict'

const {
  bot: BotAccessor
} = require('./accessors')

const factory = (bot) => {
  return {
    bot: new BotAccessor(bot)
  }
}

module.exports = factory
