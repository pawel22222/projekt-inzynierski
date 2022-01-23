import React from 'react'
import styled from 'styled-components'

const FooterDiv = styled.footer`
  height: 50px;
  width: 100%;
  padding: 5px;
  background-color: #e7edff;
  display: flex;
  justify-content: center;
  align-items: center;
`

function Footer() {
    return (
        <FooterDiv className='mt-3'>
            FilmStats 2020 by Paweł Sokołowski
        </FooterDiv>
    )
}

export default Footer
