'use strict'

module.exports = async (bot, chatId, { content, options }) => {
  await bot.sendMessage(chatId, content, options)
}
