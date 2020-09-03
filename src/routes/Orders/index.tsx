import React, { useContext, useMemo, useState } from 'react';
import I18n from '../../I18n';
import Filters from '../../components/Filters';
import { FilterType } from '../../components/Filters/types';
import MaterialTable from '../../components/Table';
import { IconButton } from '@material-ui/core';
import { Columns } from '../../components/Table/types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import api from '../../ky';
import { usePaginatedQuery } from 'react-query';
import { getNotification } from '../../api/notification';
import StatusRect from '../../components/StatusRect';
import OrderModal from '../../components/OrderModal';
import { format, parseISO } from 'date-fns';

function Products() {
  const t = useContext(I18n);

  const [order, setOrder] = useState<any[]>();
  const [orderName, setOrderName] = useState<string>();
  const [orderId, setOrderId] = useState<string>();
  const [status, setStatus] = useState<string>();

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
          const d = parseISO(obj.date_created);
          return format(d, 'd MMM yyy, HH:mm');
        }
      },

      {
        title: t('int.status'),
        render: (obj) => <StatusRect>{obj.status}</StatusRect>
      },

      {
        title: t('int.paid-with'),
        render: (obj) => (
          <div>
            {obj.paid_with === 'cash' ? (
              <span
                style={{ width: '16px', marginRight: '10px' }}
                role="img"
                aria-label="money">
                💵 &nbsp; μετρητά
              </span>
            ) : (
              <div style={{ display: 'flex' }}>
                <img
                  src="/images/loyalty.svg"
                  alt="loyalty"
                  style={{ width: '16px', marginRight: '10px' }}
                />
                &nbsp;
                <span>slourps</span>
              </div>
            )}
          </div>
        )
      },

      {
        title: t('int.actions'),
        render: (obj) => {
          return (
            <IconButton
              size={'small'}
              onClick={() => {
                setOrderId(obj.order_id);
                setStatus(obj.status);
                setOrderName(obj.user_name);
                getOrder(obj.order_id);
              }}
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
        status={status}
        order={order}
        orderId={orderId}
        orderName={orderName}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </>
  );
}

export default Products;
