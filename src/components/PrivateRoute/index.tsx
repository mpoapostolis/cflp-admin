import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { useAccount } from '../../provider';

function PrivateRoute(props: RouteProps) {
  const account = useAccount();
  return account.token ? <Route {...props} /> : <Redirect to="/login" />;
}
export default PrivateRoute;
