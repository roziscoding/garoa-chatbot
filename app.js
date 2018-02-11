const config = require('./config')
const database = require('./lib/database')
const { load: loadCommands } = require('./commands')
const TelegramBot = require('node-telegram-bot-api')

const runCommand = async ({ bot, command, msg, match, config, repositories, chat, err }) => {
  let text
  try {
    text = await command({ msg, match, bot, config, repositories, chat })
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

const setupCommands = async bot => {
  const commands = await loadCommands()
  const { repositories } = database.factory(config.database)

  for (const _command in commands) {
    const command = commands[_command]
    bot.onText(command.regex, async (msg, match) => {
      const chat = await repositories.chats.findById(msg.chat.id)

      if (!chat) {
        await repositories.chats.create({
          id: msg.chat.id,
          type: msg.chat.type
        })
      }

      return runCommand({
        bot,
        command,
        msg,
        match,
        config,
        repositories,
        chat,
        err: sendError(bot, msg)
      })
    })
  }

  return Object.keys(commands)
}

const setupErrorEvent = async bot => {
  bot.on('polling_error', err => {
    console.error(err)
  })

  return bot
}

const start = () => {
  const bot = new TelegramBot(config.telegram.API_TOKEN, {
    polling: true,
    onlyFirstMatch: true
  })

  bot.getMe()
    .then(me => {
      console.log(`Escutando em @${me.username}`)
      return bot
    })
    .then(setupErrorEvent)
    .then(setupCommands)
    .then(commands => console.log(`${commands.length} comandos carregados`))
    .catch()
}

module.exports = {
  start
}
