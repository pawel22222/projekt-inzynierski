import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { db } from '../../firebase'

import SearchedMovie from './searchedMovie/SearchedMovie'

//#region Styled components
const SearchbarDiv = styled.div`
    z-index: 10;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    `
const Input = styled.input`
    height: 35px;
    width: 70%;
    border-radius: 5px;
    border: 2px solid #cdcdcd;
    `
const SearchResults = styled.div`
    background-color: gray;
    width: 70%;
    border-radius: 5px;
    /* border: 2px solid #cdcdcd; */
    `
//#endregion

function Searchbar() {
    const [input, setInput] = useState('')
    const [searchedMovies, setSearchedMovies] = useState([])
    const inputRef = useRef(null)

    const [displaySearchbarResult, setDisplaySearchbarResult] = useState(false)

    useEffect(() => {
        const fetchMovies = async () => {
            const moviesArr = []

            await db.collection('movies')
                .where('title', '>=', input)
                .where('title', '<=', input + '\uf8ff')
                .orderBy('title')
                .limit(3)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        moviesArr.push(doc.data())
                    })
                    setSearchedMovies(moviesArr)
                })
        }

        (input.length > 2)
            ? fetchMovies()
            : setSearchedMovies([])
    }, [input])

    const firstCharToUpper = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    return (
        <SearchbarDiv>
            <Input
                type='search'
                ref={ inputRef }
                placeholder="Search movie.."
                value={ input }
                onChange={ (e) => setInput(firstCharToUpper(e.target.value)) }
                onBlur={ () => setTimeout(() => setDisplaySearchbarResult(false), 100) }
                onFocus={ () => setDisplaySearchbarResult(true) }
            />
            {
                displaySearchbarResult && <SearchResults>
                    {
                        searchedMovies.map(movie => {
                            return (
                                <SearchedMovie
                                    key={ movie.title }
                                    { ...movie }
                                />
                            )
                        })
                    }
                </SearchResults>
            }
        </SearchbarDiv >
    )
}

export default Searchbar
