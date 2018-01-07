const fn = async (msg, match, bot) => {
  const chatLink = await bot.exportChatInviteLink(msg.chat.id)
  return `Link do grupo: ${chatLink}`
}

fn.regex = /\/link/

module.exports = fn
