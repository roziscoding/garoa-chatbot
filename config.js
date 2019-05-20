'use strict'

module.exports = {
  telegram: {
    API_TOKEN: process.env.API_TOKEN,
    webhook: {
      hostname: process.env.TELEGRAM_WEBHOOK_HOSTNAME,
      bindingHost: process.env.TELEGRAM_WEBHOOK_BINDINGHOST,
      port: parseInt(process.env.TELEGRAM_WEBHOOK_PORT || process.env.PORT || 3000, 10)
    }
  },
  endpoints: {
    garoa: process.env.GAROA_API || 'http://garoahc.appspot.com/status'
  },
  voteban: {
    minVotes: parseInt(process.env.MIN_VOTES) || 10
  },
  database: {
    uri: process.env.MONGO_URI
  }
}
