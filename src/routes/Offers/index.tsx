import React from 'react';
import { Switch, Route } from 'react-router';
import AllOffers from './AllOffers';
import NewOffer from './NewOffer';
import ViewOffer from './ViewOffer';

function Offers() {
  return (
    <Switch>
      <Route path="/offers" exact component={AllOffers} />
      <Route path="/offers/new" exact component={NewOffer} />
      <Route path="/offers/:id" exact component={ViewOffer} />
      <Route path="/offers/:id/edit" exact component={NewOffer} />
    </Switch>
  );
}

export default Offers;
