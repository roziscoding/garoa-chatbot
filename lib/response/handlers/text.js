'use strict'

const emoji = require('node-emoji')

module.exports = async (bot, chatId, { content, options: { emojify = false, ...options } = {} }) => {
  const text = emojify
    ? emoji.emojify(content)
    : content

  await bot.sendMessage(chatId, text, options)
}
