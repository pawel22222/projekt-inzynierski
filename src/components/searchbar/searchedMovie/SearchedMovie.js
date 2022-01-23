import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

//#region Styled components
const StyledLink = styled(Link)`
    height: 100px;
    display: flex;
    margin: 5px;
    text-decoration: none;
    :hover{
        text-decoration: none;
    }
`
const Poster = styled.img`
    border-radius: 5px;
`
const Info = styled.div`
    padding: 5px;
    color: black;
    width: 100%;
    border-radius: 0 5px 5px 0;
    transition: background-color .3s ease;
    &:hover{
        background-color: #c4d3ff;
    }
`
//#endregion

function SearchedMovie({ id, title, desc, poster, release_date }) {
    const titleWithDate = `${title} (${release_date.slice(0, 4)})`
    const sliceDesc = `${desc.slice(0, 100)}...`

    return (
        <StyledLink to={ `/movie/${id}` }>
            <Poster
                src={ `https://image.tmdb.org/t/p/w500/${poster}` }
                alt={ title }
            />
            <Info>
                <h3>{ titleWithDate }</h3>
                <h4>{ sliceDesc }</h4>
            </Info>
        </StyledLink>
    )
}

export default SearchedMovie
