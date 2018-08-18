'use strict'

const fn = async ({ responseTypes }) => {
  return [{
    type: responseTypes.TEXT,
    content: 'Link do meu repositório no GitHub: https://github.com/rjmunhoz/garoa-chatbot/'
  }]
}

fn.regex = /\/repo/

module.exports = fn
