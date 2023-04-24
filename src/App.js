import GlobalStyle from './theme/GlobalStyle';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/privateRoute/PrivateRoute';
// import uploadMovies from '../../data/uploadMovies'

import SignUp from './components/SignUp/SignUp';
import Profile from './components/profile/Profile';
import Login from './components/login/Login';
import ForgotPassword from './components/forgotPassword/ForgotPassword';
import Header from './components/header/Header';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import Nav from './components/nav/Nav';
import Home from './components/home/Home';
import Movies from './components/movies/Movies';
import Movie from './components/movies/movie/Movie';
import Statistic from './components/statistic/Statistic';
import RecomendedMovies from './components/recommendedMovies/RecomendedMovies';
import Footer from './components/footer/Footer';

function App() {
  return (
    <Router>
      <GlobalStyle />

      <AuthProvider>
        <Header />
        <Nav />

        <main style={{ minHeight: 'calc(100vh - 230px)' }}>
          <Switch>
            <Route path='/' exact component={Home} />
            <PrivateRoute path='/profile' component={Profile} />
            <PrivateRoute path='/update-profile' component={UpdateProfile} />
            <Route path='/signup' component={SignUp} />
            <Route path='/login' component={Login} />
            <Route path='/forgot-password' component={ForgotPassword} />
            <Route path='/movies' component={Movies} />
            <Route path='/movie/:movieId' component={Movie} />
            <PrivateRoute path='/statistic' component={Statistic} />
            <PrivateRoute path='/recomended-movies' component={RecomendedMovies} />
          </Switch>
        </main>

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
