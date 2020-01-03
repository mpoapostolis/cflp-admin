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
import ImageIcon from '@material-ui/icons/Image';
import queryString from 'query-string';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';

function AllProducts() {
  const t = useContext(I18n);
  const [infos, setInfos] = useState({
    data: [],
    offset: 0,
    total: 20,
    limit: 100
  });
  const history = useHistory();
  const api = useApi();

  const getProducts = useCallback((obj: Record<string, any>) => {
    const url = queryString.stringify(obj);
    api
      .get(`/api/bo/products?${url}`)
      .then(e => e.json())
      .then(infos => setInfos(infos));
  }, []);

  const filterConf = useMemo(
    () =>
      [
        {
          type: 'number',
          keyName: 'minLp',
          label: t('int.min-lp')
        },

        {
          type: 'number',
          keyName: 'maxPrice',
          label: t('int.max-lp')
        },
        {
          type: 'number',
          keyName: 'minPrice',
          label: t('int.min-price')
        },

        {
          type: 'number',
          keyName: 'maxPrice',
          label: t('int.max-price')
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
      title: t('int.lpReward'),
      field: 'lpReward'
    },
    {
      title: t('int.price'),
      field: 'price'
    },
    {
      title: t('int.images'),
      render: (obj: any, idx: number) => {
        const tmp: unknown[] = R.propOr([], 'images', obj);
        const howMany = tmp.length;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {howMany > 0 && (
              <>
                <IconButton>
                  <ImageIcon key={idx} />
                </IconButton>
                <Typography variant="body2">x {howMany}</Typography>
              </>
            )}
          </div>
        );
      }
    },
    {
      title: t('int.actions'),
      render: (obj: any, idx: number) => {
        const { lpReward, name, price, _id } = obj;
        const url = queryString.stringify({ lpReward, name, price });
        return (
          <>
            <IconButton
              onClick={() => history.push(`/products/${_id}/edit?${url}`)}
              title={t('int.view')}
              size="small">
              <EditIcon />
            </IconButton>
            <IconButton title={t('int.delete')} size="small">
              <DeleteIcon />
            </IconButton>
          </>
        );
      }
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
      <MaterialTable columns={columns} {...infos} onChange={getProducts} />
    </>
  );
}

export default AllProducts;
