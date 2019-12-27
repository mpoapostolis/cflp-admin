import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from 'react-router';
import Registration from './Registration';
import NotFound from './NotFound';

const Routes = () => {
  return (
    <Switch>
      <Route component={Registration} exact path="/registration" />
      <Route component={NotFound} exact path="/not-found" />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
