'use strict'

class EventsRepository {
  constructor (model) {
    this.$model = model
  }

  async list () {
    return this.$model.find()
      .lean()
  }

  async create (event) {
    const {
      name = null,
      date = null,
      time = null
    } = event

    const document = await this.$model.create({
      name,
      date,
      time
    })

    return document.toObject()
  }
}

module.exports = EventsRepository
