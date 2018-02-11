'use strict'

class ChatRepository {
  /**
   * @param {Object} model Chat model.
   */
  constructor (model) {
    this.$model = model
  }

  /**
   * Find a chat by its Telegram chat id
   * @param {Number} id ID of the chat to be found
   */
  async findById (id) {
    return this.$model.findOne({ id })
      .lean()
  }

  /**
   * Creates a chat given its id
   * @param {Object} chat Chat data to be inserted to the
   *                      database
   */
  async create ({ id, type }) {
    const document = this.$model.create({ id, type })

    return document.toObject()
  }
}

module.exports = ChatRepository
