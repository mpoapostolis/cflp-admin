import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route, useHistory } from 'react-router';
import NotFound from './NotFound';
import Products from './Products';

export function Render() {
  const history = useHistory();
  return <h1>{history.location.pathname}</h1>;
}

const Routes = () => {
  return (
    <Switch>
      <Route component={NotFound} exact path="/not-found" />
      <Route path="/" exact component={Render} />
      <Route path="/products" exact component={Products} />
      <Route path="/offers" exact component={Render} />
      <Route path="/settings" exact component={Render} />
      <Route path="/transactions" exact component={Render} />
      <Route path="/employees" exact component={Render} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
