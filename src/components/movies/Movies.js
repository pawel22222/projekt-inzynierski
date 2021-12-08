import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { db } from '../../firebase'

import Alert from '../UI/AlertMain'
import SpinnerLoading from '../UI/SpinnerLoading'
import Button from '../UI/ButtonMain'

//#region Styled components
const MovieCardsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
`
const MovieInfo = styled.div`
    background-color: #b4b4b457;
    padding: 10px 15px ;
    width: 100%;
    text-align: center;
    transition: .5s;
    user-select: none;
    font-size: 1.2em;
`
const Movie = styled.div`
    background-image: url(${({ img }) => img});
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 300px;
    display: flex;
    align-items: end;
    margin: 2px;
    &:hover ${MovieInfo} {
        background-color: #b4b4b4a6;
  }
`
const StyledLink = styled(Link)`
   text-decoration: none;
    color: black;
`
//#endregion

function Movies() {
	const [error, setError] = useState('')
	const [loading, setLoading] = useState('')

	const [movies, setMovies] = useState([])
	const [lastDoc, setLastDoc] = useState('')

	const mapGenres = (genres) => genres.map(genre => ` ${genre}`)
	const mapDate = (date) => date.slice(0, 4)

	const fetchMovies = async () => {
		try {
			const moviesArr = movies
			setError('')
			setLoading(true)

			await db.collection('movies')
				.orderBy('ratingCounter', 'desc')
				.startAfter(lastDoc)
				.limit(6)
				.get()
				.then((querySnapshot) => {
					setLastDoc(...querySnapshot.docs.slice(-1))

					querySnapshot.forEach(doc => {
						moviesArr.push(doc.data())
					})

					setMovies(moviesArr)
				})

		} catch (error) {
			setError(`Failed to fetch movies. (${error})`)
		}

		setLoading(false)
	}

	useEffect(() => {
		if (movies.length === 0) {
			fetchMovies()
		}
	}, [])

	return (
		<>
			<MovieCardsDiv >
				{ error && <Alert type="danger" desc={ error } /> }
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
									<div>{ `${title} (${mapDate(release_date)})` }</div>
									<div>{ mapGenres(genre) }</div>
								</MovieInfo>
							</Movie>
						</StyledLink>
					))
				}
			</MovieCardsDiv>
			<div style={ {
				width: '300px',
				margin: '10px auto',
				display: 'flex',

			} }>
				{ (loading) && <SpinnerLoading /> }
				<Button
					onClick={ fetchMovies }
					label="Zobacz więcej.."
				/>
			</div>
		</>
	)
}

export default Movies
