'use strict'

module.exports = async (bot, chatId, { action, parameters }) => {
  return bot[ action ](...parameters)
}
