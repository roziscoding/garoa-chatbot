async function kickChatMember (chat, voting, repository, responseTypes) {
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

module.exports = kickChatMember
