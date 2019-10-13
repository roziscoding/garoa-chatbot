'use strict'

const config = require('./config')
const commands = require('./commands')
const database = require('./lib/database')
const DomainError = require('./lib/DomainError')
const accessorsFactory = require('./lib/accessors')
const TelegramBot = require('node-telegram-bot-api')
const callbackHandlers = require('./callback-handlers')
const { types: responseTypes, handler: responseHandler } = require('./lib/response')

const getWebHookUrl = ({ webhook: { hostname }, API_TOKEN }) => `https://${hostname}/${API_TOKEN}`

const runCommand = async ({ bot, command, msg, match, repositories, chat, accessors, err }) => {
  try {
    const result = await command({ msg, match, bot, config, repositories, chat, responseTypes, accessors })

    await responseHandler(bot, msg.chat.id, result)
  } catch (e) {
    return err(e)
  }
}

const handleCallbackQuery = async ({ bot, handler, query, match, repositories, err }) => {
  try {
    const result = await handler({ query, match, repositories, responseTypes, config })

    await responseHandler(bot, query.message.chat.id, result)
  } catch (e) {
    return err(e)
  }
}

const sendError = (bot, msg) => {
  return (err) => {
    if (err instanceof DomainError) {
      return bot.sendMessage(msg.chat.id, err.message, { parse_mode: 'Markdown' })
    }
    console.error(err)
    bot.sendMessage(msg.chat.id, `Erro ao executar comando: ${err.message}`, {
      parse_mode: 'Markdown'
    })
  }
}

const sendCallbackError = (bot, queryId) => {
  return (err) => {
    if (err instanceof DomainError) {
      return bot.answerCallbackQuery(queryId, { text: err.message, show_alert: true })
    }

    console.error(err)
    bot.answerCallbackQuery(queryId, { text: `Erro ao processar solicitação: ${err.message}`, show_alert: true })
  }
}

const setupDependencies = bot => {
  const { repositories } = database.factory(config.database)
  const accessors = accessorsFactory(bot)

  return { bot, repositories, accessors }
}

const setupCommands = async ({ bot, repositories, accessors }) => {
  for (const [ , command ] of Object.entries(commands)) {
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

  return { bot, repositories, accessors, commands: Object.keys(commands) }
}

const setupCallbackQueries = async ({ bot, repositories, accessors, commands }) => {
  bot.on('callback_query', (query) => {
    if (!query.message || !query.message.chat || !query.message.chat.id) return

    const handler = callbackHandlers.getHandler(query.data)

    if (!handler) return

    return handleCallbackQuery({
      bot,
      handler,
      query,
      match: query.data.match(handler.regex),
      repositories,
      err: sendCallbackError(bot, query.id)
    })
  })

  return { bot, repositories, accessors, commands }
}

const setupErrorEvent = async bot => {
  bot.on('polling_error', err => {
    console.error(err)
  })

  return bot
}

const start = () => {
  const bot = new TelegramBot(config.telegram.API_TOKEN, {
    webHook: {
      autoOpen: true,
      port: config.telegram.webhook.port,
      host: config.telegram.webhook.bindingHost
    },
    onlyFirstMatch: true
  })

  bot.setWebHook(getWebHookUrl(config.telegram))
    .then(() => bot.getMe())
    .then(me => {
      console.log(`Escutando em @${me.username}`)
      return bot
    })
    .then(setupErrorEvent)
    .then(setupDependencies)
    .then(setupCommands)
    .then(setupCallbackQueries)
    .then(({ commands }) => console.log(`${commands.length} comandos carregados`))
    .catch(err => { console.error(err); process.exit(1) })
}

module.exports = {
  start
}
