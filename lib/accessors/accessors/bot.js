'use strict'

class BotAccessor {
  constructor (bot) {
    this.$bot = bot
  }

  getChatMember (chatId, memberId) {
    return this.$bot.getChatMember(chatId, memberId)
  }

  getChatLid (chatId) {
    return this.$bot.exportChatInviteLink(chatId)
  }
}

module.exports = BotAccessor
