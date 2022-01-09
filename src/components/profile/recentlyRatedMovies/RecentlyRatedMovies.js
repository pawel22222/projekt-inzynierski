import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { db } from '../../../firebase'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

import Alert from '../../UI/AlertMain'
import SpinnerLoading from '../../UI/SpinnerLoading'
import Button from '../../UI/ButtonMain'
import ReusableMovies from '../../reusableMovies/ReusableMovies'

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
//#endregion

function RecentlyRatedMovies() {
	const [loading, setLoading] = useState('')
	const [error, setError] = useState('')
	const [errorNoMovies, setErrorNoMovies] = useState('')

	const [movies, setMovies] = useState([])
	const [ratings, setRatings] = useState([])

	const [lastRate, setLastRate] = useState('')
	const [lastMovie, setLastMovie] = useState('')

	console.log(ratings)
	const { currentUser } = useAuth()

	useEffect(() => {
		const fetchRatings = async () => {
			try {
				const ratingsArr = ratings
				setError('')
				setLoading(true)

				await db.collection('ratings')
					.where('userId', '==', currentUser.uid)
					// .startAfter(lastRate)
					.limit(2)
					.get()
					.then((querySnapshot) => {
						if (querySnapshot.docs.length) {
							setLastRate(...querySnapshot.docs.slice(-1))

							querySnapshot.forEach(doc => {
								ratingsArr.push(doc.data().movieId)
							})

							setRatings(ratingsArr)
						} else {
							console.log('brak')
							setErrorNoMovies({ header: 'Brak filmów do wyświetlenia' })
						}
					})

			} catch (error) {
				setError(`Failed to fetch ratings. (${error})`)
			}

			setLoading(false)
		}

		fetchRatings()
	}, [])

	useEffect(() => {
		const fetchMovies = async () => {
			console.log('ratings')
			try {
				let moviesArr = movies
				setError('')
				setLoading(true)
				await db.collection('movies')
					.where('id', 'in', ratings)
					// .startAfter(lastMovie)
					.limit(2)
					.get()
					.then((querySnapshot) => {
						if (querySnapshot.docs.length) {
							setLastMovie(...querySnapshot.docs.slice(-1))

							querySnapshot.forEach(doc => {
								moviesArr.push(doc.data())
							})

							console.log(moviesArr)
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

		!!ratings.length && fetchMovies()
	}, [ratings])

	return (
		<div>
			{ error && <Alert type="danger" header={ error } /> }
			{ errorNoMovies && <Alert type="danger" header={ errorNoMovies } /> }

			{ !!movies && <h2>Ostatnio ocenione filmy</h2> }
			{ !!movies && <ReusableMovies movies={ movies } /> }
		</div >
	)
}

export default RecentlyRatedMovies
