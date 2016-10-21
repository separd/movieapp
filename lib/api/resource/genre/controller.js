const model = require('./model')

module.exports = {
  getAll: function* () {
    const cursor = yield model.all();
    this.body = cursor._result;
  }
}
