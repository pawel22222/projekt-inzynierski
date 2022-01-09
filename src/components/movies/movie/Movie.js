import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { getMovieById } from '../../../data/getMovies'
import { useAuth } from '../../../context/AuthContext'
import { Link } from 'react-router-dom'
import { db } from '../../../firebase'

import Alert from '../../UI/AlertMain'
import SpinnerLoading from '../../UI/SpinnerLoading'
import Button from '../../UI/ButtonMain'
import StarRating from '../../starRating/StarRating'

//#region Styled components
const MovieDiv = styled.div`
    display: flex;
    @media(max-width:768px){
        flex-flow: column;
    }
`
const Poster = styled.img`
    width: 300px;
    @media(max-width:768px){
        width: 100%;
    }
`
const Info = styled.div`
    padding: 5px;

`
//#endregion

function Movie() {
    const { movieId } = useParams()
    const [movieDisplayPage, setMovieDisplayPage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')
    const { currentUser } = useAuth()
    const [userRating, setUserRating] = useState(0)

    const joinGenres = (genres) => genres.join(', ')

    useEffect(() => {
        const getMovie = async (id) => {
            try {
                setError('')
                setLoading(true)
                await getMovieById(id)
                    .get()
                    .then((doc) => {
                        setMovieDisplayPage(doc.data())
                    })
            } catch (error) {
                setError(`Failed to fetch movie. (${error})`)
            }
            setLoading(false)
        }

        getMovie(movieId)
    }, [movieId])

    useEffect(() => {
        const getUserRate = () => {
            db.collection('ratings')
                .where('movieId', '==', movieId)
                .where('userId', '==', currentUser.uid)
                .limit(1)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.docs.length === 0) {
                        setUserRating({ ratingValue: 0 })
                    } else {
                        querySnapshot.forEach((doc) => {
                            setUserRating(doc.data())
                        })
                    }
                })
        }
        getUserRate()
    }, [])

    const removeRating = async () => {
        await db.collection("ratings")
            .doc(userRating.ratingId)
            .delete()
            .then(() => {
                console.log("Document successfully deleted!")
            }).catch((error) => {
                console.error("Error removing document: ", error)
            })

        const counter = movieDisplayPage.ratingCounter
        const average = movieDisplayPage.averageRatings

        db.collection("movies").doc(movieId).set({
            ...movieDisplayPage,
            ratingCounter: counter - 1,
            averageRatings: ((average * counter - userRating) / (counter - 1))
                ? ((average * counter - userRating) / (counter - 1))
                : 0
        })
        await window.location.reload()
    }

    return (
        <div className="container">
            <MovieDiv>
                { error && <Alert type="danger" desc={ error } /> }
                { (loading) && <SpinnerLoading /> }

                { (Object.entries(movieDisplayPage).length > 0) ? (
                    <>
                        <Poster
                            src={ `https://image.tmdb.org/t/p/w500/${movieDisplayPage.poster}` }
                            alt={ movieDisplayPage.title }
                        />
                        <Info>
                            <h1>{ movieDisplayPage.title + ' (' + movieDisplayPage.id + ')' }</h1>
                            <p>{ `Data wydania: ${movieDisplayPage.release_date}` }</p>
                            <p>{ `Średnia ocen:
                            ${movieDisplayPage.averageRatings.toFixed(2)} / 5
                            (${movieDisplayPage.ratingCounter})` }
                            </p>
                            {
                                (currentUser)
                                    ? <>
                                        <h3>Twoja ocena:</h3>
                                        <StarRating movieId={ movieId } />
                                        { !!userRating.ratingValue &&
                                            <div style={ { width: '140px' } }>
                                                <Button
                                                    label="Usuń ocenę"
                                                    type='submit'
                                                    color="danger"
                                                    onClick={ removeRating }
                                                />
                                            </div> }
                                    </>
                                    : <Link to="/login">Zaloguj się, aby ocenić</Link>
                            }
                            <p>{ `Kategorie: ${joinGenres(movieDisplayPage.genre)}` }</p>
                            { movieDisplayPage.desc }
                        </Info>
                    </>
                ) : (
                    <div></div>
                ) }
            </MovieDiv>
        </div>
    )
}

export default Movie
