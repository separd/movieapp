const model = require('./model')
const credential = require('credential')()
const jwt = require('jwt-simple')
const generateToken = require('../../util/generateToken')

const bb = require('bluebird');
const FB = require('fb');
FB.options({version: 'v2.4'});
//const tokenUtil = require('../../utils/tokenUtil');
const google = require('googleapis');
const plus = google.plus('v1');
const OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2('', '', '');
bb.promisifyAll(FB);
bb.promisifyAll(plus.people);

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
    const user = yield model.firstExample({"username" : username });

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
  },
  authFacebook: function*() {
    const token = this.params.token
    FB.setAccessToken(token)

    const fbUser = yield FB.apiAsync('/me', {fields: ['id', 'name', 'email']}).catch(e => e);
    if (fbUser.error) {
      console.log(fbUser)
      throw new Error(fbUser.error);

    }

    try {
      let user = yield model.firstExample({"authId" : fbUser.id})
    } catch (error) {
      yield model.save( {
        "authId" : fbUser.id,
        "name" : fbUser.name,
        "email" : fbUser.email,
        "createdAt" : new Date()
      } )
    }

    user = yield model.firstExample({"authId" : fbUser.id})
    console.log(user);

    //const accessToken = tokenUtil.encode({userId: user.id, name: user.name});

    this.body = {
      token: generateToken.encode({
        userId: user._key,
        createAt: new Date()
      }),
      userId: user._key
    }
  },
  authGoogle: function*() {
    const token = this.params.token;
    oauth2Client.setCredentials({
      access_token: token // eslint-disable-line
    });

    const gUser = yield plus.people.getAsync({userId: 'me', auth: oauth2Client}).catch(e => e);    

    try {
      let user = yield model.firstExample( { "authId" : gUser.id} )
    } catch (error) {
      yield model.save( {
        "authId" : gUser.id,
        "name" : gUser.displayName,
        "email" : gUser.email,
        "createdAt" : new Date()
      } )
    }
    
    user = yield model.firstExample( { "authId" : gUser.id} )
    console.log(user);
//    const accessToken = tokenUtil.encode({userId: user.id, name: user.name});

    this.body = {
      token: generateToken.encode({
        userId: user._key,
        createAt: new Date()
      }),
      userId: user._key
    }
  }
}
