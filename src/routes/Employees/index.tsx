import React from 'react';
import { Switch, Route } from 'react-router';
import AllEmployees from './AllEmployees';
import NewEmployees from './NewEmployees';
import ViewEmployees from './ViewEmployees';

function Reports() {
  return (
    <Switch>
      <Route path="/employees" exact component={AllEmployees} />
      <Route path="/employees/new" exact component={NewEmployees} />
      <Route path="/employees/:id" exact component={ViewEmployees} />
      <Route path="/employees/:id/edit" exact component={NewEmployees} />
    </Switch>
  );
}

export default Reports;
