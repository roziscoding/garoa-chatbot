'use strict'

const kickChatMember = require('../util/kick-chat-member')

const messages = {
  ERR_WRONG_CHAT_TYPE: 'Esse comando só pode ser executado em grupos!',
  ERR_NO_ID: 'Você precisa dar reply em quem quiser banir, ou usar `/voteban_[id do usuário]`'
}

const makeReport = (voting, config) => {
  const lines = []
  lines.push(`Usuario: ${voting.target.name}`)
  lines.push(`Motivo: ${voting.reason}`)
  lines.push(`Votos: ${voting.votes.length}`)
  lines.push(`Vai ser banido quando tiver ${config.voteban.minVotes} votos.`)
  return lines.join('\n')
}

function makeKeyboardMarkup (votingId, targetName) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{
          text: `Votar para banir ${targetName}`,
          callback_data: `voteban_${votingId}`
        }]
      ]
    }
  }
}

const fn = async ({ msg, match, config, chat, repositories, accessors, responseTypes }) => {
  const result = []
  const votingsRepository = repositories.votings

  if (!chat.type.includes('group')) {
    throw new Error(messages.ERR_WRONG_CHAT_TYPE)
  }

  if (!msg.reply_to_message && !match[ 1 ]) {
    throw new Error(messages.ERR_NO_ID)
  }

  const chatId = chat._id
  const targetUser = msg.reply_to_message
    ? msg.reply_to_message.from
    : (await accessors.bot.getChatMember(chat.id, match[ 1 ])).user

  if (targetUser.id === msg.from.id) {
    const member = await accessors.bot.getChatMember(chat.id, targetUser.id)
    if ([ 'creator', 'administrator' ].includes(member.status)) {
      return [ {
        type: responseTypes.TEXT,
        content: `Não consigo te remover; saia sozinho!`
      } ]
    }

    result.push({
      type: responseTypes.TEXT,
      content: `Banindo ${targetUser.first_name} por espontânea vontade!`
    })

    result.push({
      type: responseTypes.ACTION,
      action: 'kickChatMember',
      parameters: [
        msg.chat.id,
        msg.from.id
      ]
    })

    return result
  }

  const vote = {
    id: msg.from.id,
    name: msg.from.first_name,
    username: msg.from.username
  }

  const currentVoting = await votingsRepository.findByChatMember(chatId, targetUser.id)

  if (!currentVoting) {
    const target = {
      id: targetUser.id,
      name: targetUser.first_name,
      username: targetUser.username
    }

    const reason = match[ 2 ] || 'Sem motivo'

    const newVoting = await votingsRepository.create({
      chatId,
      target,
      reason,
      creator: vote
    })

    result.push({
      type: responseTypes.TEXT,
      content: makeReport(newVoting, config),
      options: makeKeyboardMarkup(newVoting._id, target.name)
    })

    return result
  }

  const voteCount = currentVoting.votes.length

  return [
    {
      type: responseTypes.TEXT,
      content: `Já existe uma votação com ${currentVoting.votes.length} voto${voteCount > 1 ? 's' : ''} para banir ${currentVoting.target.name}.\nPara votar, clique no botão abaixo`,
      options: makeKeyboardMarkup(currentVoting._id, currentVoting.target.name)
    }
  ]
}

fn.markdown = false

fn.regex = /\/voteban_?(\d+)?@?[^\s]* ?(.+)?/

module.exports = fn
