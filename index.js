const config = require('./config')
const commands = require('./commands')
const TelegramBot = require('node-telegram-bot-api')

const runCommand = async ({bot, command, msg, match, err}) => {
  let text
  try {
    text = await command(msg, match, bot)
  } catch (e) {
    return err(e)
  }

  const options = {}

  if (command.reply) {
    options.reply_to_message_id = msg.message_id
  }

  if (command.markdown !== false) {
    options.parse_mode = 'Markdown'
  }

  bot.sendMessage(msg.chat.id, text, options)
  .catch(err)
}

const sendError = (bot, msg) => {
  return (err) => {
    console.error(err)
    bot.sendMessage(msg.chat.id, `Erro ao executar comando: ${err.message}`, {
      parse_mode: 'Markdown'
    })
  }
}

const setupCommands = bot => async () => {
  bot.onText(/\/help/, (msg, match) => runCommand({
    bot,
    command: commands.help,
    msg,
    match,
    err: sendError(bot, msg)
  }))

  bot.onText(/\/status/, (msg, match) => runCommand({
    bot,
    command: commands.status,
    msg,
    match,
    err: sendError(bot, msg)
  }))

  bot.onText(/\/voteban_?(\d+)? ?(.+)?/, (msg, match) => runCommand({
    bot,
    command: commands.voteban,
    msg,
    match,
    err: sendError(bot, msg)
  }))

  bot.onText(/\/id/, (msg, match) => runCommand({
    bot,
    command: commands.id,
    msg,
    match,
    err: sendError(bot, msg)
  }))

  bot.onText(/\/instaban/, (msg, match) => runCommand({
    bot,
    command: commands.instaban,
    msg,
    match,
    err: sendError(bot, msg)
  }))

  bot.onText(/\/link/, (msg, match) => runCommand({
    bot,
    command: commands.link,
    msg,
    match,
    err: sendError(bot, msg)
  }))

  return Object.keys(commands)
}

const start = () => {
  const bot = new TelegramBot(config.telegram.API_TOKEN, {
    polling: true,
    onlyFirstMatch: true
  })

  bot.getMe()
    .then(me => console.log(`Escutando em @${me.username}`))
    .then(setupCommands(bot))
    .then(commands => console.log(`${commands.length} comandos carregados`))
    .catch()
}

start()
