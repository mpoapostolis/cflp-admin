import React, { useEffect, useState } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route, useHistory } from 'react-router';
import NotFound from './NotFound';
import Products from './Products';
import Transactions from './Transactions';
import Dashboard from './Dashboard';
import Near from './Near';
import OrderModal from '../components/OrderModal';

export function Render() {
  const history = useHistory();
  return <h1>{history.location.pathname}</h1>;
}

const Routes = () => (
  <>
    <Switch>
      <Route component={NotFound} exact path="/not-found" />
      <Route path="/" exact component={Dashboard} />
      <Route path="/products" component={Products} />
      <Route path="/settings" component={Render} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/near" component={Near} />
      <Redirect to="/not-found" />
    </Switch>
    <OrderModal />
  </>
);

export default Routes;
