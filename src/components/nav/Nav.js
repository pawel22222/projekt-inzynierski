import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'

const NavDiv = styled.nav`
    display:flex;
    align-items: center;
    background-color: #e4e4e4;
    height: 60px;
`
const NavLink = styled(Link)`
    text-decoration: none;
    color: #7998ff;
    :hover{
        text-decoration: none;
    }
`
const LinkLabel = styled.div`
    padding: 5px;
`

function Nav() {
    const { currentUser } = useAuth()

    return (
        <NavDiv>
            <NavLink to="/"><LinkLabel>Strona główna</LinkLabel></NavLink>
            <NavLink to="/movies"><LinkLabel>Filmy</LinkLabel></NavLink>
            { !!currentUser && <NavLink to="/statistic"><LinkLabel>Statystyki</LinkLabel></NavLink> }
            { !!currentUser && <NavLink to="/recomended-movies"><LinkLabel>Polecane filmy</LinkLabel></NavLink> }
        </NavDiv>
    )
}

export default Nav
