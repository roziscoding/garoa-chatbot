const votings = new Map()

const messages = {
  ERR_WRONG_CHAT_TYPE: 'Esse comando só pode ser executado em grupos!',
  ERR_NO_ID: 'Você precisa dar reply em quem quiser banir, ou usar `/voteban_[id do usuário]`'
}

const makeReport = (user, userVotings, config) => {
  const lines = []
  lines.push(`Usuario: ${user.first_name}`)
  lines.push(`Motivo: ${userVotings.reason}`)
  lines.push(`Votos: ${userVotings.count}`)
  lines.push(`Vai ser banido quando tiver ${config.voteban.minVotes} votos.`)
  lines.push(`Vote com /voteban_${user.id}`)
  return lines.join('\n')
}

const countUp = (chatId, user, reason, fromId, config) => {
  let chatVotings = votings.get(chatId)

  if (!chatVotings) {
    chatVotings = new Map()
    votings.set(chatId, chatVotings)
  }

  let userVotings = chatVotings.get(user.id) || {
    count: 0,
    reason: reason || 'Sem motivo',
    votes: []
  }

  if (userVotings.votes.includes(fromId)) {
    fn.reply = true
    return `Você já votou para banir ${user.first_name}. Status atual: ${userVotings.count} votos computados de ${config.voteban.minVotes} necessários para o ban`
  }

  userVotings.votes.push(fromId)

  userVotings.count++

  chatVotings.set(user.id, userVotings)

  votings.set(chatId, chatVotings)

  return userVotings
}

const clear = (chatId, userId, fromId) => {
  const chatVotings = votings.get(chatId)
  chatVotings.delete(userId)
  votings.set(chatId, chatVotings)
}

const fn = async (msg, match, bot, config) => {
  if (!msg.chat.type.includes('group')) {
    console.log(msg.chat.type)
    throw new Error(messages.ERR_WRONG_CHAT_TYPE)
  }

  if (!msg.reply_to_message && !match[1]) {
    throw new Error(messages.ERR_NO_ID)
  }

  const chatId = msg.chat.id
  const user = msg.reply_to_message
    ? msg.reply_to_message.from
    : (await bot.getChatMember(msg.chat.id, match[1])).user

  if (user.id === msg.from.id) {
    bot.kickChatMember(msg.chat.id, msg.from.id)
    clear(chatId, user.id)
    return `Banindo ${user.first_name} por espontânea vontade!`
  }

  const userVotings = countUp(chatId.toString(), user, match[2], msg.from.id, config)

  if (typeof userVotings === 'string') {
    return userVotings
  }

  if (userVotings.count === 1) {
    return makeReport(user, userVotings, config)
  }

  if (userVotings.count >= config.voteban.minVotes) {
    clear(chatId.toString(), user.id)
    await bot.kickChatMember(chatId, user.id)
    return `Banindo ${user.first_name}.\nMotivo: ${userVotings.reason}`
  }

  return makeReport(user, userVotings, config)
}

fn.markdown = false

fn.regex = /\/voteban_?(\d+)? ?(.+)?/

module.exports = fn
