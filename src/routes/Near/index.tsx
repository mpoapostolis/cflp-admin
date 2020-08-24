import React, { useContext, useState, useEffect, useMemo } from 'react';
import I18n from '../../I18n';
import {
  Button,
  Grid,
  Card,
  CardContent,
  makeStyles,
  CardHeader
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
  Coordinate
} from 'bizcharts';

import DataSet from '@antv/data-set';

const data = [
  { name: 'London', 月份: 'Jan.', 月均降雨量: 18.9 },
  { name: 'London', 月份: 'Feb.', 月均降雨量: 28.8 },
  { name: 'London', 月份: 'Mar.', 月均降雨量: 39.3 },
  { name: 'London', 月份: 'Apr.', 月均降雨量: 81.4 },
  { name: 'London', 月份: 'May', 月均降雨量: 47 },
  { name: 'London', 月份: 'Jun.', 月均降雨量: 20.3 },
  { name: 'London', 月份: 'Jul.', 月均降雨量: 24 },
  { name: 'London', 月份: 'Aug.', 月均降雨量: 35.6 },
  { name: 'Berlin', 月份: 'Jan.', 月均降雨量: 12.4 },
  { name: 'Berlin', 月份: 'Feb.', 月均降雨量: 23.2 },
  { name: 'Berlin', 月份: 'Mar.', 月均降雨量: 34.5 },
  { name: 'Berlin', 月份: 'Apr.', 月均降雨量: 99.7 },
  { name: 'Berlin', 月份: 'May', 月均降雨量: 52.6 },
  { name: 'Berlin', 月份: 'Jun.', 月均降雨量: 35.5 },
  { name: 'Berlin', 月份: 'Jul.', 月均降雨量: 37.4 },
  { name: 'Berlin', 月份: 'Aug.', 月均降雨量: 42.4 }
];

const data1 = [
  { item: 'Design', a: 70, b: 30 },
  { item: 'Development', a: 60, b: 70 },
  { item: 'Marketing', a: 50, b: 60 },
  { item: 'Users', a: 40, b: 50 },
  { item: 'Test', a: 60, b: 70 },
  { item: 'Language', a: 70, b: 50 },
  { item: 'Technology', a: 50, b: 40 },
  { item: 'Support', a: 30, b: 40 },
  { item: 'Sales', a: 60, b: 40 },
  { item: 'UX', a: 50, b: 60 }
];

const tooltipConfig = {
  shared: true, // 合并数据项
  follow: true, // tooltip 跟随鼠标
  showCrosshairs: true, // 展示 crosshairs
  crosshairs: {
    // 配置 crosshairs 样式
    type: 'xy', // crosshairs 类型
    line: {
      // crosshairs 线样式
      style: {
        stroke: '#565656',
        lineDash: [4]
      }
    }
  }
};

const useStyles = makeStyles(() => ({
  filters: {
    display: 'flex',
    justifyContent: ' flex-end'
  },
  card: {
    height: '350px',
    padding: 0,
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
  const [coords, setCoords] = useState<
    | {
        latitude: number;
        longitude: number;
      }
    | undefined
  >(undefined);
  const t = useContext(I18n);
  const { data: ageGroup = { data: [] } } = useQuery(
    ['geolog', { ...coords }],
    getGeoLogInfos,
    {
      refetchInterval: 5000,
      enabled: Boolean(coords)
    }
  );

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
    fields: ['a', 'b'], // 展开字段集
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     api
  //       .get(`/api/analytics/near`)
  //       .then((e) => e.json())
  //       .then((infos) => setNear(infos.data));
  //   }, 60 * SECOND);
  //   api
  //     .get(`/api/analytics/near`)
  //     .then((e) => e.json())
  //     .then((infos) => setNear(infos.data));
  //   return () => clearInterval(interval);
  // }, []);

  // const transformation = useMemo(
  //   () =>
  //     near.map((str) => {
  //       const [gender, age] = str.split('_');
  //       return {
  //         gender,
  //         age: +age
  //       };
  //     }),
  //   [near]
  // );

  // const maleVsFemale = useMemo(() => {
  //   const femaleCount = transformation.reduce((acc, curr) => {
  //     const add1 = curr.gender === 'f' ? 1 : 0;
  //     return acc + add1;
  //   }, 0);
  //   return [
  //     {
  //       color: '#1f77b4',
  //       label: 'male',
  //       value: transformation.length - femaleCount
  //     },
  //     {
  //       color: '#9467bd',
  //       label: 'female',
  //       value: femaleCount
  //     }
  //   ];
  // }, [transformation]);

  // const groupFemaleByAge = useMemo(() => {
  //   const tmp = R.groupBy<{ age: number }>(classifyByAge)(
  //     transformation.filter((e) => e.gender === 'f')
  //   );
  //   return Object.keys(tmp).map((k) => ({
  //     label: k,
  //     value: tmp[k].length
  //   }));
  // }, [transformation]);

  // const groupMaleByAge = useMemo(() => {
  //   const tmp = R.groupBy<{ age: number }>(classifyByAge)(
  //     transformation.filter((e) => e.gender === 'm')
  //   );
  //   return Object.keys(tmp).map((k) => ({
  //     label: k,
  //     value: tmp[k].length
  //   }));
  // }, [transformation]);

  return (
    <>
      <>
        <div className={classes.filters}>
          <Button
            startIcon={<PersonPinCircleIcon />}
            variant="contained"
            onClick={() => {
              api.get(
                `/api/geolog/traffic?latitude=${coords?.latitude}&longitude=${coords?.longitude}`
              );
            }}>
            {t('generate-traffic')}
          </Button>

          <Button
            startIcon={<PersonPinCircleIcon />}
            variant="contained"
            onClick={console.log}>
            {t('int.radius')}
          </Button>
        </div>
        <br />

        <Grid spacing={3} container>
          <Grid xs={12} md={12} lg={12} item>
            <Card component="div" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Chart padding="auto" data={data} autoFit>
                  <Interval
                    adjust={[
                      {
                        type: 'dodge',
                        marginRatio: 0
                      }
                    ]}
                    color="name"
                    position="月份*月均降雨量"
                  />
                  <Tooltip shared />
                  <Legend layout="vertical" position="top-left" />
                </Chart>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={12} lg={4} item>
            <Card component="div" className={classes.radar}>
              <CardHeader title="women-per-age" />
              <CardContent className={classes.cardContentRadar}>
                <Chart
                  height={400}
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
                  {/* <Tooltip {...tooltipConfig} /> */}
                  <Point position="item*score" color="user" shape="circle" />
                  <Line position="item*score" color="user" size="2" />
                  <Area position="item*score" color="user" />
                  <Axis name="item" {...axisConfig} />
                </Chart>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={12} lg={4} item>
            <Card component="div" className={classes.radar}>
              <CardHeader title="male-per-age" />
              <CardContent className={classes.cardContentRadar}>
                <Chart
                  height={400}
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
                  {/* <Tooltip {...tooltipConfig} /> */}
                  <Point position="item*score" color="user" shape="circle" />
                  <Line position="item*score" color="user" size="2" />
                  <Area position="item*score" color="user" />
                  <Axis name="item" {...axisConfig} />
                </Chart>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </>
  );
}
export default Near;
