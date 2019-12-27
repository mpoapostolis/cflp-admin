import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route, RouteProps } from 'react-router';
import NotFound from './NotFound';
import { useSelector } from 'react-redux';
import { IReduxStore } from '../redux/reducers';
import Layout from '../Layout';

export const PrivateRoute = (props: RouteProps) => {
  const account = useSelector((store: IReduxStore) => store.account);
  return account.access_token ? <Route {...props} /> : <Redirect to="/login" />;
};

const Routes = () => {
  return (
    <Switch>
      <Route path="/" component={Layout} />
      <PrivateRoute component={NotFound} exact path="/not-found" />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
