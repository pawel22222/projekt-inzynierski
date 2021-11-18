import { useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
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

export default function ForgotPassword() {
  const emailRef = useRef(null)
  const { resetPassword } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setMessage('')
      setError('')
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage('Check your inbox for further instructions')
    } catch (error) {
      setError(`Failed reset password. (${error.code})`)
    }
    setLoading(false)
  }

  return (
    <>
      <AuthWrapper>
        <h2 style={ { textAlign: 'center' } }>Password Reset</h2>
        { error && <AlertMain type="danger">
          { error }
        </AlertMain> }
        { message && <AlertMain type="success">
          { message }
        </AlertMain> }
        <Form onSubmit={ handleSubmit }>
          <FormGroup
            id="email"
            label="Email"
            type="email"
            required={ true }
            ref={ emailRef }
          />
          <ButtonSubmit
            label="Reset Password"
            type="submit"
            loading={ loading }
          />
          { (loading) && <SpinnerLoading /> }
        </Form>
        <AuthHelperWrapper>
          <div>
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </AuthHelperWrapper>
      </AuthWrapper>
    </>
  )
}
