'use strict'

const config = require('./config')
const database = require('./lib/database')
const commands = require('./commands')
const TelegramBot = require('node-telegram-bot-api')
const { types: responseTypes, handler: responseHandler } = require('./lib/response')
const accessorsFactory = require('./lib/accessors')

const runCommand = async ({ bot, command, msg, match, repositories, chat, accessors, err }) => {
  try {
    const result = await command({ msg, match, bot, config, repositories, chat, responseTypes, accessors })

    await responseHandler(bot, msg.chat.id, result)
  } catch (e) {
    return err(e)
  }
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
  const { repositories } = database.factory(config.database)
  const accessors = accessorsFactory(bot)

  for (const _command in commands) {
    const command = commands[ _command ]
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
        accessors,
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
