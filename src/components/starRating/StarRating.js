import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'

import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
// import ButtonMain from '../UI/ButtonMain'

const StarRating = ({ movieId }) => {
    const [rating, setRating] = useState({ ratingValue: 0 })
    const { currentUser } = useAuth()

    useEffect(() => {
        const getUserRate = () => {
            db.collection('ratings')
                .where('movieId', '==', movieId)
                .where('userId', '==', currentUser.uid)
                .limit(1)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.docs.length === 0) {
                        setRating({ ratingValue: 0 })
                    } else {
                        querySnapshot.forEach((doc) => {
                            setRating(doc.data())
                        })
                    }
                })
        }

        getUserRate()
    }, [movieId])

    const getRandom = () => {
        const s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
        }
        return s4() + s4() + '-' + s4() + '-' + s4()
            + '-' + s4() + '-' + s4() + s4() + s4()
    }

    const setMovieData = (newRatingValue) => {
        db.collection('movies')
            .doc(movieId)
            .get()
            .then((doc) => {
                const counter = doc.data().ratingCounter
                const average = doc.data().averageRatings
                const oldValue = rating.ratingValue

                rating.ratingId
                    ? db.collection('movies')
                        .doc(movieId)
                        .update({
                            averageRatings: (average * counter + newRatingValue - oldValue) / (counter)
                        })
                    : db.collection('movies')
                        .doc(movieId)
                        .update({
                            ratingCounter: counter + 1,
                            averageRatings: (average * counter + newRatingValue) / (counter + 1)
                        })
            })
    }

    const setUserRate = async (id, value) => {
        await setMovieData(value)

        db.collection('ratings')
            .doc(id)
            .set({
                ratingId: id,
                userId: currentUser.uid,
                movieId: movieId,
                ratingValue: value,
            })

        setRating({
            ratingId: id,
            userId: currentUser.uid,
            movieId: movieId,
            ratingValue: value,
        })
    }

    // const removeRating = (id) => {
    //     db.collection("ratings")
    //         .doc(id)
    //         .delete()
    //         .then(() => {
    //             console.log("Document successfully deleted!")
    //         })
    // }

    return (
        <>
            <Box
                sx={ {
                    '& > legend': { mt: 2 },
                } }
                style={ {
                    transform: 'scale(1.5)',
                    position: 'relative',
                    left: '25%',
                    padding: '5px 0'
                } }
            >
                <Rating
                    name="simple-controlled"
                    size="large"
                    value={ rating.ratingValue }
                    onChange={ (event, newRating) => {
                        rating.ratingId
                            ? setUserRate(rating.ratingId, newRating)
                            : setUserRate(getRandom(), newRating)
                    } }
                />
            </Box>
            {/* <ButtonMain
                label='Usuń ocenę'
                color='danger'
                type='button'
                onClick={ removeRating(rating.ratingId) }
            /> */}
        </>
    )
}

export default StarRating