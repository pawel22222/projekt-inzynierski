import GlobalStyle from '../../theme/GlobalStyle'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import PrivateRoute from '../privateRoute/PrivateRoute'
// import uploadMovies from '../../data/uploadMovies'

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
import Statistic from '../statistic/Statistic'
import RecomendedMovies from '../recommendedMovies/RecomendedMovies'
import Footer from '../footer/Footer'

function Root() {

  return (
      <Router>
        <GlobalStyle />
        
        <AuthProvider>
          <Header />
          <Nav />

          <main style={ { minHeight: 'calc(100vh - 230px)' } }>
            <Switch>
              <Route path="/" exact component={ Home } />
              <PrivateRoute path="/profile" component={ Profile } />
              <PrivateRoute path="/update-profile" component={ UpdateProfile } />
              <Route path="/signup" component={ SignUp } />
              <Route path="/login" component={ Login } />
              <Route path="/forgot-password" component={ ForgotPassword } />
              <Route path="/movies" component={ Movies } />
              <Route path="/movie/:movieId" component={ Movie } />
              <PrivateRoute path="/statistic" component={ Statistic } />
              <PrivateRoute path="/recomended-movies" component={ RecomendedMovies } />
            </Switch>
          </main>

          <Footer />
        </AuthProvider>
      </Router>
  )
}

export default Root
