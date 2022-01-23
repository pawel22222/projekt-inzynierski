import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { db } from '../../firebase'

import Alert from '../UI/AlertMain'
import SpinnerLoading from '../UI/SpinnerLoading'
import Button from '../UI/ButtonMain'
import Select from '../UI/SelectInput'
import MovieCard from './movieCard/MovieCard'

//#region Styled components
const MovieCardsDiv = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 5px;
	@media (min-width: 768px) {
		grid-template-columns: 1fr 1fr;
	}
  	@media (min-width: 992px) {
		grid-template-columns: 1fr 1fr 1fr ;
	}
`

const SeeMoreDiv = styled.div`
   	width: 300px;
	margin: 10px auto;
	display: flex;
`
const FilterDiv = styled.div`
	display: flex;
	align-items: center;
	padding: 5px;
	background-color: #e7edff;
	border-top: 2px solid #7998ff;
`
const SelectDiv = styled.div`
	display: flex;
	flex-flow: column;
	align-items: flex-end;
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
				<SelectDiv>
					<Select
						label="Wybierz kategorie"
						name="genre"
						ref={ inputGenreRef }
						options={ genres }
					/>
				</SelectDiv>

				<div style={ { width: '150px', marginLeft: '5px' } }>
					<Button
						label="Szukaj"
						color='primary'
						onClick={ () => handleSearch() }
					/>
				</div>
			</FilterDiv>

			{ error && <Alert type="danger" desc={ error } /> }

			<MovieCardsDiv className='container mt-2'>
				{ error && <Alert type="danger" desc={ error } /> }

				{ movies.map(movie => <MovieCard key={ movie.id } { ...movie } />) }
			</MovieCardsDiv>

			{ errorNoMovies && <Alert type='danger' header={ errorNoMovies.header } /> }

			<SeeMoreDiv>
				{ (loading) && <SpinnerLoading /> }

				<Button
					onClick={ () => fetchMovies(selectedGenre) }
					label="Zobacz więcej.."
				/>
			</SeeMoreDiv>
		</>
	)
}

export default Movies
