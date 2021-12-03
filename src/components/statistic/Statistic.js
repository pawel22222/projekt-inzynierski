import { useState, useEffect } from 'react'
import { db } from '../../firebase'

import SpinnerLoading from '../UI/SpinnerLoading'
import AlertMain from '../UI/AlertMain'
import Table from './table/Table'

function Statistic() {
    console.log('render component')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [movies, setMovies] = useState([])
    const [ratings, setRatings] = useState([])
    const [users, setUsers] = useState([])
    const [dataTable, setDataTable] = useState({
        age1: [0, 0, 0, 0, 0],
        age2: [0, 0, 0, 0, 0],
        age3: [0, 0, 0, 0, 0],
    })


    const preperData = () => {
        let table = {
            age1: [0, 0, 0, 0, 0],
            age2: [0, 0, 0, 0, 0],
            age3: [0, 0, 0, 0, 0],
        }
        let users1 = []
        let users2 = []
        let users3 = []

        users.forEach((user) => {
            if (user.age < 2011 && user.age >= 2001) { users1.push(user.id) }
            else if (user.age < 2001 && user.age >= 1991) { users2.push(user.id) }
            else if (user.age < 1991 && user.age >= 1981) { users3.push(user.id) }
        })

        ratings.forEach((rating) => {
            if (users1.includes(rating.userId)) { table.age1[rating.ratingValue - 1]++ }
            else if (users2.includes(rating.userId)) { table.age2[rating.ratingValue - 1]++ }
            else if (users3.includes(rating.userId)) { table.age3[rating.ratingValue - 1]++ }
        })

        setDataTable(table)

        console.log(`-------------------`)
        console.log(`oceny > 1 2 3 4 5`)
        console.log(`10-20 | ${table.age1}`)
        console.log(`20-30 | ${table.age2}`)
        console.log(`30-40 | ${table.age3}`)
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
                        console.log('fetchMovies')
                        console.log(moviesOfGenre)
                    })
            } catch (error) {
                setError(`Failed to fetch movies data. ${error}`)
            }

            setLoading(false)
        }

        fetchMovies('Akcja')
    }, [])

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
                        console.log('fetchRating')
                        console.log(ratingsOfGenre)
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

            const userIds = ratings.map(el => el.userId)

            try {
                userIds.length && db.collection('users')
                    .where('id', 'in', userIds)
                    .get()
                    .then(querySnapshot => {
                        let usersArr = []
                        querySnapshot.forEach(doc => {
                            usersArr.push(doc.data())
                        })

                        setUsers(usersArr)
                        console.log('fetchUsers')
                        console.log(usersArr)
                    })
            } catch (error) {
                setError(`Failed to fetch users data. ${error}`)
            }

            setLoading(false)
        }

        ratings.length && fetchUsers(ratings)
    }, [ratings])

    useEffect(() => {
        users.length && preperData()
    }, [users])

    return (
        <div>
            { error && <AlertMain type="danger">{ error }</AlertMain> }
            { (loading) && <SpinnerLoading /> }

            {/* <div>ocena |1 2 3 4 5</div>
            <div>10-20 |{ dataTable.age1.map(el => ` ${el} `) }</div>
            <div>20-30 |{ dataTable.age2.map(el => ` ${el} `) }</div>
            <div>30-40 |{ dataTable.age3.map(el => ` ${el} `) }</div> */}

            <Table
                header='Tabela 1. Ilość ocen użytkowników w przedziałach wiekowych. Gatunek: akcja'
                dataTable={ dataTable }
            />
        </div>
    )
}

export default Statistic
