'use strict'

module.exports = {
  telegram: {
    API_TOKEN: process.env.API_TOKEN
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
