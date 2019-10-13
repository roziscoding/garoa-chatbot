'use strict'

const DomainError = require('../lib/DomainError')
const kickChatMember = require('../util/kick-chat-member')

const fn = async ({ query, match, repositories: { votings: votingsRepository }, responseTypes, config }) => {
  if (!match.groups || !match.groups.votingId) return []
  const msg = query.message
  const { votingId } = match.groups

  const voting = await votingsRepository.findById(votingId)

  if (!voting) return []

  const voterIds = voting.votes.map(vote => vote.id)

  if (voterIds.includes(msg.from.id)) {
    throw new DomainError(`Você já votou para banir ${voting.target.name}!`)
  }

  const result = []

  const vote = {
    id: msg.from.id,
    name: msg.from.first_name,
    username: msg.from.username
  }

  const updatedVoting = await votingsRepository.addVote(voting._id, vote)

  result.push({
    type: responseTypes.ALERT,
    queryId: query.id,
    content: {
      type: 'text',
      value: 'Voto computado com sucesso'
    }
  })

  result.push({
    type: responseTypes.TEXT,
    content: `${query.from.first_name} votou para banir ${voting.target.name}. Total de votos: ${updatedVoting.votes.length}`
  })

  if (updatedVoting.votes.length >= config.voteban.minVotes) {
    return [
      ...result,
      await kickChatMember(chat, updatedVoting, votingsRepository, responseTypes)
    ]
  }

  return result
}

fn.regex = /voteban_(?<votingId>.+)/

module.exports = fn
