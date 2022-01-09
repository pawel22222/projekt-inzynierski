import { forwardRef } from 'react'
import styled from 'styled-components'

const Select = styled.select`
    height: 35px;
    border-radius: 5px;
    border: 2px solid #cdcdcd;
    margin-left: 5px;
    &:focus{
        outline:3px #868686 solid ;
    }
`

const SelectInput = forwardRef(({ label, name, options }, ref) => {
    return (
        <>
            <label htmlFor={ name }>{ label }</label>
            <Select
                name={ name }
                id={ name }
                ref={ ref }
            >
                { options.map(option =>
                    <option key={ option } value={ option }>{ option }</option>
                ) }
            </Select>
        </>
    )
})

export default SelectInput
