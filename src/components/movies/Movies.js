import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { db } from '../../firebase'

import Alert from '../UI/AlertMain'
import SpinnerLoading from '../UI/SpinnerLoading'
import Button from '../UI/ButtonMain'
import Select from '../UI/SelectInput'
import ReusableMovies from '../reusableMovies/ReusableMovies'

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
const SeeMoreDiv = styled.div`
   	width: 300px;
	margin: 10px auto;
	display: flex;
`
const FilterDiv = styled.div`
	background-color: #c7c7c7;
	border-top: 3px solid #868686;
    border-bottom: 3px solid #868686;
`

//#endregion

function Movies() {
	const [loading, setLoading] = useState('')
	const [error, setError] = useState('')
	const [errorNoMovies, setErrorNoMovies] = useState('')

	const [movies, setMovies] = useState([])
	const [lastDoc, setLastDoc] = useState('')

	const genres = ['Wszystkie', 'Akcja', 'Przygodowy', 'Animowany', 'Komedia', 'Kryminał', 'Dokumentalny', 'Dramat', 'Familijny', 'Fantasy', 'Historyczny', 'Horror', 'Muzyczny', 'Romans', 'Science Fiction', 'Thriller', 'Wojenny', 'Western']

	const inputGenreRef = useRef(null)
	const [selectedGenre, setSelectedGenre] = useState('Wszystkie')

	const fetchMovies = async (genre) => {
		const isAll = genre === 'Wszystkie'
			? db.collection('movies')
			: db.collection('movies').where('genre', 'array-contains', genre)

		try {
			const moviesArr = movies
			setError('')
			setErrorNoMovies('')
			setLoading(true)

			await isAll
				.orderBy('ratingCounter', 'desc')
				.startAfter(lastDoc)
				.limit(12)
				.get()
				.then((querySnapshot) => {
					if (querySnapshot.docs.length) {
						setLastDoc(...querySnapshot.docs.slice(-1))

						querySnapshot.forEach(doc => {
							moviesArr.push(doc.data())
						})

						setMovies(moviesArr)
					} else {
						setErrorNoMovies({ header: 'Brak filmów do wyświetlenia' })
					}
				})

		} catch (error) {
			setError(`Failed to fetch movies. (${error})`)
		}

		setLoading(false)
	}

	useEffect(() => {
		fetchMovies(selectedGenre)
	}, [selectedGenre])

	const handleSearch = () => {
		setMovies([])
		setLastDoc('')
		selectedGenre === inputGenreRef.current.value
			? fetchMovies(selectedGenre)
			: setSelectedGenre(inputGenreRef.current.value)
	}

	return (
		<>
			<FilterDiv>
				<Select
					label="Wybierz kategorie: "
					name="genre"
					ref={ inputGenreRef }
					options={ genres }
				/>

				<Button
					label="Szukaj"
					color='primary'
					onClick={ () => handleSearch() }
				/>
			</FilterDiv>

			{ error && <Alert type="danger" desc={ error } /> }

			<ReusableMovies movies={ movies } />

			{ errorNoMovies && <Alert type='danger' header={ errorNoMovies.header } /> }

			<SeeMoreDiv>
				{ (loading) && <SpinnerLoading /> }
				<Button
					onClick={ () => fetchMovies(selectedGenre) }
					label="Zobacz więcej.."
				/>
			</SeeMoreDiv>

			{/* <div name="container p-0">
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
										<div>{ `${title} (${dateToYear(release_date)})` }</div>
										<div>{ joinGenres(genre) }</div>
									</MovieInfo>
								</Movie>
							</StyledLink>
						))
					}
				</MovieCardsDiv>

				{ errorNoMovies && <Alert type='danger' header={ errorNoMovies.header } /> }

				<SeeMoreDiv>
					{ (loading) && <SpinnerLoading /> }
					<Button
						onClick={ () => fetchMovies(selectedGenre) }
						label="Zobacz więcej.."
					/>
				</SeeMoreDiv>
			</div> */}

		</>
	)
}

export default Movies
