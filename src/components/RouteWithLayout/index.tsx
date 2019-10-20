import React from 'react';
import { Route } from 'react-router-dom';

type Props = {
  component: any;
  layout: any;
  path: string;
  exact?: boolean;
};
const RouteWithLayout = (props: Props) => {
  const { layout: Layout, component: Component } = props;

  return (
    <Route
      exact={props.exact}
      render={() => (
        <Layout>
          <Component />
        </Layout>
      )}
    />
  );
};

export default RouteWithLayout;
