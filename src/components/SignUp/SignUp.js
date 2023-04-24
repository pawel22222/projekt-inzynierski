import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';
// Components
import AuthWrapper from '../wrappers/AuthWrapper';
import AuthHelperWrapper from '../wrappers/AuthHelperWrapper';
import FormGroup from '../UI/FormControl';
import ButtonSubmit from '../UI/ButtonMain';
import Alert from '../UI/AlertMain';
import SpinnerLoading from '../UI/SpinnerLoading';

// #region Styled Components
const Form = styled.form``;
const NavLink = styled(Link)`
  text-decoration: none;
  color: #7998ff;
  :hover {
    text-decoration: none;
  }
`;
//#endregion

export default function SignUp() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Password do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push('/');
    } catch (error) {
      setError(`Failed to create an accounts. (${error.code})`);
    }
    setLoading(false);
  };

  return (
    <>
      <AuthWrapper>
        <h2 style={{ textAlign: 'center' }}>Rejestracja</h2>
        {error && <Alert type='danger' desc={error} />}

        <Form onSubmit={handleSubmit}>
          <FormGroup id='email' label='Email' type='email' ref={emailRef} required={true} />
          <FormGroup
            id='password'
            label='Hasło'
            type='password'
            ref={passwordRef}
            required={true}
          />
          <FormGroup
            id='passwordConfirm'
            label='Powtórz hasło'
            type='password'
            ref={passwordConfirmRef}
            required={true}
          />
          <ButtonSubmit label='Stwórz konto' type='submit' loading={loading} />
          {loading && <SpinnerLoading />}
        </Form>
        <AuthHelperWrapper>
          Masz już konto? <NavLink to='/login'>Zaloguj się</NavLink>
        </AuthHelperWrapper>
      </AuthWrapper>
    </>
  );
}
