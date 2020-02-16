import React, { useContext, useMemo, useEffect, useState } from 'react';
import I18n from '../../I18n';
import { Grid, Card, CardContent } from '@material-ui/core';
import LineChart from '../../components/LineChart';
import { addDays } from 'date-fns';
import { makeStyles } from '@material-ui/styles';
import BarChart from '../../components/BarChart';
import PieChart from '../../components/PieChart';
import { AggregateData, TimeSeriesData } from '.';

const useStyles = makeStyles(() => ({
  card: {
    height: '350px',
    padding: 0,
    margin: 0
  },

  cardContent: {
    width: '97%',
    height: '100%',
    padding: 0,
    margin: 0
  }
}));

type Props = {
  aggregatedProducts: AggregateData;
  aggregatedOffers: AggregateData;
  timeSeriesProducts: TimeSeriesData;
  timeSeriesOffers: TimeSeriesData;
};

function Analytics(props: Props) {
  const classes = useStyles();

  const t = useContext(I18n);
  return (
    <>
      <Grid xs={12} md={12} lg={6} item>
        <Card component="div" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <LineChart
              data={[
                {
                  label: 'products',
                  points: props.timeSeriesProducts.map(obj => ({
                    x: new Date(obj.dateCreated).getTime(),
                    y: obj.total
                  }))
                }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={12} lg={6} item>
        <Card component="div" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <BarChart
              title={t('int.per-product')}
              data={props.aggregatedProducts.map(obj => ({
                label: obj.name,
                value: obj.purchased
              }))}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={12} lg={6} item>
        <Card component="div" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <LineChart
              data={[
                {
                  label: 'offers',
                  points: props.timeSeriesOffers.map(obj => ({
                    x: new Date(obj.dateCreated).getTime(),
                    y: obj.total
                  }))
                }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={12} lg={6} item>
        <Card component="div" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <PieChart
              title={t('int.per-offers')}
              data={props.aggregatedOffers.map(obj => ({
                label: obj.name,
                value: obj.purchased
              }))}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
export default Analytics;
