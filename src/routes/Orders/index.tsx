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
import { IconButton, Button } from '@material-ui/core';
import { Columns } from '../../components/Table/types';
import { useHistory, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { EUROSIGN, formatDate } from '../../utils';
import VisibilityIcon from '@material-ui/icons/Visibility';

import * as R from 'ramda';
import api from '../../ky';
import { useQuery, usePaginatedQuery } from 'react-query';
import { getNotification } from '../../api/notification';
import StatusRect from '../../components/StatusRect';
import OrderModal from '../../components/OrderModal';

function Products() {
  const t = useContext(I18n);

  const history = useHistory();
  const param = useParams<{ tab: 'product' | 'offer' }>();
  const [order, setOrder] = useState<any[]>();

  const handleClickOpen = (data: any[]) => {
    setOrder(data);
  };

  const handleClose = () => {
    setOrder(undefined);
  };

  const {
    resolvedData: notifications = {
      data: [],
      total: 0
    }
  } = usePaginatedQuery(['notifications', {}], getNotification);

  const getOrder = async (id: string) => {
    const { data } = await api.get(`/api/orders/${id}`).json();
    setOrder(data);
  };

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
        field: 'user_name'
      },
      {
        title: t('int.dateCreated'),
        render: (obj) => {
          const d = new Date(obj.date_created as Date);
          console.log(obj.date_created);
          return formatDate(d.getTime());
        }
      },

      {
        title: t('int.status'),
        render: (obj) => <StatusRect>{obj.status}</StatusRect>
      },

      {
        title: t('int.actions'),
        render: (obj) => {
          return (
            <IconButton
              size={'small'}
              onClick={() => getOrder(obj.order_id)}
              title={t('int.view')}>
              <VisibilityIcon />
            </IconButton>
          );
        }
      }
    ],
    [t]
  );

  const tableInfos = {
    offset: 0,
    total: notifications.total,
    limit: 100,
    data: notifications.data
  };

  return (
    <>
      <Filters onSubmit={console.log} filterConf={filterConf} />
      <MaterialTable
        hideSearch
        columns={columns}
        onChange={console.log}
        {...tableInfos}
      />
      <OrderModal
        order={order}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </>
  );
}

export default Products;
