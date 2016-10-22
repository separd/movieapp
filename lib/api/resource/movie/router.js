const router = require('../../../core/router')
const controller = require('./controller')
const jsonBody = require('../../middleware/jsonBody')

router.get('/movie/:id',
  	controller.getMovie
)

router.post('/movie/genre',
	jsonBody,
	controller.getGenre
)