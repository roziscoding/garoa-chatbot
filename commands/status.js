const axios = require('axios')
const config = require('../config')

const API_URL = config.endpoints.garoa

module.exports = async (msg, match) => {
  const { data: { open } } = await axios(API_URL)

  return `O garoa está [${open ? 'aberto' : 'fechado'}](http://garoa.net.br)`
}
