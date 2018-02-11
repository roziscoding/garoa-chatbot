const fn = ({ msg }) => {
  return `\`\`\`\n${JSON.stringify(msg, null, 4)}\`\`\``
}

fn.regex = /\/raw/

module.exports = fn