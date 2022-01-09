import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

//#region Styled components
const MovieCardsDiv = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 2px;
	@media (min-width: 768px) {
		grid-template-columns: 1fr 1fr;
	}
  	@media (min-width: 992px) {
		grid-template-columns: 1fr 1fr 1fr ;
	}
  	@media (min-width: 1200px) {
		grid-template-columns: 1fr 1fr 1fr 1fr ;
	}
`
const MovieInfo = styled.div`
    background-color: #b4b4b457;
    padding: 10px 15px;
    width: 100%;
    text-align: center;
    transition: .5s;
    user-select: none;
    font-size: 1.2em;
	`
const Movie = styled.div`
    background-image: url(${({ img }) => img});
	background-size: cover;
	background-position: center;
	height: 300px;
	display: flex;
	align-items: flex-end;
	transition: .5s;
    &:hover ${MovieInfo} {
        background-color: #b4b4b4a6;
		color: black;
		text-decoration: underline black;
  }
`
const StyledLink = styled(Link)`
   text-decoration: none;
    color: black;
`
//#endregion

function ReusableMovies({ movies }) {
    const joinGenres = (genres) => genres.join(' ')
    const dateToYear = (date) => date.slice(0, 4)

    return (
        <div name="container p-0">
            <MovieCardsDiv >
                {
                    movies.map(({
                        id,
                        title,
                        desc,
                        genre,
                        language,
                        release_date,
                        backdrop,
                        poster }) => (
                        <StyledLink
                            to={ `/movie/${id}` }
                            key={ id }
                        >
                            <Movie
                                img={ `https://image.tmdb.org/t/p/w500/${backdrop}` }
                            >
                                <MovieInfo>
                                    <div>{ `${title} (${dateToYear(release_date)})` }</div>
                                    <div>{ joinGenres(genre) }</div>
                                </MovieInfo>
                            </Movie>
                        </StyledLink>
                    ))
                }
            </MovieCardsDiv>
        </div>
    )
}

export default ReusableMovies
