const fn = async ({ msg, match, responseTypes, accessors }) => {
  const chatLink = await accessors.bot.getChatLink(msg.chat.id)
  return [ {
    type: responseTypes.TEXT,
    content: `Link do grupo: ${chatLink}`
  } ]
}

fn.regex = /\/link/

module.exports = fn
