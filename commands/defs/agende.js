const phrases = [
  'Mas é agente do FBI?',
  'Oloco, agente secreto?',
  'Agente?! FBI, CIA ou NSA?',
  'Agente federal?',
  'Agente? Mas é o James Bond?'
]

const fun = () => {
  const random = Math.floor(Math.random() * phrases.length)
  return phrases[random]
}

fun.regex = /agente/ig
fun.reply = true

module.exports = fun
