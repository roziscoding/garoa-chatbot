module.exports = async (msg, match, bot) => {
  const chatLink = await bot.exportChatInviteLink(msg.chat.id)
  return `Link do grupo: ${chatLink}`
}
