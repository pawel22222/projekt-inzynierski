import { useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
// Components
import AuthWrapper from '../wrappers/AuthWrapper'
import AuthHelperWrapper from '../wrappers/AuthHelperWrapper'
import FormGroup from '../UI/FormControl'
import ButtonSubmit from '../UI/ButtonMain'
import Alert from '../UI/AlertMain'
import SpinnerLoading from '../UI/SpinnerLoading'


// #region Styled Components
const Form = styled.form``
const NavLink = styled(Link)`
    text-decoration: none;
    color: #7998ff;
    :hover{
        text-decoration: none;
    }
`
//#endregion

export default function Login() {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push('/')
    } catch (error) {
      setError(`Failed to Sign In. (${error.code})`)
    }
    setLoading(false)
  }

  return (
    <AuthWrapper>
      <h2 style={ { textAlign: 'center' } }>Logowanie</h2>
      { error && <Alert type="danger" desc={ error } /> }
      <Form onSubmit={ handleSubmit }>
        <FormGroup
          id="email"
          label="Email"
          type="email"
          required={ true }
          ref={ emailRef }
        />
        <FormGroup
          id="password"
          label="Hasło"
          type="password"
          required={ true }
          ref={ passwordRef }
        />
        <ButtonSubmit
          label="Zaloguj się"
          type="submit"
          loading={ loading }
        />
        { (loading) && <SpinnerLoading /> }
      </Form>
      <AuthHelperWrapper>
        <div>Nie masz konta? <NavLink to="/signup">Rejestracja</NavLink></div>
        <div>Zapomniałeś hasła? <NavLink to="/forgot-password">Zmień hasło</NavLink></div>
      </AuthHelperWrapper>
    </AuthWrapper>
  )
}
