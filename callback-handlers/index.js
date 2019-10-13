handlers = {
  voteban: require('./voteban')
}

module.exports = {
  getHandler (text) {
    return Object.values(handlers).find(handler => text.match(handler.regex)) || null
  }
}
