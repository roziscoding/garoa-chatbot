'use strict'

module.exports = async (bot, chatId, { latitude, longitude, options }) => {
  return bot.sendLocation(chatId, latitude, longitude, options)
}
