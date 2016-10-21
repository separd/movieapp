const generateToken = require('../util/generateToken')
const userModel = require('../resource/user/model')
const errors = require('../../core/errors')

module.exports = function* (next) {
  const token = this.headers.authorization

  let payload
  try {
    payload = generateToken.decode(token)
  } catch (err) {
    throw new errors.UnauthorizedError()
  }

  this.payload = payload
  const user = yield userModel.document(payload.userId)
  this.user = user
  yield next
}
