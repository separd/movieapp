const router = require('../../../core/router')
const controller = require('./controller')
const jsonBody = require('../../middleware/jsonBody')

router.get('/genre',
  jsonBody,
  controller.getAll
)
