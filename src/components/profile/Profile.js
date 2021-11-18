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
    border: 2px solid #d1d1d1;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    width: 400px;
`
export default function Dashboard() {
    const { currentUser, userInfo } = useAuth()
    console.log(userInfo)

    return (
        <>
            <Card>
                <CardBody>
                    <h1>Profile</h1>
                    <strong>Email: </strong>
                    { currentUser.email }
                    <div>
                        <Link to="/update-profile/security">
                            <Button
                                label="Edit profile"
                                type="button"
                                color="secondary"
                            />
                        </Link>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}
