import { useState, useEffect } from 'react'
import { db } from '../../firebase'

import SpinnerLoading from '../UI/SpinnerLoading'
import Alert from '../UI/AlertMain'
import Table from './table/Table'
import FilterStats from './filterStats/FilterStats'

function Statistic() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [errorFilter, setErrorFilter] = useState('')

    const [movies, setMovies] = useState([])
    const [ratings, setRatings] = useState([])
    const [users, setUsers] = useState([])

    const [selectedGenre, setSelectedGenre] = useState('')
    const [ageRanges, setAgeRanges] = useState([])

    const currentYear = new Date().getFullYear()

    const [dataTable, setDataTable] = useState([])
    const [theoreticalDataTable, setTheoreticalDataTable] = useState([])
    const [chiSquare, setChiSquare] = useState(0)
    const [tCzuprow, setTCzuprow] = useState(0)
    const [vCramera, setVCramera] = useState(0)

    const preperData = () => {
        setLoading(true)
        setError('')

        let table = ageRanges.map(el => [0, 0, 0, 0, 0])
        let usersInRanges = ageRanges.map(el => [])

        users.forEach((user) => {
            const userAge = -1 * (user.age - currentYear)

            const index = ageRanges.findIndex(({ from, to }) =>
                userAge >= from && userAge <= to)

            index >= 0 && usersInRanges[index].push(user.id)
        })

        ratings.forEach((rating) => {
            const index = usersInRanges.findIndex(arr =>
                arr.includes(rating.userId))

            index >= 0 && table[index][rating.ratingValue - 1]++
        })
        setDataTable(table)

        const sumRow = table.map(arr =>
            arr.reduce((acc, el) => acc + el))

        const sumCol = table.reduce((acc, arr) => {
            arr.forEach((el, i) => {
                acc[i] = (acc[i] || 0) + el
            })
            return acc
        }, [])

        const sumAll = sumRow.reduce((acc, el) => acc + el)

        const table2 = table.map((arr, i) =>
            arr.map((el, j) =>
                el = sumRow[i] * sumCol[j] / sumAll
            )
        )
        setTheoreticalDataTable(table2)

        // const fakeArray = [
        //     [100, 70],
        //     [130, 200],
        // ]

        // const fakeArray2 = [
        //     [78.2, 91.8],
        //     [151.8, 178.2],
        // ]

        const calcChiSquare = table.reduce((acc, arr, i) => {
            return acc = acc + arr.reduce((acc2, el, j) => {
                return table2[i][j] === 0
                    ? acc2 = acc2 + 0
                    : acc2 = acc2 + (((el - table2[i][j]) ** 2) / table2[i][j])
            }, 0)
        }, 0)
        setChiSquare(calcChiSquare)

        const calcTCzuprow = Math.sqrt(
            calcChiSquare / (
                sumAll * Math.sqrt((sumCol.length - 1) * (sumRow.length - 1))
            )
        )
        setTCzuprow(calcTCzuprow)

        const calcVCramera = Math.sqrt(
            calcChiSquare / (
                sumAll * Math.sqrt(
                    (sumCol.length - 1) <= (sumRow.length - 1)
                        ? (sumCol.length - 1)
                        : (sumRow.length - 1)
                )
            )
        )
        setVCramera(calcVCramera)

        setLoading(false)
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

                        moviesOfGenre.length
                            ? setMovies(moviesOfGenre)
                            : setError('Brak danych')
                    })
            } catch (error) {
                setError(`Failed to fetch movies data. ${error}`)
                setLoading(false)
            }
        }

        selectedGenre && fetchMovies(selectedGenre)
    }, [selectedGenre])

    useEffect(() => {
        const fetchRating = (movies) => {
            setError('')
            setLoading(true)

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
            })
        }

        movies.length && fetchRating(movies)
    }, [movies])

    useEffect(() => {
        const fetchUsers = (ratings) => {
            setError('')
            setLoading(true)

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
            })

        }

        ratings.length && fetchUsers(ratings)
    }, [ratings])

    useEffect(() => {
        users.length && ageRanges.length && preperData()
    }, [users, ageRanges])

    return (
        <div>
            <FilterStats
                setSelectedGenre={ setSelectedGenre }
                setAgeRanges={ setAgeRanges }
                errorFilter={ errorFilter }
                setErrorFilter={ setErrorFilter }
            />
            <div className="container">
                { error && <Alert type="danger" desc={ error } /> }
                { (loading) && <SpinnerLoading /> }
            </div>

            {
                !loading
                && error.length === 0
                && errorFilter.length === 0
                && dataTable.length > 0
                && <div className="container-md">
                    <Table
                        header={ `Tabela 1. Liczebność ocen użytkowników w przedziałach wiekowych. Gatunek: ${selectedGenre}` }
                        dataTable={ dataTable }
                        ageRanges={ ageRanges }
                    />

                    <div className="my-5"></div>

                    <Table
                        header={ `Tabela 2. Oczekiwana (teoretyczna) liczebność ocen użytkowników w przedziałach wiekowych.` }
                        dataTable={ theoreticalDataTable }
                        ageRanges={ ageRanges }
                    />

                    <div className="my-5">
                        {
                            [
                                { el: chiSquare, header: 'Wartość statystyki chi kwadrat: ' },
                                { el: tCzuprow, header: 'Współczynnik zbieżności T-Czuprowa: ' },
                                { el: vCramera, header: 'Współczynnik V-Cramera: ' }
                            ].map(({ el, header }, i) => (
                                <h2 key={ i }>
                                    { header }
                                    <b>
                                        { el.toFixed(2)
                                        }
                                    </b>
                                </h2>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Statistic
