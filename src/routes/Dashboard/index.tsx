import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { subDays } from 'date-fns';
import Overview from './Overview';
import Analytics from './Analytics';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

import { useQuery } from 'react-query';
import { getGeoLog } from '../../api/geolog';
import { getDebitCredits } from '../../api/stores';

export type AggregateData = {
  name: string;
  purchased: number;
}[];

export type TimeSeriesData = {
  dateCreated: Date;
  total: number;
}[];

function Dashboard() {
  const history = useHistory();
  const urlParams = queryString.parse(history.location.search);

  const { data: debitsCredis = { debits: 0, credits: 0 } } = useQuery(
    'debits-credits',
    getDebitCredits,
    {
      onSuccess: console.log
    }
  );

  const { data } = useQuery(['geolog-near-me', urlParams], getGeoLog, {
    refetchInterval: 5000
  });

  return (
    <>
      <Grid spacing={3} container>
        <Overview
          live={data?.countNearMe}
          offersPurchased={0}
          {...debitsCredis}
          productsPurchased={0}
        />
        <Analytics />
      </Grid>
    </>
  );
}

export default Dashboard;
