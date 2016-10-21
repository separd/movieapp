const config = {
  api: {
    port: process.env.PORT || 3000,
    host: '127.0.0.1'
  },
  db: {
    url : process.env.ARANGO_URL || 'http://root:elite@arango.paulooze.com',
    databaseName: process.env.ARANGO_DBNAME || 'moviedb'
  },
  token: {
    secret: process.env.TOKEN_SECRET || ''
  }
}

module.exports = config
