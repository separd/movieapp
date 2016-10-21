const koa = require('koa')
const app = koa()
const logger = require('./core/logger')
const config = require('../config')
const errors = require('./core/errors')
const db = require('./core/db')
const router = require('./core/router')
// @TODO example debug
const debug = require('debug')('server')

// console.log(process)

logger.log.info('config', config)

db.get()
.then((info) => {
  logger.log.info('ArangoDB connected')
})
.catch((err) => {
  logger.log.error(err, 'ArangoDB connection failed')
})

// @TODO make for loop
require('./api/resource/user/router')
require('./api/resource/genre/router')

app.use(logger.koaBunyanLogger(logger.log))
app.use(logger.koaBunyanLogger.requestIdContext())
app.use(logger.koaBunyanLogger.requestLogger())

app.use(function *(next) {
  try {
    yield next
  } catch (err) {
    // @TODO log error !
    logger.log.error(err)
    let error = err
    if (!(err instanceof errors.AppError)) {
      error = new errors.InternalServerError()
    }

    this.status = error.status
    this.body = err
  }
})
.use(router.routes())
.use(router.allowedMethods())

app.listen(config.api.port, config.api.host, function(err, res) {
  if (err) {
    logger.log.error(err)
    return
  }
  logger.log.info(`Server listen on ${this.address().address}:${this.address().port}`)
})
