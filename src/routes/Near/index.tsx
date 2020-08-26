import React, { useContext, useState, useEffect, useMemo } from 'react';
import I18n from '../../I18n';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody
} from '@material-ui/core';
import { useQuery } from 'react-query';
import { getGeoLogInfos } from '../../api/geolog';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { toast } from 'react-toastify';
import {
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
import * as R from 'ramda';

import DataSet from '@antv/data-set';
import { getTagsAnalytics } from '../../api/tags';
import InfoCard from '../../components/InfoCard';

const data1 = [
  { item: 'Design', c: 1, d: 3, aa: 3, a: 70, b: 30 },
  { item: 'Development', c: 1, d: 3, aa: 3, a: 60, b: 90 },
  { item: 'Marketing', c: 1, d: 3, aa: 3, a: 50, b: 60 },
  { item: 'Users', c: 1, d: 3, aa: 3, a: 40, b: 50 },
  { item: 'Test', c: 1, d: 3, aa: 3, a: 60, b: 70 },
  { item: 'Language', c: 1, d: 3, aa: 3, a: 70, b: 50 },
  { item: 'Technology', c: 1, d: 3, aa: 3, a: 50, b: 40 },
  { item: 'Support', c: 1, d: 3, aa: 3, a: 30, b: 40 },
  { item: 'Sales', c: 1, d: 3, aa: 3, a: 60, b: 40 },
  { item: 'UX', c: 1, d: 3, aa: 3, a: 50, b: 60 }
];

const age_groups = {
  female_age_13_17: [],
  female_age_18_24: [],
  female_age_25_34: [],
  female_age_35_44: [],
  female_age_45_54: [],
  female_age_55_64: [],
  female_age_65_plus: [],
  female_age_unkown: [],
  male_age_13_17: [],
  male_age_18_24: [],
  male_age_25_34: [],
  male_age_35_44: [],
  male_age_45_54: [],
  male_age_55_64: [],
  male_age_65_plus: [],
  male_age_unkown: []
};

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

  table: {
    height: '320px',
    overflowY: 'auto'
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
  const [selectedGroup, setSelectedGroup] = useState<any>('female_age_13_17');
  const [coords, setCoords] = useState<
    | {
        latitude: number;
        longitude: number;
      }
    | undefined
  >(undefined);
  const t = useContext(I18n);

  const { data: tags } = useQuery('tags', getTagsAnalytics);

  const { data: ageGroup = { data: [] } } = useQuery(
    ['geolog', { ...coords }],
    getGeoLogInfos,
    {
      refetchInterval: 5000,
      enabled: Boolean(coords)
    }
  );

  const orderGroups = useMemo(
    () => R.sortWith([R.descend(R.prop('total'))])(ageGroup.data),
    [ageGroup]
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
  const dv = new DataView().source(tags ?? []);

  const totals = (orderGroups?.map((o) => Number(o.total)) ?? []) as number[];
  const max = Math.max(...totals);
  const min = Math.min(...totals);

  dv.transform({
    type: 'fold',
    fields: selectedGroup, // 展开字段集
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
        <Grid xs={12} md={12} lg={4} item>
          <Paper component="div" className={classes.card}>
            <Chart
              scale={{
                score: {
                  min,
                  max
                }
              }}
              padding="auto"
              data={ageGroupState}
              autoFit>
              <Interval
                adjust={[
                  {
                    type: 'dodge',
                    marginRatio: 0.1
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

        <Grid item md={12} lg={4} xs={12}>
          <Paper component="div" className={classes.card}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <Typography variant="h5">Famous groups arround</Typography>

              <Typography
                style={{
                  color: 'white',
                  padding: '10px',
                  float: 'right',
                  background: `linear-gradient(180deg, #F54764 0%, #Ff0704 100%)`
                }}
                variant="caption"
                color="textPrimary">
                {percentageData &&
                  percentageData?.reduce(
                    (acc: number, curr: any) => acc + curr?.total,
                    0
                  )}{' '}
                Live
              </Typography>
            </div>
            <br />
            <Divider />

            {/* <List>
              {orderGroups.map((o: any) => (
                <ListItem key={o.age_group}>
                  <ListItemText
                    primary={
                      <>
                        <Typography component="span" variant="h5">
                          {o.age_group}
                        </Typography>
                        <Typography
                          component="span"
                          variant="h6"
                          style={{ marginLeft: '20px' }}>
                          {o.total}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="view">
                      <VisibilityIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List> */}

            <TableContainer className={classes.table}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Age_group</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderGroups.map((row: any) => (
                    <TableRow
                      selected={selectedGroup === row.age_group}
                      key={row?.age_group}>
                      <TableCell component="th" scope="row">
                        {row.age_group}
                      </TableCell>
                      <TableCell align="right">{row.total}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => setSelectedGroup(row.age_group)}
                          edge="end"
                          aria-label="view">
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid xs={12} md={12} lg={4} item>
          <Paper component="div" className={classes.card}>
            <Chart data={newData} autoFit interactions={['legend-highlight']}>
              <Coordinate type="polar" radius={0.8} />
              <Point position="tag_name*score" color="user" shape="circle" />
              <Tooltip shared />

              <Line position="tag_name*score" color="user" size="2" />
              <Area position="tag_name*score" color="user" />
              <Axis name="tag_name" {...axisConfig} />
            </Chart>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default Near;
