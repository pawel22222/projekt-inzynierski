import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import Searchbar from '../searchbar/Searchbar';

import Button from '../UI/ButtonMain';
import Alert from '../UI/AlertMain';

//#region Styled components
const Container = styled.div`
  height: 100px;
  width: 100%;
  padding: 5px;
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: space-around;
  }
`;
const AccountDiv = styled.div`
  text-align: center;
  display: flex;
  flex-flow: column;
  min-width: 150px;
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;
//#endregion

export default function Header() {
  const [error, setError] = useState('');
  const history = useHistory();
  const { logout, currentUser, userInfo } = useAuth();
  const windowWidth = document.body.offsetWidth;

  async function handleLogOut() {
    setError('');
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      setError(`Failed to log out. (${error})`);
    }
  }

  const greetingUser = () => {
    if (userInfo?.name || userInfo?.displayName)
      return `Witaj  ${userInfo.displayName ? userInfo.displayName : userInfo.name}`;
    else if (currentUser) return `Witaj ${currentUser.email.split('@')[0]}`;
  };

  return (
    <Container>
      {error && <Alert type='danger' desc={error} />}

      <Searchbar />

      <AccountDiv>
        {windowWidth > 768 && greetingUser()}
        {!!currentUser ? (
          <>
            <Link to='/profile' style={{ width: '100%' }}>
              <Button label='Moje konto' type='button' color='primary' />
            </Link>

            <Button onClick={handleLogOut} label='Wyloguj' type='button' color='secondary' />
          </>
        ) : (
          <>
            <Link to='/login'>
              <Button label='Zaloguj się' type='button' color='secondary' />
            </Link>
          </>
        )}
      </AccountDiv>
    </Container>
  );
}
