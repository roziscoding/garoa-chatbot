const config = require('./config')
const { load: loadCommands } = require('./commands')
const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

const chatIds = [-1001130117322]

const runCommand = async ({bot, command, msg, match, config, err}) => {
  let text
  try {
    text = await command(msg, match, bot, config)
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

  for (const _command in commands) {
    const command = commands[_command]
    bot.onText(command.regex, (msg, match) => {
      return runCommand({
        bot,
        command,
        msg,
        match,
        config,
        err: sendError(bot, msg)
      })
    })
  }

  return Object.keys(commands)
}

const setupStatusMonitor = async bot => {
  let previousStatus = (await axios(config.endpoints.garoa)).data.open
  setTimeout(async () => {
    const { data: { open } } = await axios(config.endpoints.garoa)
    if (open !== previousStatus) {
      const promises = chatIds.map(x => bot.sendMessage(x, `O garoa acaba de ${open ? 'abrir' : 'fechar'}!`))
      await Promise.all(promises)
        .catch(console.error)
    }
    previousStatus = open
  }, 60000)
  return bot
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
    .then(setupStatusMonitor)
    .then(setupErrorEvent)
    .then(setupCommands)
    .then(commands => console.log(`${commands.length} comandos carregados`))
    .catch()
}

start()
