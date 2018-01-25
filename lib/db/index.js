const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

module.exports = class Database {
  constructor (config) {
    this.config = config
  }

  async connect () {
    return new Promise((resolve, reject) => {
      mongoose.connect(this.config.db.CONNSTRING)
      mongoose.connection.on('connected', resolve)
      mongoose.connection.on('error', reject)
    })
  }
}