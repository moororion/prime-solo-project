import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import Expired from '../Expired/Expired';
import AddItem from '../AddItem/AddItem';
import Fridge from '../Fridge/Fridge';
import Pantry from '../Pantry/Pantry';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route exact path="/" component={UserPage} />
          <Route exact path="/expired" component={Expired} />
          <Route exact path="/add-item" component={AddItem} />
          <Route exact path="/fridge" component={Fridge} />
          <Route exact path="/pantry" component={Pantry} />
          <Redirect exact from="/" to="/home" />

          <Route exact path="/about">
            <AboutPage />
          </Route>

          <ProtectedRoute exact path="/user">
            <UserPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/info">
            <InfoPage />
          </ProtectedRoute>

          <Route exact path="/login">
            {user.id ? <Redirect to="/user" /> : <LoginPage />}
          </Route>

          <Route exact path="/registration">
            {user.id ? <Redirect to="/user" /> : <RegisterPage />}
          </Route>

          <Route exact path="/home">
            {user.id ? <Redirect to="/user" /> : <LandingPage />}
          </Route>

          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
