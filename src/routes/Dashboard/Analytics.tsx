import React, { useContext } from 'react';
import I18n from '../../I18n';
import { Grid, Card } from '@material-ui/core';
import LineChart from '../../components/LineChart';
// import BarChart from '../../components/BarChart';

type Props = {
  products: any[];
  offers: any[];
  transactions: any[];
};

function Analytics(props: Props) {
  const { products = [], offers = [], transactions = [] } = props;

  const t = useContext(I18n);
  return (
    <>
      <Grid xs={12} md={6} item>
        <Card>
          <LineChart
            data={[
              {
                label: 'line1',
                points: [
                  { x: 1, y: 3 },
                  { x: 1, y: 2 },
                  { x: 1, y: 3 },
                  { x: 1, y: 4 },
                  { x: 1, y: 5 }
                ]
              }
            ]}
          />
        </Card>
      </Grid>
      <Grid xs={12} md={6} item>
        <Card>
          <LineChart
            data={[
              {
                label: 'line1',
                points: [
                  { x: 1, y: 3 },
                  { x: 1, y: 2 },
                  { x: 1, y: 3 },
                  { x: 1, y: 4 },
                  { x: 1, y: 5 }
                ]
              }
            ]}
          />
        </Card>
      </Grid>
      <Grid xs={12} md={6} item>
        {/* <BarChart
          title={t('int.purchased-per-offer')}
          data={{
            labels: products.map((obj: any) => obj.name),
            datasets: [
              {
                data: products.map((obj: any) => obj.purchased)
              }
            ]
          }}
        /> */}
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
