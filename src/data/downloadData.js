import { db } from '../firebase'

export function getMoviesWhereGenre(genre) {
    let moviesOfGenre = []
    // let ratingsOfGenre = []

    db.collection('movies')
        .where('genre', 'array-contains', genre)
        .where('ratingCounter', '>', 0)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                moviesOfGenre.push(doc.data().id.toString())
            })
            // db.collection('ratings')
            //     .where('movieId', 'in', moviesOfGenre)
            //     .get()
            //     .then(querySnapshot => {
            //         querySnapshot.forEach(doc => {
            //             ratingsOfGenre.push(doc.data())
            //         })
            //     })
        })

    // return ratingsOfGenre
    return moviesOfGenre
}

export function getRatingsByIds(arrayIds) {
    let ratingsOfGenre = []
    db.collection('ratings')

        .where('movieId', 'in', arrayIds)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                ratingsOfGenre.push(doc.data())
            })
        })

    return ratingsOfGenre
}

export async function asyncFun() {
    const ids = await getMoviesWhereGenre('Akcja')
    const result = await getRatingsByIds(ids)
    return result
}