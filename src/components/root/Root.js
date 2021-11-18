import { useState } from 'react'
import GlobalStyle from '../../theme/GlobalStyle'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import PrivateRoute from '../privateRoute/PrivateRoute'
import uploadMovies from '../../data/uploadMovies'

// Components
import SignUp from '../SignUp/SignUp'
import Profile from '../profile/Profile'
import Login from '../login/Login'
import ForgotPassword from '../forgotPassword/ForgotPassword'
import Header from '../header/Header'
import UpdateProfile from '../UpdateProfile/UpdateProfile'
import Nav from '../nav/Nav'
import Home from '../home/Home'
import Movies from '../movies/Movies'
import Movie from '../movies/movie/Movie'

function Root() {
  const [movies, setMovies] = useState([])

  return (
    <div>
      <GlobalStyle />


      <Router>
        <AuthProvider>
          <Header />
          <Nav />
          <Switch>
            <Route path="/" exact component={ Home } />
            <PrivateRoute path="/profile" component={ Profile } />
            <PrivateRoute path="/update-profile" component={ UpdateProfile } />
            <Route path="/signup" component={ SignUp } />
            <Route path="/login" component={ Login } />
            <Route path="/forgot-password" component={ ForgotPassword } />
            <Route
              path="/movies"
              component={ () => <Movies movies={ movies } setMovies={ setMovies } /> }
            />
            <Route path="/movie/:id" component={ Movie }
            />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default Root
