import { Link } from 'react-router-dom'
import PrivateRoute from '../privateRoute/PrivateRoute'
import styled from 'styled-components'

// Components
import AuthWrapper from '../wrappers/AuthWrapper'
import UpdateSecurity from './updateSecurity/UpdateSecurity'
import UpdatePersonalInfo from './UpdatePersonalInfo/UpdatePersonalInfo'
import Button from '../UI/ButtonMain'
import ColoredLine from '../UI/ColoredLine'

const NavLink = styled(Link)`
    text-decoration: none;
    color: #7998ff;
    :hover{
        text-decoration: none;
    }
`

export default function UpdateProfile() {
  return (
    <>
      <AuthWrapper>
        <h1 style={ { textAlign: 'center' } }>Aktualizacja danych</h1>
        <nav>
          <NavLink to="/update-profile/security">Zabezpieczenia </NavLink>
          <NavLink to="/update-profile/personal-info">Prywatne </NavLink>
        </nav>
        <ColoredLine color="#d1d1d1" />

        <PrivateRoute path="/update-profile/security" component={ UpdateSecurity } />
        <PrivateRoute path="/update-profile/personal-info" component={ UpdatePersonalInfo } />


        <Link to="/profile">
          <Button
            label="Wstecz"
            type="button"
            color="secondary"
          />
        </Link>
      </AuthWrapper>
    </>
  )
}
