import { forwardRef } from 'react'
import styled from 'styled-components'

import Input from '../../../UI/FormControl'

const AgeRangeDiv = styled.div`
    margin-right: 15px;
`

const AgeRange = forwardRef(({ nr }, ref) => {
    const { fromRef, toRef } = ref

    return (
        <AgeRangeDiv>
            <h3>Przedział { nr }</h3>
            <Input
                id={ `from${nr}` }
                placeholder='Od'
                type='number'
                ref={ fromRef }
                min='1'
                max='150'
                step='1'
            />

            <Input
                id={ `to${nr}` }
                placeholder='Do'
                type='number'
                ref={ toRef }
                min='1'
                max='150'
                step='1'
            />
        </AgeRangeDiv>
    )
}
)
export default AgeRange
