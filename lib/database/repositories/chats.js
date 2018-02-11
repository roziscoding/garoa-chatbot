'use strict'

class ChatRepository {
  /**
   * @param {Object} model Chat model.
   */
  constructor (model, votingsRepository) {
    this.$model = model
    this.$votingsRepository = votingsRepository
  }

  /**
   * Find a chat by its Telegram chat id
   * @param {Number} id ID of the chat to be found
   */
  async findById (id) {
    return this.$model.findOne({ id })
      .populate('votings')
      .lean()
  }

  /**
   * Registers a new chat on the database
   * @param {Object} chat Chat data to be inserted to the
   *                      database
   */
  async create ({ id, type }) {
    const document = await this.$model.create({ id, type })

    return document.toObject()
  }
}

module.exports = ChatRepository
