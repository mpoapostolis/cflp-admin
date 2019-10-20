import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { useHistory, Route } from 'react-router';
import Registration from './Registration';
import NotFound from './NotFound';
import Login from './Login';

const Routes = () => {
  const history = useHistory();

  return (
    <Switch>
      <Redirect exact from="/" to="/reports" />
      <Route component={Registration} exact path="/registration" />
      <Route component={Login} exact path="/login" />
      <Route component={NotFound} exact path="/not-found" />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
