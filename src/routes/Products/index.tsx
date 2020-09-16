import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router';
import AllProducts from './AllProducts';
import NewProduct from './NewProduct';

function Products() {
  return (
    <Switch>
      <Route path="/products" exact component={AllProducts} />
      <Route path="/products/new" exact component={NewProduct} />
      <Route path="/products/:id/edit" exact component={NewProduct} />
    </Switch>
  );
}

export default Products;
