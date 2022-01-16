import { useEffect, useState } from 'react'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

import SpinnerLoading from '../UI/SpinnerLoading'
import Alert from '../UI/AlertMain'

function RecomendedMovies() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [movies, setMovies] = useState('')
    const [ratings, setRatings] = useState('')
    const [users, setUsers] = useState('')

    const { userInfo } = useAuth()

    const currentYear = new Date().getFullYear()

    const sexes = [
        'male', 'famale'
    ].map(sex => {
        return { sex: sex, ratingCounterForSex: 0, percentageValueForSex: 0 }
    })

    const ageRanges = [
        { from: 10, to: 20 },
        { from: 20, to: 30 },
        { from: 30, to: 40 },
    ].map(ageRange => {
        return { ageRange: ageRange, ratingCounterForAgeRange: 0, percentageValueForAgeRange: 0 }
    })

    const genres = ['Akcja', 'Przygodowy', 'Animowany', 'Komedia', 'Kryminał', 'Dokumentalny', 'Dramat', 'Familijny', 'Fantasy', 'Historyczny', 'Horror', 'Muzyczny', 'Romans', 'Science Fiction', 'Thriller', 'Wojenny', 'Western'].map(genre => {
        return { genre: genre, ratingCounterForGenre: 0, percentageValueForGenre: 0 }
    })

    let ratingsTree = {}

    useEffect(() => {
        const fetchMovies = () => {
            setLoading(true)
            setError('')

            console.log('fetchMovies')

            try {
                db.collection('movies')
                    .where('ratingCounter', '>', 0)
                    .get()
                    .then(querySnapshot => {
                        let moviesArr = []
                        querySnapshot.forEach(doc => {
                            moviesArr.push(doc.data())
                        })

                        moviesArr.length
                            ? setMovies(moviesArr)
                            : setError('Brak danych')
                    })
            } catch (error) {
                setError(`Failed to fetch movies data. ${error}`)
                setLoading(false)
            }

            setLoading(false)
        }

        fetchMovies()
    }, [])

    useEffect(() => {
        const fetchRating = (movies) => {
            setError('')
            setLoading(true)

            console.log('fetchRating')

            return new Promise(() => {
                let batches = []

                const movieIds = [...new Set(movies.map(el => el.id.toString()))]

                while (movieIds.length) {
                    const batch = movieIds.splice(0, 10)

                    batches.push(
                        new Promise(response => {
                            try {
                                db.collection('ratings')
                                    .where('movieId', 'in', [...batch])
                                    .get()
                                    .then(results =>
                                        response(results.docs.map(result => ({ ...result.data() })))
                                    )
                            } catch (error) {
                                setError(`Failed to fetch users data. ${error}`)
                                setLoading(false)
                            }
                        })
                    )
                }

                Promise.all(batches).then(content => {
                    setRatings(content.flat())
                })

                setLoading(false)
            })
        }

        movies.length && fetchRating(movies)
    }, [movies])

    useEffect(() => {
        const fetchUsers = (ratings) => {
            setError('')
            setLoading(true)

            console.log('fetchUsers')

            return new Promise(() => {
                let batches = []

                const userIds = [...new Set(ratings.map(el => el.userId))]

                while (userIds.length) {
                    const batch = userIds.splice(0, 10)

                    batches.push(
                        new Promise(response => {
                            try {
                                db.collection('users')
                                    .where('id', 'in', [...batch])
                                    .get()
                                    .then(results =>
                                        response(results.docs.map(result => ({ ...result.data() })))
                                    )
                            } catch (error) {
                                setError(`Failed to fetch users data. ${error}`)
                                setLoading(false)
                            }
                        })
                    )
                }

                Promise.all(batches).then(content => {
                    setUsers(content.flat())
                })

                setLoading(false)
            })
        }

        ratings.length && fetchUsers(ratings)
    }, [ratings])

    useEffect(() => {
        const preperData = () => {
            setLoading(true)
            setError('')

            console.log('preperData')

            // GENERATE RATINGS_TREE
            ratingsTree.ratingCounter = 0
            ratingsTree.sexes = JSON.parse(JSON.stringify(sexes))
            ratingsTree.sexes.forEach(sex => {
                sex.ageRanges = JSON.parse(JSON.stringify(ageRanges))
            })
            ratingsTree.sexes.forEach(sex => {
                sex.ageRanges.forEach(ageRange => {
                    ageRange.genres = JSON.parse(JSON.stringify(genres))
                })
            })

            // FILL RATINGS: USER_DATA AND MOVIES_DATA
            const ratingsWithUserDataAndGenres = ratings.map(rating => {
                const currentUser = users.find(user => user.id === rating.userId)
                const currentMovie = movies.find(movie => movie.id === rating.movieId)
                return {
                    ...rating,
                    userAge: -1 * (currentUser.age - currentYear),
                    userSex: currentUser.sex,
                    movieGenres: currentMovie.genre
                }
            })

            // COUNT RATINGS IN RATINGS_TREE
            ratingsWithUserDataAndGenres.forEach(rating => {
                ratingsTree.ratingCounter++

                const findedSex = ratingsTree.sexes.find(({ sex }) => sex === rating.userSex)
                findedSex.ratingCounterForSex++

                const findedAgeRange = findedSex.ageRanges.find(({ ageRange }) => rating.userAge >= ageRange.from && rating.userAge < ageRange.to)
                findedAgeRange.ratingCounterForAgeRange++

                findedAgeRange.genres.forEach(genre => {
                    if (rating.movieGenres.includes(genre.genre)) {
                        genre.ratingCounterForGenre++
                    }
                })
            })

            // CALC PERCENTAGE VALUES
            ratingsTree.sexes.forEach(sex => {
                sex.percentageValueForSex = sex.ratingCounterForSex / ratingsTree.ratingCounter

                sex.ageRanges.forEach(ageRange => {
                    ageRange.percentageValueForAgeRange = ageRange.ratingCounterForAgeRange / sex.ratingCounterForSex

                    ageRange.genres.forEach(genre => {
                        genre.percentageValueForGenre = genre.ratingCounterForGenre / ageRange.ratingCounterForAgeRange
                    })
                })
            })

            console.log(ratingsTree)


            // CALC PROBABILITY AND FIT_FACTOR
            const probabilityOfGenres = ['Akcja', 'Przygodowy', 'Animowany', 'Komedia', 'Kryminał', 'Dokumentalny', 'Dramat', 'Familijny', 'Fantasy', 'Historyczny', 'Horror', 'Muzyczny', 'Romans', 'Science Fiction', 'Thriller', 'Wojenny', 'Western'].map(genre => {
                return { genre: genre, probability: 0, fitFactor: 0 }
            })

            probabilityOfGenres.forEach(genreObj => {
                let total = 0

                ratingsTree.sexes.forEach(sex => {
                    sex.ageRanges.forEach(ageRange => {
                        const findedGenre = ageRange.genres.find(({ genre }) => genre === genreObj.genre).percentageValueForGenre

                        const findedGenreOrZero = (isNaN(findedGenre)) ? 0 : findedGenre

                        total += sex.percentageValueForSex
                            * ageRange.percentageValueForAgeRange
                            * findedGenreOrZero
                    })
                })

                genreObj.probability = total
            })

            probabilityOfGenres.forEach(genreObj => {
                const currentUserSex = ratingsTree.sexes.find(({ sex }) => sex === userInfo.sex)

                const currentUserAge = -1 * (userInfo.age - currentYear)
                const currentUserAgeRange = currentUserSex.ageRanges.find(({ ageRange }) => currentUserAge >= ageRange.from && currentUserAge < ageRange.to)

                const currentGenre = currentUserAgeRange.genres.find(({ genre }) => genre === genreObj.genre)

                if (genreObj.probability === 0) {
                    genreObj.fitFactor = 0
                }
                else {
                    genreObj.fitFactor = currentUserSex.percentageValueForSex
                        * currentUserAgeRange.percentageValueForAgeRange
                        * currentGenre.percentageValueForGenre
                        / genreObj.probability
                }
            })

            probabilityOfGenres.sort((a, b) => b.fitFactor - a.fitFactor)

            console.log(probabilityOfGenres)



            // Warning: Drugi etap - wybór kategorii do wyswietlenia
            // movies.forEach((movie) => {
            //     movie.genre.forEach((genre) => {
            //         moviesInGenres[genre].push(movie)
            //     })
            // })

            // const numberOfRatings = moviesInGenres.Akcja.reduce((total, movie) => {
            //     return total += movie.ratingCounter
            // }, 0)

            // moviesInGenres.Akcja.forEach(movie =>
            //     movie.weightedAverage = movie.averageRatings * movie.ratingCounter / numberOfRatings
            // )

            // moviesInGenres.Akcja.sort((a, b) => b.weightedAverage - a.weightedAverage)

            setLoading(false)
        }

        users.length && preperData()
    }, [users])

    return (
        <div>
            <div className="container">
                { error && <Alert type="danger" desc={ error } /> }
                { loading && <SpinnerLoading /> }
            </div>
            {
                !loading
                && error.length === 0
                && <div className="container-md">

                </div>
            }

        </div>
    )
}

export default RecomendedMovies
