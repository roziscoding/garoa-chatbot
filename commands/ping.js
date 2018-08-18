'use strict'

const fn = async ({ responseTypes }) => {
  return [{
    type: responseTypes.TEXT,
    content: 'pong'
  }]
}

fn.regex = /\/ping/

module.exports = fn
