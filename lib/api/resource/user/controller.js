const model = require('./model')
const credential = require('credential')()
const jwt = require('jwt-simple')
const generateToken = require('../../util/generateToken')

module.exports = {
  testToken: function* () {

    this.body = {
      authorized: 'yes',
      user: this.user,
      payload: this.payload
    }
  },
  getOne: function* () {
    const id = this.params.id
    const user = yield model.document(id)
    this.body = user
  },
  create: function* () {
    const data = this.request.body
    data.password = yield new Promise((resolve, reject) => {
      credential.hash(data.password, function (err, hash) {
        if (err) {
          return reject(err)
        }
        resolve(hash)
      })
    })
    let user = yield model.save(data)
    user = yield model.document(user._key)
    this.body = user
  },
  login: function* () {
    const username = this.request.body.username
    const password = this.request.body.password
    // @TODO query !
    const user = yield model.document('17172')

    if (!user) {
      // @TODO trhow error
    }

    const isValid = yield new Promise((resolve, reject) => {
      credential.verify(user.password, password, function (err, isValid) {
        if (err) {
          return reject(err)
        }
        resolve(isValid)
      })
    })

    if (!isValid) {
      // @TODO trhow errro
    }

    this.body = {
      token: generateToken.encode({
        userId: user._key,
        createAt: new Date()
      }),
      userId: user._key
    }
  }
}
