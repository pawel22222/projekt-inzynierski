import React from 'react'
import { useState, useEffect } from 'react/cjs/react.development'
import styled from 'styled-components'
import { getMovieById } from '../../../data/getMovies'

import AlertMain from '../../UI/AlertMain'
import SpinnerLoading from '../../UI/SpinnerLoading'

// danger: todo: sprawdź czy szukany film jest w movies w root

//#region Styled components
const MovieDiv = styled.div`
    display: flex;

`
const Poster = styled.img`
    width: 300px;
`
const Info = styled.div`
    padding: 5px;

`
//#endregion

function Movie(props) {
    const thisMovieId = props.match.params.id
    const [movieDisplayPage, setMovieDisplayPage] = useState({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')

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
                setError(`Failed to Sign In. (${error.code})`)
            }
            setLoading(false)
        }
        getMovie(thisMovieId)

    }, [thisMovieId])

    return (
        <MovieDiv>
            { error && <AlertMain type="danger">{ error }</AlertMain> }
            { (loading) && <SpinnerLoading /> }

            { (movieDisplayPage.title) ? (
                <>
                    <Poster
                        src={ `https://image.tmdb.org/t/p/w500/${movieDisplayPage.poster}` }
                        alt={ movieDisplayPage.title }
                    />
                    <Info>
                        <h1>{ movieDisplayPage.title }</h1>
                        <p>{ `Data wydania: ${movieDisplayPage.release_date}` }</p>
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
