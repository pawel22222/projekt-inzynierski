import { useRef, useState } from 'react'
import styled from 'styled-components'

import Button from '../../UI/ButtonMain'
import Alert from '../../UI/AlertMain'
import AgeRange from './ageRange/AgeRange'
import Select from '../../UI/SelectInput'

//#region Styled components
const FilterDiv = styled.div`
    width: 100%;
    background-color: #e7edff;
    padding: 5px;
    margin-bottom: 20px;
    border-top: 3px solid #7998ff;
`
//#endregion

function FilterStats({
    setSelectedGenre,
    setAgeRanges,
    errorFilter,
    setErrorFilter,
    generatePDF,
}) {
    const genres = ['Akcja', 'Przygodowy', 'Animowany', 'Komedia', 'Kryminał', 'Dokumentalny', 'Dramat', 'Familijny', 'Fantasy', 'Historyczny', 'Horror', 'Muzyczny', 'Romans', 'Science Fiction', 'Thriller', 'Wojenny', 'Western']

    const inputGenreRef = useRef(null)

    const rangeFromRefs = useRef([])
    const rangeToRefs = useRef([])

    const [rangeCounter, setRangeCounter] = useState(1)

    function validateInputs(array) {
        setErrorFilter('')
        array.forEach(({ from, to }, i) => {
            if (
                from > to
                || from > 150 || from < 1
                || to > 150 || to < 1
                || (i > 0 ? from < array[i - 1].to : false)
            ) {
                setErrorFilter({
                    header: `Niepoprawne dane w ${i + 1} przedziale`,
                    desc: `
                        -tylko wartości 1-150 \n
                        -przedziały należy wprowadzać rosnąco \n
                        -dolna granica przedziału nie może być większa od górnej granicy \n
                        -przedziały nie mogą nakładać się na siebie \n
                `})
                return false
            }
        })

        return true
    }

    function getRanges(rangeCounter) {
        return [...Array(rangeCounter)]
            .map((el, i) => {
                return {
                    from: parseInt(rangeFromRefs.current[i].value),
                    to: parseInt(rangeToRefs.current[i].value),
                }
            })
    }

    function handleSubmit() {
        setSelectedGenre(inputGenreRef.current.value)

        const ranges = getRanges(rangeCounter)

        if (validateInputs(ranges)) {
            setAgeRanges(ranges)
        }
    }

    function displayAlert(error) {
        setErrorFilter({ header: error })
        setTimeout(() => setErrorFilter(''), 4000)
    }

    function handleAddRange() {
        const maxRange = 7
        rangeCounter < maxRange
            ? setRangeCounter(rangeCounter + 1)
            : displayAlert(`Maksymalnie ${maxRange} przedziałów`)
    }

    function handleRemoveRange() {
        rangeCounter > 1
            ? setRangeCounter(rangeCounter - 1)
            : displayAlert('Wymagany jest 1 przedział')
    }

    return (
        <FilterDiv>
            <div>
                <Select
                    lable="Wybierz kategorie: "
                    name="genre"
                    ref={ inputGenreRef }
                    options={ genres }
                />
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

            <div className='d-flex flex-wrap'>
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

            <div className="d-flex my-2" style={ { width: '400px' } }>
                <Button
                    label='Generuj tabelę'
                    color='primary'
                    onClick={ handleSubmit }
                />

                <Button
                    label='Pobierz PDF'
                    color='secondary'
                    onClick={ () => generatePDF() }
                />
            </div>

            {
                errorFilter &&
                <Alert
                    type="danger"
                    header={ errorFilter.header }
                    desc={ errorFilter.desc }
                /> }
        </FilterDiv>
    )
}

export default FilterStats
