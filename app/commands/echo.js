'use strict'

const regex = /echo (.*)/

module.exports = (ctx, next) => {
  const match = ctx.message.text.match(regex)

  const message = match
    ? match[1]
    : null

  ctx.reply(message || 'What would you like me to repeat?')
}
