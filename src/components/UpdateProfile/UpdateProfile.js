import { Link } from 'react-router-dom'
import PrivateRoute from '../privateRoute/PrivateRoute'

// Components
import AuthWrapper from '../wrappers/AuthWrapper'
import UpdateSecurity from './updateSecurity/UpdateSecurity'
import UpdatePersonalInfo from './UpdatePersonalInfo/UpdatePersonalInfo'
import Button from '../UI/ButtonMain'
import ColoredLine from '../UI/ColoredLine'

export default function UpdateProfile() {
  return (
    <>
      <AuthWrapper>
        <h1 style={ { textAlign: 'center' } }>Profile update</h1>
        <nav>
          <Link to="/update-profile/security">Security </Link>
          <Link to="/update-profile/personal-info">Personal Info </Link>
        </nav>
        <ColoredLine color="#d1d1d1" />

        <PrivateRoute path="/update-profile/security" component={ UpdateSecurity } />
        <PrivateRoute path="/update-profile/personal-info" component={ UpdatePersonalInfo } />


        <Link to="/profile">
          <Button
            label="Back"
            type="button"
            color="secondary"
          />
        </Link>
      </AuthWrapper>
    </>
  )
}
