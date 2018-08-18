'use strict'

const axios = require('axios')

const ids = {
  open: 'CAADAQAD8QADBO9jB8Q5ImC_h8fqAg',
  closed: 'CAADAQAD8AADBO9jB1DAGOCS82CUAg'
}

const fn = async ({ msg, match, config, responseTypes }) => {
  const { data: { open } } = await axios(config.endpoints.garoa)

  return [ {
    type: responseTypes.STICKER,
    content: ids[ open ? 'open' : 'closed' ],
    options: {
      reply_to_message_id: msg.message_id
    }
  } ]
}

fn.regex = /^\/status/

module.exports = fn
