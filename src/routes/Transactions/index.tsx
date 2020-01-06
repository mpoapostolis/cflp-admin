import React from 'react';
import { Switch, Route } from 'react-router';
import AllTransactions from './AllTransactions';

function Transactions() {
  return (
    <Switch>
      <Route path="/transactions" exact component={AllTransactions} />
    </Switch>
  );
}

export default Transactions;
