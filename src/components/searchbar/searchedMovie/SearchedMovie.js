import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

//#region Styled components
const StyledLink = styled(Link)`
    width: 100%;
    height: 100px;
    display: flex;
    margin: 5px;
    `
const Poster = styled.img`
    /* width: 200px; */
    `
const Info = styled.div`
    padding: 5px;
    color: black;
    `
//#endregion

function SearchedMovie({ id, title, genre, desc, poster, release_date }) {
    const mapDate = (date) => `(${date.slice(0, 4)})`
    const mapDesc = (date) => `${date.slice(0, 150)}...`

    return (
        <StyledLink to={ `/movie/${id}` }>
            <Poster
                src={ `https://image.tmdb.org/t/p/w500/${poster}` }
                alt={ title }
            />
            <Info>
                <h3>{ `${title} ${mapDate(release_date)}` }</h3>
                <h5>{ mapDesc(desc) }</h5>
            </Info>
        </StyledLink>
    )
}

export default SearchedMovie
