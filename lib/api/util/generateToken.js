const jwt = require('jwt-simple')
const config = require('../../../config')
const secret = config.token.secret

module.exports = {
  encode: (payload) => {
    return jwt.encode(payload, secret)
  },
  decode: (token) => {
    return jwt.decode(token, secret)
  }
}
