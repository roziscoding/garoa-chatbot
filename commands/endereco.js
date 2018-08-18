'use strict'

const fun = ({ responseTypes }) => {
  return [{
    type: responseTypes.TEXT,
    content: ' R. Costa Carvalho, 567 - Fundos - Pinheiros, São Paulo - SP, 05429-130'
  }]
}

fun.regex = /^\/(endereco|end|endereço|ende)/ig
fun.reply = true

module.exports = fun
