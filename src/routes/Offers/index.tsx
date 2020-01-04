import React from 'react';
import { Switch, Route } from 'react-router';
import AllOffers from './AllOffers';
import NewOffer from './NewOffer';

function Offers() {
  return (
    <>
      <Switch>
        <Route path="/offers" exact component={AllOffers} />
        <Route path="/offers/new" exact component={NewOffer} />
        <Route path="/offers/:id/edit" exact component={NewOffer} />
      </Switch>
    </>
  );
}

export default Offers;
