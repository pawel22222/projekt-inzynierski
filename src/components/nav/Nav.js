import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

import LinkStyled from '../UI/LinkStyled';
import Alert from '../UI/AlertMain';

const NavDiv = styled.nav`
  display: flex;
  align-items: center;
  background-color: #e7edff;
  height: 60px;
`;
const InfoBox = styled.nav`
  display: flex;
  justify-content: center;
  position: absolute;
  width: 90%;
  top: 170px;
  left: 5%;
  z-index: 10;
`;
const ButtonInfo = styled.button`
  color: #7998ff;
  border: 2px solid #7998ff;
  border-radius: 5px;
  background-color: white;
  margin-left: 5px;
  transition: background-color 0.3s ease;
  :hover {
    background-color: #e7edff;
  }
`;

function Nav() {
  const [warning, setWarning] = useState('');

  const { currentUser, userInfo } = useAuth();
  const isUserAgeAndSex = userInfo && userInfo.age && userInfo.sex ? true : false;

  function setTimeoutWarning(warning) {
    setWarning(warning);

    setTimeout(() => {
      setWarning('');
    }, 5000);
  }

  function handleClick() {
    if (!currentUser && !isUserAgeAndSex) {
      const warning = `Zaloguj się, aby mieć dostęp do statystyk. \n
                Uzupełnij swój profil o wiek i płeć, aby mieć dostęp do spersonalizowanego rankingu filmów.`;

      setTimeoutWarning(warning);
    } else if (!!currentUser && !isUserAgeAndSex) {
      const warning = `Uzupełnij swój profil o wiek i płeć, aby mieć dostęp do spersonalizowanego rankingu filmów.`;

      setTimeoutWarning(warning);
    }
  }

  return (
    <NavDiv>
      <LinkStyled to='/' label='Strona główna' />
      <LinkStyled to='/movies' label='Filmy' />
      {!!currentUser && isUserAgeAndSex && (
        <LinkStyled to='/recomended-movies' label='Polecane filmy' />
      )}

      {!!currentUser && <LinkStyled to='/statistic' label='Statystyki' />}

      {!isUserAgeAndSex && <ButtonInfo onClick={() => handleClick()}>Odblokuj dostęp</ButtonInfo>}

      {!!warning && (
        <InfoBox>
          <Alert type='warning' desc={warning} />
        </InfoBox>
      )}
    </NavDiv>
  );
}

export default Nav;
