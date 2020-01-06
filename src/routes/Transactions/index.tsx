import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import AllTransactions from './AllTransactions';

function Transactions() {
  return (
    <Switch>
      <Route path="/transactions/:tab" exact component={AllTransactions} />;
      <Redirect to="/transactions/products" />;
    </Switch>
  );
}

export default Transactions;
