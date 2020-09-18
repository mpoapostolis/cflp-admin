import React, { useContext, useMemo } from 'react';
import I18n from '../../../I18n';
import Filters from '../../../components/Filters';
import { FilterType } from '../../../components/Filters/types';
import MaterialTable from '../../../components/Table';
import { Button, Typography, IconButton } from '@material-ui/core';
import { Columns } from '../../../components/Table/types';
import { Link, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';
import { toast } from 'react-toastify';
import IconRepresentation from '../../../components/IconRepresentation';
import ImageIcon from '@material-ui/icons/Image';
import { css } from 'emotion';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { usePaginatedQuery, useMutation, queryCache } from 'react-query';
import { getProducts, deleteProduct } from '../../../api/products';

const marginRight = css`
  margin-right: 15px !important;
`;

function AllProducts() {
  const t = useContext(I18n);

  const history = useHistory();

  const params = queryString.parse(history.location.search);
  const onChange = (obj: Record<string, string>) => {
    history.push({ search: queryString.stringify({ ...params, ...obj }) });
  };

  const { resolvedData: products, isFetching } = usePaginatedQuery(
    ['get-products', params],
    getProducts
  );
  const [_deleteProduct] = useMutation(deleteProduct, {
    onSuccess: () => {
      queryCache.invalidateQueries('get-products');
      toast.success(t('int.product-delete-successfully'));
    }
  });

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
            { label: t('int.price-desc'), value: 'price:DESC' }
          ]
        }
      ] as FilterType[],
    [t]
  );

  const columns: Columns = [
    {
      title: t('int.name'),
      field: 'product_name'
    },
    {
      title: t('int.price'),
      render: (obj) => `${R.propOr('-', 'price', obj)} €`
    },

    {
      title: t('int.tags'),
      render: (obj: any) => {
        const tmp: unknown[] = R.propOr([], 'tags', obj);
        const howMany = tmp.length;
        return (
          <IconRepresentation howMany={howMany}>
            <LocalOfferIcon htmlColor={'#546e7a'} />
          </IconRepresentation>
        );
      }
    },

    {
      title: t('int.images'),
      render: (obj: any) => {
        return (
          <IconRepresentation howMany={obj?.images ? 1 : 0}>
            <ImageIcon htmlColor={'#546e7a'} />
          </IconRepresentation>
        );
      }
    },
    {
      title: t('int.actions'),
      render: (obj: any) => (
        <>
          <IconButton
            classes={{ root: marginRight }}
            size={'small'}
            onClick={() => history.push(`/products/${obj.id}/edit`)}
            title={t('int.edit')}>
            <EditIcon />
          </IconButton>
          <IconButton
            classes={{ root: marginRight }}
            size={'small'}
            onClick={() => _deleteProduct(obj.id)}
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
      <Filters onSubmit={onChange} filterConf={filterConf} />
      <MaterialTable
        loading={isFetching}
        columns={columns}
        total={products?.total ?? 5000}
        data={products?.data ?? []}
        offset={Number(params?.offset ?? 0)}
        limit={Number(params?.limit ?? 10)}
        onChange={() => void 0}
      />
    </>
  );
}

export default AllProducts;
