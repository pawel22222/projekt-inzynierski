import { Link } from 'react-router-dom';
import PrivateRoute from '../privateRoute/PrivateRoute';

// Components
import AuthWrapper from '../wrappers/AuthWrapper';
import UpdateSecurity from './updateSecurity/UpdateSecurity';
import UpdatePersonalInfo from './UpdatePersonalInfo/UpdatePersonalInfo';
import Button from '../UI/ButtonMain';
import ColoredLine from '../UI/ColoredLine';
import LinkStyled from '../UI/LinkStyled';

export default function UpdateProfile() {
  return (
    <AuthWrapper>
      <h1 style={{ textAlign: 'center' }}>Aktualizacja danych</h1>
      <nav style={{ display: 'flex' }}>
        <LinkStyled to='/update-profile/security' label='Zabezpieczenia' />
        <LinkStyled to='/update-profile/personal-info' label='Prywatne' />
      </nav>
      <ColoredLine color='#7998ff' />

      <PrivateRoute path='/update-profile/security' component={UpdateSecurity} />
      <PrivateRoute path='/update-profile/personal-info' component={UpdatePersonalInfo} />

      <Link to='/profile'>
        <Button label='Wstecz' type='button' color='secondary' />
      </Link>
    </AuthWrapper>
  );
}
