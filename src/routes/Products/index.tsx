import React from 'react';
import { Switch, Route } from 'react-router';
import AllProducts from './AllProducts';
import NewProduct from './NewProduct';
import ViewProduct from './ViewProduct';

function Reports() {
  return (
    <Switch>
      <Route path="/products" exact component={AllProducts} />
      <Route path="/products/new" exact component={NewProduct} />
      <Route path="/products/:id" exact component={ViewProduct} />
      <Route path="/products/:id/edit" exact component={NewProduct} />
    </Switch>
  );
}

export default Reports;
