import { useRef, useState } from 'react'
import styled from 'styled-components'

import Button from '../../UI/ButtonMain'
import Alert from '../../UI/AlertMain'
import AgeRange from './ageRange/AgeRange'

const FilterDiv = styled.div`
    width: 100%;
    background-color: #aaaaaa;
    padding: 5px;
`

function FilterStats({ setSelectedGenre, setAgeRanges }) {
    const genres = ['Akcja', 'Przygodowy', 'Animowany', 'Komedia', 'Kryminał', 'Dokumentalny', 'Dramat', 'Familijny', 'Fantasy', 'Historyczny', 'Horror', 'Muzyczny', 'Romans', 'Science Fiction', 'Thriller', 'Wojenny', 'Western']


    const inputGenreRef = useRef(null)

    const rangeFromRefs = useRef([])
    const rangeToRefs = useRef([])

    const [rangeCounter, setRangeCounter] = useState(1)
    const [error, setError] = useState('')

    const handleSubmit = () => {
        setSelectedGenre(inputGenreRef.current.value)

        const ranges = [...Array(rangeCounter)]
            .map((el, i) => {
                return {
                    from: rangeFromRefs.current[i].value,
                    to: rangeToRefs.current[i].value,
                }
            })

        setAgeRanges(ranges)
    }

    const displayAlert = (error) => {
        setError(error)
        setTimeout(() => setError(''), 4000)
    }

    const handleAddRange = () => {
        rangeCounter < 5
            ? setRangeCounter(rangeCounter + 1)
            : displayAlert('Maksymalnie 5 przedziałów')
    }

    const handleRemoveRange = () => {
        rangeCounter > 1
            ? setRangeCounter(rangeCounter - 1)
            : displayAlert('Wymagany jest 1 przedział')

    }

    return (
        <FilterDiv>
            <div>
                <label htmlFor="genre">Wybierz kategorie</label>
                <select name="genre" id="genre" ref={ inputGenreRef }>
                    { genres.map(genre =>
                        <option key={ genre } value={ genre }>{ genre }</option>
                    ) }
                </select>
            </div>

            <div style={ { display: 'flex', width: '300px', padding: '5px 0' } }>
                <Button
                    label='Dodaj przedział'
                    color='green'
                    onClick={ () => handleAddRange() }
                />
                <Button
                    label='Usuń przedział'
                    color='danger'
                    onClick={ () => handleRemoveRange() }
                />
            </div>

            <div style={ { display: 'flex', alignItems: 'center' } }>
                { [...Array(rangeCounter)].map((el, index) =>
                    <AgeRange
                        ref={
                            {
                                fromRef: (element) => {
                                    rangeFromRefs.current[index] = element
                                },
                                toRef: (element) => {
                                    rangeToRefs.current[index] = element
                                }
                            }
                        }
                        key={ index + 1 }
                        nr={ index + 1 }
                        setRangeCounter={ setRangeCounter }
                        rangeCounter={ rangeCounter }
                    />
                ) }


            </div>


            <Button
                label='Generuj tabelę'
                color='primary'
                onClick={ handleSubmit }
            />

            { error && <Alert type="danger" >{ error }</Alert> }
        </FilterDiv>
    )
}

export default FilterStats
