import React from 'react'
import styled from 'styled-components'
import { useRef, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

// Components
import FormGroup from '../../UI/FormControl'
import Alert from '../../UI/AlertMain'
import SpinnerLoading from '../../UI/SpinnerLoading'
import Button from '../../UI/ButtonMain'

// #region Styled Components
const Form = styled.form``
//#endregion

export default function UpdateSecurity() {
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordComfirmRef = useRef(null)
    const { updateEmail, updatePassword, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (passwordRef.current.value !== passwordComfirmRef.current.value) {
            return setError('Password do not match')
        }

        const promises = []
        setLoading(true)
        setError('')
        setSuccess('')

        if (currentUser.email !== emailRef.current.value) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises)
            .then(() => {
                setSuccess('User data successfully updated')
            })
            .catch((error) => {
                setError(`${error}`)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    return (
        <>
            <h2>Zabezpieczenia</h2>
            { error && <Alert
                type="danger">{ error }
            </Alert> }
            { success && <Alert
                type="success">{ success }
            </Alert> }
            <Form onSubmit={ handleSubmit }>
                <FormGroup
                    id="email"
                    label="Email"
                    type="email"
                    defaultValue={ currentUser.email }
                    ref={ emailRef }
                />
                <FormGroup
                    id="password"
                    label="Hasło"
                    type="password"
                    ref={ passwordRef }
                />
                <FormGroup
                    id="passwordComfirm"
                    label="Powtórz hasło"
                    type="password"
                    ref={ passwordComfirmRef }
                />
                <Button
                    label="Aktualizuj profil"
                    type="submit"
                    loading={ loading }
                />
                { (loading) && <SpinnerLoading /> }
            </Form>
        </>
    )
}
