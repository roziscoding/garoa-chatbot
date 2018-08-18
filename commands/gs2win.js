'use strict'

const random = require('lodash.sample')

const STICKERS  = [ 'CAADAQAD6wADBO9jB9X2sqIQyGFAAg', 'CAADAQAD7AADBO9jB9d8sypGalaOAg' ]
  
const fn = async ({ msg, responseTypes }) => {
    return [ {
        type: responseTypes.STICKER,
        content: random(STICKERS)
    } ]
}

fn.reply = true

fn.regex = /^\/gs2w(?:in)?/

module.exports = fn
