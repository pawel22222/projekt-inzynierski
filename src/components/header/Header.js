import { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthContext'
import { useHistory, Link } from 'react-router-dom'
import Searchbar from '../searchbar/Searchbar'

import Button from '../UI/ButtonMain'
import Alert from '../UI/AlertMain'

//#region Styled components
const Container = styled.div`
  height: 100px;
  width: 100%;
  padding: 5px;
  background-color: #f8f8f8;
  display: flex;
  `
const AccountDiv = styled.div`
  text-align:center;
  display: flex;
  flex-flow: column;
  min-width: 150px;
  `
//#endregion

export default function Header() {
  const [error, setError] = useState('')
  const history = useHistory()
  const { logout, currentUser, userInfo } = useAuth()

  async function handleLogOut() {
    setError('')
    try {
      await logout()
      history.push('/login')
    } catch (error) {
      setError(`Failed to log out. (${error})`)
    }
  }

  const greetingUser = () => {
    if (userInfo?.name || userInfo?.displayName)
      return `Witaj  ${userInfo.displayName ? userInfo.displayName : userInfo.name}`
    else if (currentUser) return `Hi ${currentUser.email.split('@')[0]}`
  }

  return (
    <Container>
      { error && <Alert type="danger" desc={ error } /> }

      <Searchbar />

      <AccountDiv>
        { greetingUser() }
        { !!currentUser ? (
          <>
            <Link to="/profile" style={ { width: '100%' } }>
              <Button
                label="Moje konto"
                type="button"
              />
            </Link>
            <Button
              onClick={ handleLogOut }
              label="Wyloguj"
              type="button"
              color="secondary"
            />
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                label="Zaloguj się"
                type="button"
                color="secondary"
              />
            </Link>
          </>
        ) }
      </AccountDiv>
    </Container>
  )
}
