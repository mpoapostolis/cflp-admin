import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from 'react-router';
import Registration from './Registration';
import NotFound from './NotFound';
import Login from './Login';

const Routes = () => {
  return (
    <Switch>
      <Route render={() => <Redirect to="/login"></Redirect>} exact path="/" />
      <Route component={Registration} exact path="/registration" />
      <Route component={Login} exact path="/login" />
      <Route component={NotFound} exact path="/not-found" />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
