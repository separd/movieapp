const router = require('../../../core/router')
const controller = require('./controller')
const jsonBody = require('../../middleware/jsonBody')
const auth = require('../../middleware/auth')

router.get('/user/testToken',
  auth,
  controller.testToken
)

router.get('/user/:id',
  controller.getOne
)

router.post('/user/login',
  jsonBody,
  controller.login
)

router.post('/user/auth/facebook/:token',
  controller.authFacebook
)

router.post('/user/auth/google/:token',
  controller.authGoogle
)