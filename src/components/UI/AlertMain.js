import styled, { css } from 'styled-components'

const AlertMain = styled.div`
    background-color: #ebebeb;
    color: #a7a7a7;
    padding: 10px;
    border: 1px solid #a7a7a7;
    border-radius: 5px;
    
    
    ${({ type }) => type === 'danger' && css`
        background-color: #f89c9c;
        color: #cf4d4d;
        border: 1px solid #cf4d4d;
        `
    }
    ${({ type }) => type === 'warning' && css`
        background-color: #fffd8b;
        color: #b9b72a;
        border: 1px solid #b9b72a;
        `
    }
    ${({ type }) => type === 'success' && css`
        background-color: #ddffd4;
        color: #479135;
        border: 1px solid #479135;
        `
    }
`
export default AlertMain