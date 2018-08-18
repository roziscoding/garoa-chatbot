'use strict'

module.exports = async (bot, chatId, { content, options }) => {
  return bot.sendSticker(chatId, content, options)
}
