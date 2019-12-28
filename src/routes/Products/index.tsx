import React from 'react';
import { Switch, Route } from 'react-router';
import { Render } from '../';
import AllProducts from './AllProducts';

function Reports() {
  return (
    <Switch>
      <Route path="/products" component={AllProducts} />
      <Route path="/products/create" component={Render} />
      <Route path="/products/:id" component={Render} />
      <Route path="/products/:id/edit" component={Render} />
    </Switch>
  );
}

export default Reports;
