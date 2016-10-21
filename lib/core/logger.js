const bunyan = require('bunyan')
const koaBunyanLogger = require('koa-bunyan-logger')

const appLogger = bunyan.createLogger({
  name: 'Elite rest api',
  level: 'debug',
  serializers: bunyan.stdSerializers
})

module.exports = {
  koaBunyanLogger,
  log: appLogger
}
