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
import { Typography, IconButton } from '@material-ui/core';
import { Columns } from '../../components/Table/types';
import { useHistory, useParams } from 'react-router-dom';
import useApi from '../../Hooks';
import queryString from 'query-string';
import { EUROSIGN, formatDate } from '../../utils';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconRepresentation from '../../components/IconRepresentation';
import ImageIcon from '@material-ui/icons/Image';
import * as R from 'ramda';

function Products() {
  const t = useContext(I18n);
  const [infos, setInfos] = useState({
    data: Array(10).fill({}),
    offset: 0,
    total: 20,
    limit: 100
  });
  const history = useHistory();
  const param = useParams<{ tab: 'product' | 'offer' }>();
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
        .get(`/api/bo/transactions/products?${url}`)
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

          {
            label: t('int.product-price-asc'),
            value: 'productPrice:ASC'
          },
          {
            label: t('int.product-price-desc'),
            value: 'productPrice:DESC'
          },

          { label: t('int.lp-reward-asc'), value: 'productReward:ASC' },
          { label: t('int.lp-reward-desc'), value: 'productReward:DESC' }
        ]
      },
      {
        label: t('int.date'),
        keyNameTo: 'from',
        keyNameFrom: 'to',
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
        title: t('int.price'),
        render: obj => `${R.propOr('-', 'price', obj)} ${EUROSIGN}`
      },
      {
        title: t('int.purchased'),
        render: obj => R.propOr('-', 'purchased', obj)
      },

      {
        title: t('int.lpReward'),
        field: 'lpReward'
      },
      {
        title: t('int.images'),
        render: (obj: any, idx: number) => {
          const tmp: unknown[] = R.propOr([], 'images', obj);
          const howMany = tmp.length;
          return (
            <IconRepresentation howMany={howMany}>
              <ImageIcon htmlColor={'#546e7a'} />
            </IconRepresentation>
          );
        }
      },

      {
        title: t('int.actions'),
        render: obj => (
          <IconButton
            size={'small'}
            onClick={() => history.push(`/products/${obj._id}`)}
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

export default Products;
