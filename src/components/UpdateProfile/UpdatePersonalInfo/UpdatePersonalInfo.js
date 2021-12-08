import React from 'react'
import styled from 'styled-components'
import { useRef, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../firebase'

// Components
import FormGroup from '../../UI/FormControl'
import Alert from '../../UI/AlertMain'
import SpinnerLoading from '../../UI/SpinnerLoading'
import Button from '../../UI/ButtonMain'

// #region Styled Components
const Form = styled.form``
const Select = styled.select`
    height: 35px;
    border-radius: 5px;
    border: 2px solid #cdcdcd;
`
//#endregion

export default function UpdatePersonalInfo() {
    const nameRef = useRef(null)
    const lastNameRef = useRef(null)
    const displayNameRef = useRef(null)
    const yearOfBirthRef = useRef(null)
    const sexRef = useRef(null)
    const { currentUser, userInfo, getUserDate } = useAuth()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        const promises = []
        setLoading(true)
        setError('')
        setSuccess('')

        promises.push(
            db.collection("users").doc(currentUser.uid).set({
                id: currentUser.uid,
                name: nameRef.current.value,
                lastName: lastNameRef.current.value,
                displayName: displayNameRef.current.value,
                age: yearOfBirthRef.current.value,
                sex: sexRef.current.value,
            }))

        promises.push(getUserDate())

        Promise.all(promises)
            .then(() => setSuccess('User data successfully updated'))
            .catch((error) => setError(`${error}`))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <h2>Dane</h2>

            { error && <Alert type="danger" desc={ error } /> }
            { success && <Alert type="success" desc={ success } /> }

            <Form onSubmit={ handleSubmit }>
                <FormGroup
                    id="name"
                    label="Imię"
                    type="name"
                    ref={ nameRef }
                    defaultValue={ '' || userInfo?.name }
                />
                <FormGroup
                    id="lastName"
                    label="Nazwisko"
                    type="lastName"
                    ref={ lastNameRef }
                    defaultValue={ '' || userInfo?.lastName }
                />
                <FormGroup
                    id="displayName"
                    label="Wyświetlana nazwa"
                    type="displayName"
                    ref={ displayNameRef }
                    defaultValue={ '' || userInfo?.displayName }
                />
                <FormGroup
                    id="yearOfBirthRef"
                    label="Rok urodzenia"
                    type="number"
                    min="1900" max="2010" step="1"
                    placeholder="1900-2010"
                    ref={ yearOfBirthRef }
                    defaultValue={ '' || userInfo?.age }
                />
                <label>Płeć</label>
                <form id="sex" style={ { paddingBottom: '5px' } }>
                    <Select
                        name="dropdown"
                        ref={ sexRef }
                        defaultValue={ '' || userInfo?.sex }
                    >
                        <option value="" selected> -- </option>
                        <option value="male" >Mężczyzna</option>
                        <option value="famale">Kobieta</option>
                    </Select>
                </form>
                <Button
                    label="Aktualizuj profil"
                    type="submit"
                    loading={ loading }
                    onClick={ handleSubmit }
                />
                { (loading) && <SpinnerLoading /> }
            </Form>
        </>
    )
}
