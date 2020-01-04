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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';
import { toast } from 'react-toastify';
import ImageRepresentation from '../../../components/ImageRepresentation';

function AllProducts() {
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
    getProducts(obj);
  }, []);

  const getProducts = useCallback(
    (obj: Record<string, any>) => {
      setLoading(true);
      const url = queryString.stringify(obj);
      api
        .get(`/api/bo/products?${url}`)
        .then(e => e.json())
        .then(infos => {
          setInfos(infos);
          setLoading(false);
        });
    },
    [history.location.search]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const params = queryString.parse(history.location.search);
      api.delete(`/api/bo/products/${id}`);
      toast.success(t('int.product-delete-successfully'));
      getProducts(params);
    },
    [history.location.search]
  );
  const filterConf = useMemo(
    () =>
      [
        {
          type: 'range',
          keyNameMin: 'minPrice',
          keyNameMax: 'maxPrice',
          labelMin: t('int.min-price'),
          labelMax: t('int.max-price'),
          label: t('int.min-max-price')
        },

        {
          type: 'range',
          keyNameMin: 'minPurchased',
          keyNameMax: 'maxPurchased',
          labelMin: t('int.min-purchased'),
          labelMax: t('int.max-purchased'),
          label: t('int.min-max-purchased')
        },

        {
          type: 'range',
          keyNameMin: 'minLpPrice',
          keyNameMax: 'maxLpPrice',
          labelMin: t('int.min-lp-price'),
          labelMax: t('int.max-lp-price'),
          label: t('int.min-max-lp-price')
        },

        {
          type: 'range',
          keyNameMin: 'minLpReward',
          keyNameMax: 'maxLpReward',
          labelMin: t('int.min-lp-reward'),
          labelMax: t('int.max-lp-reward'),
          label: t('int.min-max-lp-reward')
        }
      ] as FilterType[],
    [t]
  );

  const columns: Columns = [
    {
      title: t('int.name'),
      field: 'name'
    },
    {
      title: t('int.price'),
      render: obj => `${R.propOr('-', 'price', obj)} €`
    },
    {
      title: t('int.purchased'),
      render: obj => R.propOr('-', 'purchased', obj)
    },
    {
      title: t('int.lpPrice'),
      render: obj => R.propOr('-', 'lpPrice', obj)
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
        return <ImageRepresentation howMany={howMany} />;
      }
    },
    {
      title: t('int.actions'),
      render: (obj: any, idx: number) => (
        <>
          <IconButton
            onClick={() => history.push(`/products/${obj._id}/edit`)}
            title={t('int.view')}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => deleteProduct(obj._id)}
            title={t('int.delete')}>
            <DeleteIcon />
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
        <Typography variant="h4">{t('int.products')}</Typography>

        <Button component={Link} to="/products/new" variant="contained">
          {t('int.add-new')}
        </Button>
      </div>
      <br />
      <Filters onSubmit={getProducts} filterConf={filterConf} />
      <MaterialTable
        loading={loading}
        columns={columns}
        {...infos}
        onChange={getProducts}
      />
    </>
  );
}

export default AllProducts;
