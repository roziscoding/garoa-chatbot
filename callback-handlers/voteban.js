'use strict'

const DomainError = require('../lib/DomainError')
const kickChatMember = require('../util/kick-chat-member')

const fn = async ({ query, match, repositories: { votings: votingsRepository }, responseTypes, config, accessors }) => {
  if (!match.groups || !match.groups.votingId) return []
  const msg = query.message
  const { votingId } = match.groups

  const voting = await votingsRepository.findById(votingId)

  if (!voting) return []

  const voterIds = voting.votes.map(vote => vote.id)

  if (voterIds.includes(query.from.id)) {
    throw new DomainError(`Você já votou para banir ${voting.target.name}!`)
  }

  const result = []

  if (voting.target.id === query.from.id) {
    throw new DomainError('Você não pode votar para banir a si mesmo')
  }

  const vote = {
    id: query.from.id,
    name: query.from.first_name,
    username: query.from.username
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
    content: `[${query.from.username || query.from.first_name}](tg://user?id=${query.from.id}) votou para banir ${voting.target.name}. Total de votos: ${updatedVoting.votes.length}`,
    options: {
      parse_mode: 'Markdown'
    }
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
