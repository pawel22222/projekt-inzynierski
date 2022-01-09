import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

//#region Styled components
const StyledLink = styled(Link)`
    height: 100px;
    display: flex;
    margin: 5px;
`
const Poster = styled.img`
    border-radius: 5px 0 0 5px;
`
const Info = styled.div`
    padding: 5px;
    color: black;
    text-decoration: underline #c0c0c0;
    border-radius: 0 5px 5px 0;
    &:hover{
        background-color: #a3a3a3;
        text-decoration: underline #a3a3a3;
    }
`
//#endregion

function SearchedMovie({ id, title, genre, desc, poster, release_date }) {
    const sliceDate = (date) => `(${date.slice(0, 4)})`
    const sliceDesc = (date) => `${date.slice(0, 150)}...`

    return (
        <StyledLink to={ `/movie/${id}` }>
            <Poster
                src={ `https://image.tmdb.org/t/p/w500/${poster}` }
                alt={ title }
            />
            <Info>
                <h3>{ `${title} ${sliceDate(release_date)}` }</h3>
                <h5>{ sliceDesc(desc) }</h5>
            </Info>
        </StyledLink>
    )
}

export default SearchedMovie
