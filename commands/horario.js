'use strict'

const craftMessage = () => ([
  'O esquema do horário do Garoa é que: `O Garoa não tem um horário` :smiley:',
  'Pra estar "aberto", o Garoa precisa que algum associado vá até lá pra literalmente abrir a porta, e pra cuidar do espaço.',
  '',
  'Existem dois bons jeitos de saber quando vai ter alguém lá:',
  '1) Dar uma olhada na [página de eventos](https://garoa.net.br/wiki/Categoria:Eventos) da wiki',
  '2) Perguntar aqui, ou no grupo público, se alguém vai pra lá no dia em que você pretende ir `(e não se o Garoa vai estar aberto)`',
  '',
  'Se quiser saber se tem alguém lá agora, é só mandar /status',
  '',
  'Por último, se quiser o Garoa sempre aberto quando você precisar, dá uma olhada em [como ser um associado](https://garoa.net.br/wiki/Como_se_associar) :sunglasses:',
  '',
  '#horario #eventos #atividades #associado'
].join('\n'))

module.exports = ({ responseTypes }) => {
  return [{
    type: responseTypes.TEXT,
    content: craftMessage(),
    options: {
      emojify: true,
      parse_mode: 'Markdown'
    }
  }]
}

module.exports.regex = /^\/horario$/i
