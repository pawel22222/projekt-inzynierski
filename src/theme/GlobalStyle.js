import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: border-box;
    }
    
    html{
        font-size: 62.5%;
    }
    
    body{
        font-family: "Roboto", sans-serif;
        font-size: 1.6rem;
        margin: 0;
    }


`

export default GlobalStyle
