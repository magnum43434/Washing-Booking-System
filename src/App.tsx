import React from 'react'
import './App.css';
import { Container, Grid } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import DataTable from './components/DataTable';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import NavBar from './components/NavBar';


export default function App() {

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <AuthProvider>
        <Router>
          <NavBar />
          <Container fixed>
            <Switch>
              <PrivateRoute exact path="/" component={DataTable} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <PrivateRoute path="/profile" component={Profile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </Container>
        </Router>
      </AuthProvider>
    </Grid>
  )
}

