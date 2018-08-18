'use strict'

const helpText = []

helpText.push('/voteban {motivo} - Inicia votação para banir um usuário (Só funciona com reply)')
helpText.push('/voteban_id_do_usuario - Adiciona um voto a favor do ban do usuário')
helpText.push('/status - Informa o status atual do Garoa')
helpText.push('/id - Retorna o ID do usuário que enviou a mensagem respondida (ou o seu ID caso não haja reply)')

const fn = async ({ msg, responseTypes }) => {
  return [ {
    type: responseTypes.TEXT,
    content: [ helpText.join('\n') ]
  } ]
}

fn.markdown = false

fn.regex = /\/help/

module.exports = fn
