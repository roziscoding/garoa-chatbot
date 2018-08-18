'use strict'

const canBan = member => member.can_restrict_members || member.status === 'creator'

const fn = async ({ msg, match, responseTypes, accessors }) => {
  const result = []

  if (!msg.reply_to_message) {
    throw new Error('Você precisa responder a uma mensagem de alguém que deseja banir!')
  }

  const member = await accessors.bot.getChatMember(msg.chat.id, msg.from.id)

  if (!canBan(member)) {
    throw new Error('Você precisa ter permissão para banir usuários para usar este comando!')
  }

  const user = msg.reply_to_message.from

  result.push({
    type: responseTypes.TEXT,
    content: `Banindo [${user.first_name}](tg://user?id=${user.id}) pelos poderes do banhammer investidos a [${msg.from.first_name}](tg://user?id=${msg.from.id})`,
    options: {
      parse_mode: 'Markdown'
    }
  })

  result.push({
    type: responseTypes.ACTION,
    action: 'kickChatMember',
    parameters: [
      msg.chat.id,
      user.id
    ]
  })

  result.push({
    type: responseTypes.TEXT,
    content: 'Usuário banido'
  })

  return result
}

fn.reply = true

fn.regex = /\/instaban/

module.exports = fn
