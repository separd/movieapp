const coroutine = require('bluebird').coroutine
const db = require('./lib/core/db')
const moviedb = require('moviedb')('ae9ff6263a2fe114b6331bbea83f4f6b')
require('bluebird').promisifyAll(moviedb)


coroutine(function* () {
  yield db.get()
  console.log('ArangoDB connected')
  console.log(moviedb)
  const data = yield moviedb.genreMovieListAsync()
  console.log(data)
  collection = db.collection('movie-genre');
  collection.save(data.genres).then(
	  meta => console.log('Document saved:', meta._rev),
	  err => console.error('Failed to save document:', err)
	);
	/*for (var i = 0, len = data.length; i < len; i++) {
	  console.log(data[i]);
	}*/
})()
.catch((err) => {
   console.log(err, 'ArangoDB connection failed')
})