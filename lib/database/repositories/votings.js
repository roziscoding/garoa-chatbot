'use strict'

class VotingsRepository {
  constructor (model) {
    this.$model = model
  }

  /**
   * Creates a new voting to banish a specific member from a group
   * @param {Object} data Data about the voting to be created
   * @returns {Object} Newly created voting with an _id property
   */
  async create (data) {
    const {
      chatId, // ObjectId of the chat where the voting occurs
      target, // Member object describing the target of the voting
      reason = null, // Reason specified for the ban
      creator // Creator and, thus, first vote pro ban
    } = data

    const document = await this.$model.create({
      chat: chatId,
      target,
      reason,
      votes: [creator]
    })

    return document.toObject()
  }

  /**
   * Returns all votings of a given chat
   * @param {ObjectId} chatId Id of the chat to retrieve votings for
   * @returns {Array<Object>} Array of voting objects found fot the given chat
   */
  async findByChat (chatId) {
    return this.$model.find({ chat: chatId })
      .lean()
  }

  /**
   * Returns a voting for a specific user in a specific chat
   * @param {ObjectId} chatId ObjectId of the chat which the target belongs to
   * @param {Number} memberId UserId of the target of the voting
   * @returns {(Object|null)} Voting object or null if no voting is found
   */
  async findByChatMember (chatId, memberId) {
    return this.$model.findOne({
      chat: chatId,
      'target.id': memberId
    })
      .lean()
  }

  async removeByChatMember (chatId, memberId) {
    const document = await this.$model.findOneAndRemove({
      chat: chatId,
      'target.id': memberId
    })

    return document.toObject()
  }

  async addVote (voting, vote) {
    const update = {
      $push: {
        votes: vote
      }
    }
    const updatedVoting = await this.$model.findOneAndUpdate({ _id: voting }, update, { new: true })

    return updatedVoting.toObject()
  }
}

module.exports = VotingsRepository
