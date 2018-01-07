const axios = require('axios')

const fn = async (msg, match, bot, config) => {
  const { data: { open } } = await axios(config.endpoints.garoa)

  return `O garoa está [${open ? 'aberto' : 'fechado'}](http://garoa.net.br)`
}

fn.regex = /\/status/

module.exports = fn