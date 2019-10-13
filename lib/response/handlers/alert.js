'use strict'

/**
 * Handles replies to a callback query
 * @param {Bot} bot Bot instance
 * @param {string} queryId Id of the query
 * @param {object} response Params to reply to the callback query
 */
async function handle (bot, _, response) {
  const { content: { type: contentType, value: contentValue }, queryId } = response
  const { showAlert = false, ...options } = response.options || { showAlert: false }

  await bot.answerCallbackQuery({
    callback_query_id: queryId,
    show_alert: showAlert,
    [contentType === 'text' ? 'text' : 'url']: contentValue,
    ...options
  })
}

module.exports = handle
