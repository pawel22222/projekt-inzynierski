import { useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
// Components
import AuthWrapper from '../wrappers/AuthWrapper'
import AuthHelperWrapper from '../wrappers/AuthHelperWrapper'
import FormGroup from '../UI/FormControl'
import ButtonSubmit from '../UI/ButtonMain'
import AlertMain from '../UI/AlertMain'
import SpinnerLoading from '../UI/SpinnerLoading'

// #region Styled Components
const Form = styled.form``
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
      <h2 style={ { textAlign: 'center' } }>Log In</h2>
      { error && <AlertMain
        type="danger">{ error }
      </AlertMain> }
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
          label="Password"
          type="password"
          required={ true }
          ref={ passwordRef }
        />
        <ButtonSubmit
          label="Log In"
          type="submit"
          loading={ loading }
        />
        { (loading) && <SpinnerLoading /> }
      </Form>
      <AuthHelperWrapper>
        <div>Need an account? <Link to="/signup">Sign Up</Link></div>
        <div>Forgot a password? <Link to="/forgot-password">Click here</Link></div>
      </AuthHelperWrapper>
    </AuthWrapper>
  )
}
