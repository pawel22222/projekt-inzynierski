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
    margin-top: 10px;
    @media(max-width:768px){
        display: flex;
        flex-flow: column;
        margin-top: 0;
    }
    @media(max-width:576){
        margin-top: 0;
    }
`
const Poster = styled.img`
    float: left;
    width: 300px;
    height: 100%;
    margin-right: 10px;
    @media(max-width: 768px){
        width: 100%;
    }
`
const Info = styled.div`
    padding: 5px;
    text-align: justify;
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

    function toStringAverageRating({ averageRatings, ratingCounter }) {
        return `${averageRatings.toFixed(2)} / 5 (${ratingCounter})`
    }

    const removeRating = async () => {
        await db.collection("ratings")
            .doc(userRating.ratingId)
            .delete()
            .then(() => {
                console.log("Document successfully deleted!")
            }).catch((error) => {
                setError(`Error removing document: (${error})`)
            })

        const counter = movieDisplayPage.ratingCounter
        const average = movieDisplayPage.averageRatings

        await db.collection("movies").doc(movieId).set({
            ...movieDisplayPage,
            ratingCounter: counter - 1,
            averageRatings: counter - 1 === 0
                ? 0
                : (average * counter - userRating.ratingValue) / (counter - 1)
        })

        getMovie(movieId)
    }

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

    useEffect(() => {

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
    }, [movieDisplayPage])

    return (
        <MovieDiv className="container">
            { error && <Alert type="danger" desc={ error } /> }
            { (loading) && <SpinnerLoading /> }

            { movieDisplayPage
                && <>
                    <Poster
                        src={ `https://image.tmdb.org/t/p/w500/${movieDisplayPage.poster}` }
                        alt={ movieDisplayPage.title }
                    />

                    <Info>
                        <h1>{ movieDisplayPage.title }</h1>

                        <p>Data wydania: { movieDisplayPage.release_date }</p>

                        <p>Kategorie: { joinGenres(movieDisplayPage.genre) }</p>

                        <p>Średnia ocen: { toStringAverageRating(movieDisplayPage) }</p>

                        { currentUser
                            ? <>
                                <h3 className='mb-3'>Twoja ocena:</h3>

                                <StarRating movieId={ movieId } getMovie={ getMovie } />

                                { !!userRating.ratingValue &&
                                    <div style={ { width: '150px', display: 'flex' } }>
                                        <Button
                                            label="Usuń ocenę"
                                            type='submit'
                                            color="danger"
                                            onClick={ removeRating }
                                        />
                                    </div>
                                }
                            </>
                            : <Link to="/login">Zaloguj się, aby ocenić</Link>
                        }

                        <p>{ movieDisplayPage.desc }</p>
                    </Info>
                </>
            }
        </MovieDiv>
    )
}

export default Movie
