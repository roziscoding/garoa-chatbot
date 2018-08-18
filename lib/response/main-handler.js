'use strict'

const handlers = require('./handlers')

module.exports = async (bot, chatId, responses) => {
  for (const response of responses) {
    const handler = handlers[ response.type ]

    if (!handler) {
      throw new Error(`No handler for type ${response.type}`)
    }

    await handler(bot, chatId, response)
  }
}
