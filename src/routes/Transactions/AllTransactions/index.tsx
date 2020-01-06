import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import I18n from '../../../I18n';
import Filters from '../../../components/Filters';
import { FilterType } from '../../../components/Filters/types';
import MaterialTable from '../../../components/Table';
import { Button, Typography, IconButton, Tabs, Tab } from '@material-ui/core';
import { Columns } from '../../../components/Table/types';
import { Link, useHistory, useParams } from 'react-router-dom';
import useApi from '../../../Hooks';
import queryString from 'query-string';
import { EUROSIGN } from '../../../utils';
import * as R from 'ramda';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { css } from 'emotion';

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function AllTransactions() {
  const t = useContext(I18n);
  const [infos, setInfos] = useState({
    data: [],
    offset: 0,
    total: 20,
    limit: 100
  });
  const history = useHistory();
  const param = useParams<{ tab: 'product' | 'offer' }>();
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const [tab, setTab] = React.useState(param.tab === 'products' ? 0 : 1);

  useEffect(() => {
    const search = history.location.search;
    const obj = queryString.parse(search);
    const type = tab === 0 ? 'products' : 'offers';
    getTransactions({ ...obj, type });
  }, [tab, history.location.search]);

  const getTransactions = useCallback(
    (obj: Record<string, any>) => {
      const params = queryString.parse(history.location.search);
      setLoading(true);
      const url = queryString.stringify({
        ...params,
        ...obj,
        type: param.tab
      });

      api
        .get(`/api/bo/transactions?${url}`)
        .then(e => e.json())
        .then(infos => {
          setInfos(infos);
          setLoading(false);
        });
    },
    [history.location.search, tab]
  );

  const filterConf = useMemo(
    () =>
      [
        {
          type: 'select',
          keyName: 'sortBy',
          label: t('int.sortBy'),
          options: [
            { label: t('int.date-asc'), value: 'date:ASC' },
            { label: t('int.date-desc'), value: 'date:DESC' },

            { label: t('int.price-asc'), value: 'price:ASC' },
            { label: t('int.price-desc'), value: 'price:DESC' },

            { label: t('int.purchased-asc'), value: 'purchased:ASC' },
            { label: t('int.purchased-desc'), value: 'purchased:DESC' },

            { label: t('int.lpPrice-asc'), value: 'lpPrice:ASC' },
            { label: t('int.lpPrice-desc'), value: 'lpPrice:DESC' },

            { label: t('int.lpReward-asc'), value: 'lpReward:ASC' },
            { label: t('int.lpReward-desc'), value: 'lpReward:DESC' }
          ]
        }
      ] as FilterType[],
    [t]
  );

  const columns: Columns = useMemo(
    () =>
      tab === 0
        ? [
            {
              title: t('int.product-name'),
              field: 'productName'
            },
            {
              title: t('int.product-price'),
              render: obj => (
                <Typography>
                  {obj.productPrice}
                  {EUROSIGN}
                </Typography>
              )
            },

            {
              title: t('int.username'),
              field: 'userName'
            },
            {
              title: t('int.actions'),
              render: obj => (
                <IconButton
                  size={'small'}
                  onClick={() => history.push(`/products/${obj.productId}`)}
                  title={t('int.view')}>
                  <VisibilityIcon />
                </IconButton>
              )
            }
          ]
        : [
            {
              title: t('int.offer-name'),
              field: 'offerName'
            },
            {
              title: t('int.username'),
              field: 'userName'
            },
            {
              title: t('int.actions'),
              render: obj => (
                <IconButton
                  size={'small'}
                  onClick={() => history.push(`/offers/${obj.offerId}`)}
                  title={t('int.view')}>
                  <VisibilityIcon />
                </IconButton>
              )
            }
          ],
    [t, tab]
  );

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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
      <Filters onSubmit={getTransactions} filterConf={filterConf} />
      <MaterialTable
        key={tab}
        loading={loading}
        columns={columns}
        {...infos}
        onChange={getTransactions}
      />
    </>
  );
}

export default AllTransactions;
