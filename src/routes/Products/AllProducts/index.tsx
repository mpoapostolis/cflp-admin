import React, { useContext, useMemo } from 'react';
import I18n from '../../../I18n';
import Filters from '../../../components/Filters';
import { FilterType } from '../../../components/Filters/types';
import MaterialTable from '../../../components/Table';
import { Button, Typography } from '@material-ui/core';
import { Columns } from '../../../components/Table/types';
import { rows } from './dummy';
import { Link } from 'react-router-dom';

function AllProducts() {
  const t = useContext(I18n);

  const filterConf = useMemo(
    () =>
      [
        {
          type: 'select',
          keyName: 'type',
          label: t('int.product-type'),
          options: []
        },
        {
          label: t('int.date'),
          keyNameFrom: 'dateFrom',
          keyNameTo: 'dateTo',
          type: 'date'
        }
      ] as FilterType[],
    [t]
  );

  const columns: Columns = [
    {
      title: 'name',
      field: 'name'
    },
    {
      title: 'code',
      field: 'code'
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
      <Filters onSubmit={console.log} filterConf={filterConf} />
      <MaterialTable
        columns={columns}
        data={rows}
        offset={0}
        total={200}
        limit={20}
        onChange={console.log}
      />
    </>
  );
}

export default AllProducts;
