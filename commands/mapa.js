'use strict'

const fn = async ({ msg, match, config, responseTypes }) => {

  return [ {
    type: responseTypes.LOCATION,
    latitude: -23.5649902,
    longitude: -46.6990641,
    options: {
      reply_to_message_id: msg.message_id
    }
  } ]
}

fn.regex = /^\/mapa/

module.exports = fn
