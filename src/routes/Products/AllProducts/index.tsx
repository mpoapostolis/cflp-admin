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
import IconRepresentation from '../../../components/IconRepresentation';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ImageIcon from '@material-ui/icons/Image';
import { css } from 'emotion';

const marginRight = css`
  margin-right: 15px !important;
`;

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
      const params = queryString.parse(history.location.search);
      setLoading(true);
      const url = queryString.stringify({ ...params, ...obj });
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
        return (
          <IconRepresentation howMany={howMany}>
            <ImageIcon htmlColor={'#546e7a'} />
          </IconRepresentation>
        );
      }
    },
    {
      title: t('int.actions'),
      render: (obj: any, idx: number) => (
        <>
          <IconButton
            classes={{ root: marginRight }}
            size={'small'}
            onClick={() => history.push(`/products/${obj._id}`)}
            title={t('int.view')}>
            <VisibilityIcon />
          </IconButton>

          <IconButton
            classes={{ root: marginRight }}
            size={'small'}
            onClick={() => history.push(`/products/${obj._id}/edit`)}
            title={t('int.edit')}>
            <EditIcon />
          </IconButton>
          <IconButton
            classes={{ root: marginRight }}
            size={'small'}
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
