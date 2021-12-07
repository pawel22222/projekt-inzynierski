import { useState, useEffect } from 'react'
import { db } from '../../firebase'

import SpinnerLoading from '../UI/SpinnerLoading'
import AlertMain from '../UI/AlertMain'
import Table from './table/Table'
import FilterStats from './filterStats/FilterStats'

function Statistic() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [movies, setMovies] = useState([])
    const [ratings, setRatings] = useState([])
    const [users, setUsers] = useState([])

    const [dataTable, setDataTable] = useState([])
    const [theoreticalDataTable, setTheoreticalDataTable] = useState([])

    const [selectedGenre, setSelectedGenre] = useState('')
    const [ageRanges, setAgeRanges] = useState([])

    const currentYear = new Date().getFullYear()

    const preperData = () => {
        let table = ageRanges.map(el => [0, 0, 0, 0, 0])
        let usersInRanges = ageRanges.map(el => [])

        users.forEach((user) => {
            const userAge = -1 * (user.age - currentYear)

            const index = ageRanges.findIndex(({ from, to }) =>
                userAge >= from && userAge < to)

            index >= 0 && usersInRanges[index].push(user.id)
        })

        ratings.forEach((rating) => {
            const index = usersInRanges.findIndex(arr =>
                arr.includes(rating.userId))

            index >= 0 && table[index][rating.ratingValue - 1]++
        })

        setDataTable(table)

        let sumRow = table.map(arr =>
            arr.reduce((acc, el) => acc + el))

        let sumCol = table.reduce((acc, arr) => {
            arr.forEach((el, i) => {
                acc[i] = (acc[i] || 0) + el
            })
            return acc
        }, [])

        let sumAll = sumRow.reduce((acc, el) => acc + el)

        let table2 = table.map((arr, i) =>
            arr.map((el, j) =>
                el = sumRow[i] * sumCol[j] / sumAll
            )
        )

        setTheoreticalDataTable(table2)
    }

    useEffect(() => {
        const fetchMovies = (genre) => {
            setLoading(true)
            setError('')

            try {
                db.collection('movies')
                    .where('genre', 'array-contains', genre)
                    .where('ratingCounter', '>', 0)
                    .get()
                    .then(querySnapshot => {
                        let moviesOfGenre = []
                        querySnapshot.forEach(doc => {
                            moviesOfGenre.push(doc.data())
                        })

                        setMovies(moviesOfGenre)
                    })
            } catch (error) {
                setError(`Failed to fetch movies data. ${error}`)
            }

            setLoading(false)
        }

        selectedGenre && fetchMovies(selectedGenre)
    }, [selectedGenre])

    useEffect(() => {
        const fetchRating = async (movies) => {
            setLoading(true)
            setError('')

            const movieIds = movies.map(el => el.id.toString())

            try {
                movieIds.length && await db.collection('ratings')
                    .where('movieId', 'in', movieIds)
                    .get()
                    .then(querySnapshot => {
                        let ratingsOfGenre = []
                        querySnapshot.forEach(doc => {
                            ratingsOfGenre.push(doc.data())
                        })

                        setRatings(ratingsOfGenre)
                    })
            } catch (error) {
                setError(`Failed to fetch ratings data. ${error}`)
            }

            setLoading(false)
        }

        movies.length && fetchRating(movies)
    }, [movies])

    useEffect(() => {
        const fetchUsers = (ratings) => {
            setLoading(true)
            setError('')

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
                                        response(results.docs.map(result => ({ ...result.data() }))))
                            } catch (error) {
                                setError(`Failed to fetch users data. ${error}`)
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
        users.length && preperData()
    }, [users, ageRanges])

    return (
        <div>
            <FilterStats
                setSelectedGenre={ setSelectedGenre }
                setAgeRanges={ setAgeRanges }
            />

            { error && <AlertMain type="danger">{ error }</AlertMain> }
            { (loading) && <SpinnerLoading /> }

            <div className="container-md">
                {
                    !!dataTable.length && <Table
                        header={ `Tabela 1. Ilość ocen użytkowników w przedziałach wiekowych. Gatunek: ${selectedGenre}` }
                        dataTable={ dataTable }
                        ageRanges={ ageRanges }
                    />
                }

                {
                    !!theoreticalDataTable.length && <Table
                        header={ `Tabela 2. Teoretyczne ilości ocen użytkowników w przedziałach wiekowych.` }
                        dataTable={ theoreticalDataTable }
                        ageRanges={ ageRanges }
                    />
                }
            </div>
        </div>
    )
}

export default Statistic
