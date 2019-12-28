import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { IReduxStore } from '../../redux/reducers';
import { useSelector } from 'react-redux';

function PrivateRoute(props: RouteProps) {
  const account = useSelector((store: IReduxStore) => store.account);
  return account.access_token || true ? <Route {...props} /> : <Redirect to="/login" />;
}
export default PrivateRoute;
