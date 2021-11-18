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
  background-color: #b4b4b4;
  display: flex;
  /* align-items: center; */
  `
const AccountDiv = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
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
      return `Hi  ${userInfo.displayName ? userInfo.displayName : userInfo.name}`
    else if (currentUser) return `Hi ${currentUser.email.split('@')[0]}`
    else return `Hello there`
  }

  return (
    <Container>
      { error && <Alert type="danger" /> }

      <Searchbar />

      <AccountDiv>
        { greetingUser() }
        { !!currentUser ? (
          <>
            <Link to="/profile" style={ { width: '100%' } }>
              <Button
                label="My account"
                type="button"
              />
            </Link>
            <Button
              onClick={ handleLogOut }
              label="Log out"
              type="button"
              color="secondary"
            />
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                label="Login"
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
