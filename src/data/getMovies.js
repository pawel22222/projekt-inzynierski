import { db } from '../firebase'

export function getPaginatedMovies(
    orderBy = 'title',
    startAfter,
    limit = 10,
) {
    return db.collection('movies')
        .orderBy(orderBy)
        .startAfter(startAfter)
        .limit(limit)
}

export function getMoviesWhere(
    where,
    orderBy = 'title',
    limit = 3,
) {
    return db.collection('movies')
        .where(where)
        .orderBy(orderBy)
        .limit(limit)
}

export function getMovieById(id = 11) {
    return db.collection('movies').doc(id)
}