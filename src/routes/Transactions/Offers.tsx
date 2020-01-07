import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import I18n from '../../I18n';
import Filters from '../../components/Filters';
import { FilterType } from '../../components/Filters/types';
import MaterialTable from '../../components/Table';
import { Typography, IconButton, Tabs, Tab } from '@material-ui/core';
import { Columns } from '../../components/Table/types';
import { useHistory, useParams } from 'react-router-dom';
import useApi from '../../Hooks';
import queryString from 'query-string';
import { formatDate } from '../../utils';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { red, green } from '@material-ui/core/colors';
import IconRepresentation from '../../components/IconRepresentation';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import * as R from 'ramda';

function Offers() {
  const t = useContext(I18n);
  const [infos, setInfos] = useState({
    data: Array(10).fill({}),
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
      const params = queryString.parse(history.location.search);
      setLoading(true);
      const url = queryString.stringify({
        ...params,
        ...obj
      });

      api
        .get(`/api/bo/transactions/offers?${url}`)
        .then(e => e.json())
        .then(infos => {
          setInfos(infos);
          setLoading(false);
        });
    },
    [history.location.search]
  );

  const filterConf = useMemo(
    () => [
      {
        type: 'select',
        keyName: 'sortBy',
        label: t('int.sortBy'),
        options: [
          {
            label: t('int.date-asc'),
            value: 'date:ASC'
          },
          {
            label: t('int.date-desc'),
            value: 'date:DESC'
          },

          { label: t('int.lpPrice-asc'), value: 'offerPrice:ASC' },
          { label: t('int.lpPrice-desc'), value: 'offerPrice:DESC' },

          { label: t('int.lpReward-asc'), value: 'offerReward:ASC' },
          { label: t('int.lpReward-desc'), value: 'offerReward:DESC' }
        ]
      },
      {
        label: t('int.date'),
        keyNameTo: 'to',
        keyNameFrom: 'from',
        type: 'date'
      }
    ],
    [t]
  ) as FilterType[];

  const columns: Columns = useMemo(
    () => [
      {
        title: t('int.name'),
        field: 'name'
      },
      {
        title: t('int.dateCreated'),
        render: obj => {
          const d = new Date(obj.dateCreated as Date);
          return formatDate(d.getTime());
        }
      },
      {
        title: t('int.description'),
        render: (obj, idx) => (
          <Typography
            style={{
              maxWidth: '250px'
            }}
            variant="body1">
            {obj.description}
          </Typography>
        )
      },

      {
        title: t('int.type'),
        render: obj => (
          <Typography
            variant={'button'}
            style={{
              color: obj.type === 'CREDIT' ? red[500] : green[500]
            }}>
            {obj.type}
          </Typography>
        )
      },

      {
        title: t('int.lp-price'),
        field: 'lpPrice'
      },
      {
        title: t('int.lp-reward'),
        field: 'lpReward'
      },
      {
        title: t('int.purchased'),
        render: obj => R.propOr('-', 'purchased', obj)
      },
      {
        title: t('int.discounts'),
        render: (obj: any, idx: number) => {
          const tmp: unknown[] = R.propOr([], 'discounts', obj);
          const howMany = tmp.length;
          return (
            <IconRepresentation howMany={howMany}>
              <LocalOfferIcon htmlColor={'#546e7a'} />
            </IconRepresentation>
          );
        }
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
    [t]
  );

  return (
    <>
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

export default Offers;
