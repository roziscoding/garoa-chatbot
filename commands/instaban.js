const canBan = member => !member.can_restrict_members && member.status === 'creator'

const fn = async (msg, match, bot) => {
  if (!msg.reply_to_message) {
    throw new Error('Você precisa responder a uma mensagem de alguém que deseja banir!')
  }

  const member = await bot.getChatMember(msg.chat.id, msg.from.id)

  if (!canBan(member)) {
    throw new Error('Você precisa ter permissão para banir usuários para usar este comando!')
  }

  const user = msg.reply_to_message.from

  await bot.sendMessage(msg.chat.id, `Banindo [${user.first_name}](tg://user?id=${user.id}) pelos poderes do banhammer investidos a [${msg.from.first_name}](tg://user?id=${msg.from.id})`, {
    parse_mode: 'Markdown'
  })
  await bot.kickChatMember(msg.chat.id, user.id)
  return 'Usuário banido'
}

fn.reply = true

module.exports = fn
