import React, { useContext } from 'react';
import I18n from '../../I18n';
import { Tabs, Tab } from '@material-ui/core';
import {
  useHistory,
  useParams,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Products from './Products';
import Offers from './Offers';

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function AllTransactions() {
  const t = useContext(I18n);

  const history = useHistory();
  const param = useParams<{ tab: 'product' | 'offer' }>();

  const [tab, setTab] = React.useState(param.tab === 'offers' ? 1 : 0);

  const handleChange = (_: any, newValue: number) => {
    const tab = newValue === 0 ? 'products' : 'offers';

    history.push(`/transactions/${tab}?limit=10&offset=0`);
    setTab(newValue);
  };

  return (
    <>
      <Tabs
        value={tab}
        onChange={handleChange}
        aria-label="simple tabs example">
        <Tab label={t('int.products')} {...a11yProps(0)} />
        <Tab label={t('int.offers')} {...a11yProps(1)} />
      </Tabs>
      <Switch>
        <Route path="/transactions/products" component={Products}></Route>
        <Route path="/transactions/offers" component={Offers}></Route>
        <Redirect to="/transactions/products" />
      </Switch>
    </>
  );
}

export default AllTransactions;
