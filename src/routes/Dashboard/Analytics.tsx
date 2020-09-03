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
  Geom,
  DonutChart,
  Interaction
} from 'bizcharts';
import * as R from 'ramda';
import DataSet from '@antv/data-set';
import { getTagsAnalytics } from '../../api/tags';
import { getProducts } from '../../api/products';

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
    height: '350px',
    overflowY: 'auto'
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
  const [selectedGroup, setSelectedGroup] = useState<any>(undefined);
  const [coords, setCoords] = useState<
    | {
        latitude: number;
        longitude: number;
      }
    | undefined
  >(undefined);
  const t = useContext(I18n);

  const { data: tags } = useQuery('tags', getTagsAnalytics);
  const { data: products } = useQuery(
    ['products', { sortBy: 'purchased' }],
    getProducts
  );

  const top10Products = useMemo(() => products?.data?.slice(0, 10) ?? [], [
    products
  ]);

  const { data: ageGroup = { data: [] } } = useQuery(
    ['geolog', { ...coords }],
    getGeoLogInfos,
    {
      refetchInterval: 5000,
      enabled: Boolean(coords)
    }
  );

  const orderGroups: any[] = useMemo(
    () => R.sortWith([R.descend(R.prop('total'))])(ageGroup.data),
    [ageGroup]
  );

  useEffect(() => {
    if (!selectedGroup && orderGroups[0])
      setSelectedGroup(orderGroups[0].age_group);
  }, [orderGroups]);

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

  const top10TagsToSelectedGroup = R.sortWith([
    R.descend(R.prop(selectedGroup))
  ])(tags ?? []).slice(0, 10);

  const { DataView } = DataSet;

  const totals = (orderGroups?.map((o) => Number(o.total)) ?? []) as number[];
  const max = Math.max(...totals);
  const min = Math.min(...totals);

  const tagsView = new DataView().source(top10TagsToSelectedGroup ?? []);
  tagsView.transform({
    type: 'fold',
    fields: selectedGroup, // 展开字段集
    key: 'user', // key字段
    value: 'score' // value字段
  });

  const tagsData = tagsView.rows;
  const axisConfig = {
    label: {
      offset: 25
    },
    tickLine: {
      length: 20
    }
  };

  const top10TagNames = useMemo(
    () => top10TagsToSelectedGroup.map((o: any) => o.tag_name),
    [top10TagsToSelectedGroup]
  );

  const recommendations = useMemo(() => {
    const transformedProducts = products?.data
      .filter((o: any) => R.intersection(o.tags, top10TagNames).length > 0)
      .map((o: any) => ({ ...o, total: o.tags.length }));
    return R.sortWith([R.descend(R.prop('total'))])(
      transformedProducts ?? []
    ).slice(0, 10);
  }, [top10TagNames, products]);

  console.log(recommendations);

  return (
    <>
      <Grid xs={12} md={12} lg={4} item>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Groups per age near me
        </Typography>

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
              color={['gender', ['#F2A4B6', '#6395F9']]}
              position="age_group*total"
            />
            <Tooltip shared />
            <Legend layout="vertical" position="top-left" />
          </Chart>
        </Paper>
      </Grid>

      <Grid xs={12} md={12} lg={4} item>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Tags {selectedGroup} preffer
        </Typography>
        <Paper component="div" className={classes.card}>
          {selectedGroup && (
            <Chart data={tagsData} autoFit interactions={['legend-highlight']}>
              <Coordinate type="polar" radius={1} />
              <Point position="tag_name*score" color="#6395F9" shape="circle" />

              <Line position="tag_name*score" color="#6395F9" size="2" />
              <Area position="tag_name*score" color="#6395F9" />
              <Axis name="tag_name" {...axisConfig} />
            </Chart>
          )}
        </Paper>
      </Grid>

      <Grid item md={12} lg={4} xs={12}>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Famous groups arround
        </Typography>

        <Paper component="div" className={classes.card}>
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
                        <VisibilityIcon
                          htmlColor={
                            selectedGroup === row.age_group
                              ? '#59B25E'
                              : '#0002'
                          }
                        />
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
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Top 10 selling products
        </Typography>

        <Paper component="div" className={classes.card}>
          <Chart padding="auto" data={top10Products} autoFit>
            <Interval position="product_name*purchased" />
            <Coordinate transpose reflect="y" />
            <Tooltip shared />
          </Chart>
        </Paper>
      </Grid>

      <Grid xs={12} md={12} lg={4} item>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          Most likely products to sell for {selectedGroup}
        </Typography>

        <Paper component="div" className={classes.card}>
          {selectedGroup && (
            <Chart padding="auto" data={recommendations} autoFit>
              <Interval color="#F3A9BA" position="product_name*total" />
              <Coordinate transpose reflect="y" />

              <Tooltip shared />
            </Chart>
          )}
        </Paper>
      </Grid>
    </>
  );
}
export default Near;
