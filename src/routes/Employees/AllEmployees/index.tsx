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

function Allusers() {
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
        .get(`/api/bo/users?${url}`)
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
      api.delete(`/api/bo/users/${id}`);
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
            { label: t('int.age-asc'), value: 'age:ASC' },
            { label: t('int.age-desc'), value: 'age:DESC' }
          ]
        }
      ] as FilterType[],
    [t]
  );

  const columns: Columns = [
    {
      title: t('int.username'),
      field: 'lastName'
    },
    {
      title: t('int.first-name'),
      field: 'firstName'
    },
    {
      title: t('int.last-name'),
      field: 'lastName'
    },
    {
      title: t('int.age'),
      field: 'age'
    },

    {
      title: t('int.email'),
      field: 'email'
    }

    // {
    //   title: t('int.actions'),
    //   render: (obj: any, idx: number) => (
    //     <>
    //       <IconButton
    //         classes={{ root: marginRight }}
    //         size={'small'}
    //         onClick={() => history.push(`/users/${obj._id}`)}
    //         title={t('int.view')}>
    //         <VisibilityIcon />
    //       </IconButton>
    //     </>
    //   )
    // }
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{t('int.users')}</Typography>
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

export default Allusers;
