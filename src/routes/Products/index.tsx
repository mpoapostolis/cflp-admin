import React from 'react';
import { Switch, Route, useHistory } from 'react-router';
import { Render } from '../';
import AllProducts from './AllProducts';
import NewProduct from './NewProduct';

function Reports() {
  const history = useHistory();
  return (
    <Switch>
      <Route path="/products" exact component={AllProducts} />
      <Route path="/products/new" exact component={NewProduct} />
      <Route path="/products/:id/edit" exact component={NewProduct} />
    </Switch>
  );
}

export default Reports;
