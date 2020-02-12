import React, { useContext } from 'react';
import I18n from '../../I18n';
import { Grid, Card, CardContent } from '@material-ui/core';
import LineChart from '../../components/LineChart';
import { addDays } from 'date-fns';
import { makeStyles } from '@material-ui/styles';
import BarChart from '../../components/BarChart';
// import BarChart from '../../components/BarChart';

const useStyles = makeStyles(() => ({
  card: {
    height: '350px',
    padding: 0,
    margin: 0
  },

  cardContent: {
    width: '97%',
    height: '87%',
    padding: 0,
    margin: 0
  }
}));

const r = Array(10)
  .fill('')
  .map((e, i) => ({
    x: addDays(Date.now(), i).getTime(),
    y: i
  }));

console.log(r);

type Props = {
  products: any[];
  offers: any[];
  transactions: any[];
};

function Analytics(props: Props) {
  const { products = [], offers = [], transactions = [] } = props;
  const classes = useStyles();

  const t = useContext(I18n);
  return (
    <>
      <Grid xs={12} md={6} item>
        <Card component="div" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <LineChart
              data={[
                {
                  label: 'line1',
                  points: r
                }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} md={6} item>
        <Card component="div" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <LineChart
              data={[
                {
                  label: 'line1',
                  points: r
                }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={6} item>
        <Card component="div" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <BarChart
              data={[
                { value: 1 },
                { value: 2 },
                { value: 3 },
                { value: 4 },
                { value: 5 },
                { value: 6 },
                { value: 7 },
                { value: 8 },
                { value: 9 },
                { value: 10 }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} md={6} item>
        {/* <LineChart
          title={t('int.revenue')}
          data={{
            labels: products.map((obj: any) => obj.name),
            datasets: [
              {
                label: 'Offers',
                data: [12, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
              },
              {
                label: 'products',
                data: [12, 19, 1, 2, 3, 4, 5, 6, 7],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 1
              }
            ]
          }}
        /> */}
      </Grid>
    </>
  );
}
export default Analytics;
