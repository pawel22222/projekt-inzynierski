import React from 'react'
import styled, { css } from 'styled-components'

const Button = styled.button`
    border: 2px solid #cdcdcd;
    border-radius: 5px;
    background-color: #2373eb;
    color: white;
    height: 35px;
    width: 100%;
    :hover{
        background-color: #1e69da;
        cursor: pointer;
    }
    ${({ color }) => color === 'primary' && css`
        background-color: #2373eb;
        :hover { background-color: #1e69da; }
    `}
    ${({ color }) => color === 'secondary' && css`
        background-color: #a1a1a1;
        :hover { background-color: #8a8a8a; }
    `}
    ${({ color }) => color === 'danger' && css`
        background-color: #e43a3a;
        :hover { background-color: #d83434; }
    `}
    ${({ color }) => color === 'green' && css`
        background-color: #2ab607;
        :hover { background-color: #27a807; }
    `}
`

export default function ButtonMain({ label, type, loading, onClick, color }) {
    return (
        <Button
            color={ color }
            type={ type }
            disabled={ loading }
            onClick={ onClick }
        >
            { label }
        </Button>
    )
}
