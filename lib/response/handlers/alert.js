'use strict'

/**
 * Handles replies to a callback query
 * @param {Bot} bot Bot instance
 * @param {string} queryId Id of the query
 * @param {object} response Params to reply to the callback query
 */
async function handle (bot, _, { content, queryId, options }) {
  await bot.answerCallbackQuery({
    callback_query_id: queryId,
    [content.type === 'text' ? 'text' : 'url']: content.value,
    ...options
  })
}

module.exports = handle
