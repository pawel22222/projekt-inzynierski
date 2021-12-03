import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { getMovieById } from '../../../data/getMovies'
import { useAuth } from '../../../context/AuthContext'
import { Link } from 'react-router-dom'

import AlertMain from '../../UI/AlertMain'
import SpinnerLoading from '../../UI/SpinnerLoading'
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

    const mapGenres = (genres) => genres.map(genre => ` ${genre}`)

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

    return (
        <MovieDiv>
            { error && <AlertMain type="danger">{ error }</AlertMain> }
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
                                </>
                                : <Link to="/login">Zaloguj się, aby ocenić</Link>
                        }
                        <p>{ `Kategorie: ${mapGenres(movieDisplayPage.genre)}` }</p>
                        { movieDisplayPage.desc }
                    </Info>
                </>
            ) : (
                <div></div>
            ) }
        </MovieDiv>
    )
}

export default Movie
