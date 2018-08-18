'use strict'

const moment = require('moment')

const makeCreatedString = (event, name, time, date) => {
  const start = `Evento ${name} agendado para as ${time} horas`
  const end = date
    ? ` do dia ${date}`
    : `, sem data.`

  return `${start}${end}`
}

const mainFn = async ({ repositories, match }) => {
  const [ name, time, date ] = match[ 1 ].split('::')

  if (!name || !time) {
    return 'Informe o evento no padrão `nome::hora::data`! (A data é opcional)'
  }

  if (!date) {
    const event = await repositories.events.create({ name, time })
    return makeCreatedString(event, name, time)
  }

  const parsedDate = moment(date, 'DD/MM/YYYY').toDate()

  const event = await repositories.events.create({ name, time, date: parsedDate })

  return makeCreatedString(event, name, time, date)
}

const fn = async ({ repositories, match, responseTypes }) => {
  return [ {
    type: responseTypes.TEXT,
    content: await mainFn({ repositories, match })
  } ]
}

module.exports = fn
module.exports.regex = /\/newevent (.*)/
