'use strict'

const fn = async ({ msg, match, responseTypes, accessors }) => {
  const chatLink = "https://t.me/garoactf"
  return [ {
    type: responseTypes.TEXT,
    content: `Link do grupo: ${chatLink}`
  } ]
}

fn.regex = /\/link/

module.exports = fn
