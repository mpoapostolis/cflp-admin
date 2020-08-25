import React, { useContext, useState, useEffect, useMemo } from 'react';
import I18n from '../../I18n';
import {
  Button,
  Grid,
  Card,
  CardContent,
  makeStyles,
  CardHeader,
  Paper
} from '@material-ui/core';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import PieChart from '../../components/PieChart';
import BarChart from '../../components/BarChart';
import { SECOND } from '../../utils';
import * as R from 'ramda';
import RadarChart from '../../components/RadarChart';
import api from '../../ky';
import { useQuery } from 'react-query';
import { getGeoLogInfos } from '../../api/geolog';
import { useAccount } from '../../provider';
import { toast } from 'react-toastify';
import {
  G2,
  Chart,
  Tooltip,
  Interval,
  Legend,
  Point,
  Line,
  Area,
  Axis,
  Coordinate,
  Interaction
} from 'bizcharts';

import DataSet from '@antv/data-set';
import { getTagsAnalytics } from '../../api/tags';

const data1 = [
  { item: 'Design', c: 1, d: 3, aa: 3, a: 70, b: 30 },
  { item: 'Development', c: 1, d: 3, aa: 3, a: 60, b: 70 },
  { item: 'Marketing', c: 1, d: 3, aa: 3, a: 50, b: 60 },
  { item: 'Users', c: 1, d: 3, aa: 3, a: 40, b: 50 },
  { item: 'Test', c: 1, d: 3, aa: 3, a: 60, b: 70 },
  { item: 'Language', c: 1, d: 3, aa: 3, a: 70, b: 50 },
  { item: 'Technology', c: 1, d: 3, aa: 3, a: 50, b: 40 },
  { item: 'Support', c: 1, d: 3, aa: 3, a: 30, b: 40 },
  { item: 'Sales', c: 1, d: 3, aa: 3, a: 60, b: 40 },
  { item: 'UX', c: 1, d: 3, aa: 3, a: 50, b: 60 }
];

const cols = {
  percent: {
    formatter: (val: any) => `${val * 100}%`
  }
};

const useStyles = makeStyles(() => ({
  filters: {
    display: 'flex',
    justifyContent: ' flex-end'
  },
  card: {
    height: '350px',
    padding: 25,
    margin: 0
  },

  radar: {
    height: '450px',
    padding: 0,
    margin: 0
  },

  cardContentRadar: {
    width: '97%',
    height: '90%',
    padding: 0,
    margin: 0
  },
  cardContent: {
    width: '95%',
    height: '95%',
    padding: '20px',
    margin: 0
  }
}));

function Near() {
  const classes = useStyles();
  const [ageGroupState, setAgeGroupState] = useState([]);
  const [percentageData, setPercentageData] = useState<any>([]);
  const [coords, setCoords] = useState<
    | {
        latitude: number;
        longitude: number;
      }
    | undefined
  >(undefined);
  const t = useContext(I18n);

  const { data: tags } = useQuery('tags', getTagsAnalytics);
  console.log(tags);

  const { data: ageGroup = { data: [] } } = useQuery(
    ['geolog', { ...coords }],
    getGeoLogInfos,
    {
      refetchInterval: 5000,
      enabled: Boolean(coords)
    }
  );
  useEffect(() => {
    if (ageGroup.data.length < 1) return;
    const tmp = ageGroup.data.map((obj: any) => ({
      total: +obj.total ?? 0,
      gender: obj.age_group.match('female') ? 'female' : 'male',
      age_group: obj.age_group.replace(/female_|male_/g, '')
    }));

    const male = tmp.reduce(
      (acc: number, curr: any) =>
        acc + (curr.gender === 'male' ? curr.total : 0),
      0
    );
    const female = tmp.reduce(
      (acc: number, curr: any) =>
        acc + (curr.gender === 'female' ? curr.total : 0),
      0
    );

    const malePercentage = +(male / (female + male)).toFixed(2);
    const femalePercentage = +(1 - malePercentage).toFixed(2);
    setAgeGroupState(tmp);
    setPercentageData([
      {
        gender: 'male',
        total: male,
        percent: malePercentage || 0.5
      },
      { gender: 'female', total: female, percent: femalePercentage || 0.5 }
    ]);
  }, [ageGroup]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => toast.error(err.message)
    );
  }, []);

  const { DataView } = DataSet;
  const dv = new DataView().source(data1);
  dv.transform({
    type: 'fold',
    fields: ['a', 'b', 'c', 'aa'], // 展开字段集
    key: 'user', // key字段
    value: 'score' // value字段
  });

  const newData = dv.rows;
  const axisConfig = {
    label: {
      offset: 25
    },
    tickLine: {
      length: 20
    }
  };

  return (
    <>
      <Grid spacing={3} container>
        <Grid xs={12} md={12} lg={8} item>
          <Paper component="div" className={classes.card}>
            <Chart padding="auto" data={ageGroupState} autoFit>
              <Interval
                adjust={[
                  {
                    type: 'dodge',
                    marginRatio: 0
                  }
                ]}
                color="gender"
                position="age_group*total"
              />
              <Tooltip shared />
              <Legend layout="vertical" position="top-left" />
            </Chart>
          </Paper>
        </Grid>

        <Grid xs={12} md={12} lg={4} item>
          <Paper component="div" className={classes.card}>
            <Chart data={percentageData} scale={cols} autoFit>
              <Coordinate type="theta" radius={1} />
              <Tooltip showTitle={false} />
              <Axis visible={false} />
              <Interval
                position="percent"
                adjust="stack"
                color="gender"
                style={{
                  lineWidth: 1,
                  stroke: '#fff'
                }}
                label={[
                  'total',
                  {
                    content: (data) => {
                      return `${data.total}`;
                    }
                  }
                ]}
              />
              <Interaction type="element-single-selected" />
            </Chart>
          </Paper>
        </Grid>
        <Grid xs={12} md={12} lg={4} item>
          <Paper component="div" className={classes.card}>
            <Chart
              data={newData}
              autoFit
              scale={{
                score: {
                  min: 0,
                  max: 90
                }
              }}
              interactions={['legend-highlight']}>
              <Coordinate type="polar" radius={0.8} />
              <Point position="item*score" color="user" shape="circle" />
              <Line position="item*score" color="user" size="2" />
              <Area position="item*score" color="user" />
              <Axis name="item" {...axisConfig} />
            </Chart>
          </Paper>
        </Grid>

        <Grid xs={12} md={12} lg={4} item>
          <Paper component="div" className={classes.card}>
            <Chart
              data={newData}
              autoFit
              scale={{
                score: {
                  min: 0,
                  max: 90
                }
              }}
              interactions={['legend-highlight']}>
              <Coordinate type="polar" radius={0.8} />
              <Point position="item*score" color="user" shape="circle" />
              <Line position="item*score" color="user" size="2" />
              <Area position="item*score" color="user" />
              <Axis name="item" {...axisConfig} />
            </Chart>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default Near;
