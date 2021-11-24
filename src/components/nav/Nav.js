import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavDiv = styled.nav`
    display:flex;
    align-items: center;
    background-color: #c5c5c5;
    height: 60px;
`
const LinkLabel = styled.div`
    padding: 5px;
`

function Nav() {
    return (
        <NavDiv>
            <Link to="/"><LinkLabel>Strona główna</LinkLabel></Link>
            <Link to="/movies"><LinkLabel>Filmy</LinkLabel></Link>


        </NavDiv>
    )
}

export default Nav
