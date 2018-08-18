'use strict'

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
  lines.push(`Vote com /voteban_${voting.target.id}`)
  return lines.join('\n')
}

const kickChatMember = async (chat, voting, repository, responseTypes) => {
  const finishedVoting = await repository
    .removeByChatMember(voting.chat, voting.target.id)

  const { target, votes } = finishedVoting

  const voterNames = votes.map(vote => vote.name)

  const message = voterNames.reduce((result, name) => {
    result.push(name)
    return result
  }, [ `Removendo ${target.name}, conforme votado por:` ])
    .join('\n')

  const result = [ {
    type: responseTypes.TEXT,
    content: message
  }, {
    type: responseTypes.ACTION,
    action: 'kickChatMember',
    parameters: [
      chat.id,
      voting.target.id
    ]
  } ]

  return result
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
      content: makeReport(newVoting, config)
    })

    return result
  }

  const voterIds = currentVoting.votes.map(vote => vote.id)

  if (voterIds.includes(msg.from.id)) {
    return [ {
      type: responseTypes.TEXT,
      content: `Você já votou para banir ${currentVoting.target.name}!`
    } ]
  }

  const updatedVoting = await votingsRepository.addVote(currentVoting._id, vote)

  if (updatedVoting.votes.length >= config.voteban.minVotes) {
    return kickChatMember(chat, updatedVoting, votingsRepository, responseTypes)
  }

  return result
}

fn.markdown = false

fn.regex = /\/voteban_?(\d+)?@?[^\s]* ?(.+)?/

module.exports = fn
