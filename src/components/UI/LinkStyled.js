import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const LinkMain = styled(Link)`
    position: relative;
    text-decoration: none;
    color: #7998ff;
    :hover{
        text-decoration: none;
        color: #7998ff;
    }
    ::before {
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #7998ff;
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }
    :hover::before {
        transform: scaleX(1);
    }
`
const LinkLabel = styled.div`
    padding: 5px;
`

function LinkStyled({ to, label }) {
    return (
        <LinkMain to={ to }><LinkLabel>{ label }</LinkLabel></LinkMain>
    )
}

export default LinkStyled
