const fn = msg => {
  if (msg.reply_to_message) {
    return `${msg.reply_to_message.from.first_name}: ${msg.reply_to_message.from.id}`
  }

  return `${msg.from.first_name}: ${msg.from.id}`
}

fn.reply = true

module.exports = fn
