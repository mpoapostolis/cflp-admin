import React, { useContext, useState, useMemo } from 'react';
import I18n from '../../I18n';
import HeaderInfos from '../../components/HeaderInfos';
import Filters from '../../components/Filters';
import { FilterType } from '../../components/Filters/types';

function AllProducts() {
  const t = useContext(I18n);

  const filterConf = useMemo(
    () =>
      [
        {
          type: 'select',
          keyName: 'type',
          label: 'gamw ti panagia',
          options: [
            { label: 'All', value: 'ALL' },
            { label: 'adsasd', value: 1 },
            { label: 'adsasd1', value: 2 },
            { label: 'adsasd2', value: 3 },
            { label: 'adsasd3', value: 3 }
          ]
        },
        {
          keyNameFrom: 'dateFrom',
          keyNameTo: 'dateTo',
          type: 'date',
          asdasd: 32
        }
      ] as FilterType[],
    [t]
  );

  return (
    <>
      <Filters onSubmit={console.log} filterConf={filterConf} />
      <HeaderInfos filters={[]}></HeaderInfos>
    </>
  );
}

export default AllProducts;
