const model = require('./model')
const credential = require('credential')()
const jwt = require('jwt-simple')
const db = require('./../../../core/db')
const model_genre = require('./../genre/model')

module.exports = {
  getMovie: function* () {
    const id = this.params.id
    const movie = yield model.document(id)
    this.body = movie
  },
  getGenre: function* () {
    const cursor1 = yield model_genre.all()
    const genres = yield cursor1.all()

    var movies = []
    
    for( var i = 0; i < genres.length; i++) {
      cursor = yield db.query(" FOR mov IN movie FILTER " + genres[i].id + " IN mov.genre_ids[*] SORT mov.popularity DESC LIMIT 1 RETURN mov")
      movie = yield cursor.all()
      movies.push(movie)  
    }
    
    this.body = movies
  }
}
