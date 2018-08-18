'use strict'

const fn = async ({ responseTypes }) => {
  return [{
    type: responseTypes.TEXT,
    content: 'ninguem liga'
  }]
}

fn.regex = /\/quemliga/

module.exports = fn
