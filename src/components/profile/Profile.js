import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

// Components
import Button from '../UI/ButtonMain'

const Card = styled.div`
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
`
const CardBody = styled.div`
    border: 2px solid #7998ff;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    width: 400px;
`
export default function Dashboard() {
    const { currentUser } = useAuth()

    return (
        <Card>
            <CardBody>
                <h1>Twoje konto</h1>

                <p>Email: <b>{ currentUser.email }</b></p>

                <Link to="/update-profile/security">
                    <Button
                        label="Edytuj profil"
                        type="button"
                        color="secondary"
                    />
                </Link>
            </CardBody>
        </Card>
    )
}
