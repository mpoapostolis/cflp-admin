import React, { useEffect, useState } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route, useHistory } from 'react-router';
import NotFound from './NotFound';
import Products from './Products';
import Orders from './Orders';
import Dashboard from './Dashboard';
import Near from './Near';
import OrderModal from '../components/OrderModal';
import { useAccount } from '../provider';
import { queryCache } from 'react-query';

export function Render() {
  const history = useHistory();
  return <h1>{history.location.pathname}</h1>;
}

const Routes = () => {
  const account = useAccount();

  // const getNotf = async () => {
  //   const res = await api.get('/api/orders?status=pending');
  //   const data = await res.json();
  //   setNotf(data.total);
  // };

  useEffect(() => {
    if (account.store_id) {
      const source = new EventSource(
        `http://localhost:4000/api/listen-orders/4746e2a6-c49b-41f5-be38-11792ba591c0?token=${account.token}`
      );
      source.onmessage = () => {
        queryCache.invalidateQueries('pending-notifications');
        queryCache.invalidateQueries('notifications');
      };
    }
  }, []);

  return (
    <>
      <Switch>
        <Route component={NotFound} exact path="/not-found" />
        <Route path="/" exact component={Dashboard} />
        <Route path="/products" component={Products} />
        <Route path="/settings" component={Render} />
        <Route path="/orders" component={Orders} />
        <Route path="/near" component={Near} />
        <Redirect to="/not-found" />
      </Switch>
    </>
  );
};

export default Routes;
