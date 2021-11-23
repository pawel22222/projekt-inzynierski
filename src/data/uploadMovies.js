import { allMovies } from './movies'
import { db } from '../firebase'


function uploadMovies() {
    const moviesToUpload = allMovies.slice(0, 200)
    const promises = []

    moviesToUpload.forEach(movie => {
        promises.push(
            db.collection("movies").doc(movie.id.toString()).set({
                id: movie.id,
                title: movie.title,
                desc: movie.desc,
                genre: movie.genre,
                language: movie.language,
                release_date: movie.release_date,
                backdrop: movie.backdrop,
                poster: movie.poster,
                ratingCounter: 0,
                averageRatings: 0
            }))
    })
    Promise.all(promises)
}
export default uploadMovies