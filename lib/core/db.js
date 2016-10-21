const config = require('../../config')
const db = require('arangojs')({
  url: config.db.url,
  databaseName: config.db.databaseName
})

module.exports = db
