import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route, useHistory } from 'react-router';
import NotFound from './NotFound';
import Products from './Products';
import Offers from './Offers';

export function Render() {
  const history = useHistory();
  return <h1>{history.location.pathname}</h1>;
}

const Routes = () => {
  return (
    <Switch>
      <Route component={NotFound} exact path="/not-found" />
      <Route path="/" exact component={Render} />
      <Route path="/products" component={Products} />
      <Route path="/offers" component={Offers} />
      <Route path="/settings" component={Render} />
      <Route path="/transactions" component={Render} />
      <Route path="/employees" component={Render} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
