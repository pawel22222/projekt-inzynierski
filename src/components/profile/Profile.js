import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

// Components
import Button from '../UI/ButtonMain'
import RecentlyRatedMovies from './recentlyRatedMovies/RecentlyRatedMovies'

const Card = styled.div`
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
`
const CardBody = styled.div`
    border: 2px solid #d1d1d1;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    width: 400px;
`
export default function Dashboard() {
    const { currentUser } = useAuth()

    return (
        <>
            <Card>
                <CardBody>
                    <h1>Twoje konto</h1>
                    { 'Email: ' }
                    <strong>{ currentUser.email }</strong>
                    <div>
                        <Link to="/update-profile/security">
                            <Button
                                label="Edytuj profil"
                                type="button"
                                color="secondary"
                            />
                        </Link>
                    </div>
                </CardBody>

                {/* <RecentlyRatedMovies /> */ }
            </Card>
        </>
    )
}
