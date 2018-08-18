'use strict'

const moment = require('moment')

const mainFn = async ({ repositories, chat }) => {
  const events = await repositories.events.list()

  if (!events.length) {
    return 'Nenhum evento cadastrado até agora!'
  }

  return events.reduce((result, event) => {
    if (!event.date) {
      result.push(`${event.name} às ${event.time}, sem data.`)
      return result
    }

    const formattedDate = moment(event.date).format('DD/MM/YYYY')
    result.push(`${event.name}: ${event.time} do dia ${formattedDate}`)
    return result
  }, [ 'Eventos cadastrados:' ])
    .join('\n')
}

const fn = async ({ repositories, chat, responseTypes }) => {
  const result = await mainFn({ repositories, chat })

  return [ {
    type: responseTypes.TEXT,
    content: result
  } ]
}

module.exports = fn
module.exports.regex = /\/events/
