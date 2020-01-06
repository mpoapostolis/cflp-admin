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
import { Button, Typography, IconButton } from '@material-ui/core';
import { Columns } from '../../../components/Table/types';
import { Link, useHistory } from 'react-router-dom';
import useApi from '../../../Hooks';
import queryString from 'query-string';
import * as R from 'ramda';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { css } from 'emotion';

const marginRight = css`
  margin-right: 15px !important;
`;

function AllTransactions() {
  const t = useContext(I18n);
  const [infos, setInfos] = useState({
    data: [],
    offset: 0,
    total: 20,
    limit: 100
  });
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const api = useApi();

  useEffect(() => {
    const search = history.location.search;
    const obj = queryString.parse(search);
    getTransactions(obj);
  }, []);

  const getTransactions = useCallback(
    (obj: Record<string, any>) => {
      setLoading(true);
      const url = queryString.stringify(obj);
      api
        .get(`/api/bo/transactions?${url}`)
        .then(e => e.json())
        .then(infos => {
          setInfos(infos);
          setLoading(false);
        });
    },
    [history.location.search]
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

  const columns: Columns = [
    {
      title: t('int.actions'),
      render: (obj: any, idx: number) => (
        <>
          <IconButton
            classes={{ root: marginRight }}
            size={'small'}
            onClick={() => history.push(`/transactions/${obj._id}`)}
            title={t('int.view')}>
            <VisibilityIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{t('int.transactions')}</Typography>

        <Button component={Link} to="/transactions/new" variant="contained">
          as{' '}
        </Button>
      </div>
      <br />
      <Filters onSubmit={getTransactions} filterConf={filterConf} />
      <MaterialTable
        loading={loading}
        columns={columns}
        {...infos}
        onChange={getTransactions}
      />
    </>
  );
}

export default AllTransactions;
