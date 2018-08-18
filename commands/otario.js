'use strict'

const FILE_ID = 'CAADAQADXAIAAggBeQdw-0KxiDBssgI'

const fun = ({ responseTypes }) => {
  return [ {
    type: responseTypes.TEXT,
    content: 'Achou que não ia ter referência de choque de cultura nesse bot?!'
  }, {
    type: responseTypes.STICKER,
    content: FILE_ID
  } ]
}

fun.regex = /^\/(otario|choque)/ig
fun.reply = true

module.exports = fun
