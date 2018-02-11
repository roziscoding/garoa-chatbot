'use strict'

const fn = async ({ repositories, chat }) => {
  const votings = await repositories.votings.findByChat(chat._id)

  if (votings.length <= 0) {
    return `Nenhum voteban em progresso para este grupo`
  }

  return votings.reduce((result, voting) => {
    const s = voting.votes.length === 1 ? '' : 's'
    result.push(`${voting.target.name}: ${voting.votes.length} voto${s}`)
    return result
  }, [`Votebans em progresso:`])
    .join('\n')
}

fn.regex = /\/votings/

module.exports = fn
