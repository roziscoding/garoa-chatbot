'use strict'

const mainFn = ({ msg }) => {
  if (msg.reply_to_message) {
    return `${msg.reply_to_message.from.first_name}: ${msg.reply_to_message.from.id}`
  }

  const message = [`${msg.from.first_name}: ${msg.from.id}`]  

  if (['group', 'supergroup'].includes(msg.chat.type)) {
    message.push(`${msg.chat.title}: ${msg.chat.id}`)
  }

  return message.join('\n')
}

const fn = async ({ msg, responseTypes }) => {
  return [ {
    type: responseTypes.TEXT,
    content: await mainFn({ msg })
  } ]
}

fn.reply = true

fn.regex = /\/id/

module.exports = fn
