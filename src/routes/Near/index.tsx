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

const data = [
  {
    groupName: '0-25',
    scores: [
      { label: 'AA', score: 15 },
      { label: 'pp', score: 15 },
      { label: 'BB', score: 13 },
      { label: 'CC', score: 12 },
      { label: 'DD', score: 11 },
      { label: 'EE', score: 10 }
    ]
  },

  {
    groupName: '26-36',
    scores: [
      { label: 'AA', score: 5 },
      { label: 'BB', score: 2 },
      { label: 'CC', score: 5 },
      { label: 'DD', score: 2 },
      { label: 'EE', score: 5 }
    ]
  },

  {
    groupName: '36+',
    scores: [
      { label: 'AA', score: 1 },
      { label: 'BB', score: 2 },
      { label: 'CC', score: 3 },
      { label: 'DD', score: 4 },
      { label: 'EE', score: 5 }
    ]
  }
];

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
    width: '97%',
    height: '100%',
    padding: 0,
    margin: 0
  }
}));

function classifyByAge(person: { age: number }) {
  const score = person.age;
  return score < 15
    ? '0-14'
    : score < 25
    ? '15-24'
    : score < 35
    ? '25-34'
    : score < 45
    ? '25-44'
    : score < 61
    ? '45-60'
    : '60+';
}

function Near() {
  const classes = useStyles();
  const t = useContext(I18n);
  const [near, setNear] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      api
        .get(`/api/analytics/near`)
        .then((e) => e.json())
        .then((infos) => setNear(infos.data));
    }, 60 * SECOND);
    api
      .get(`/api/analytics/near`)
      .then((e) => e.json())
      .then((infos) => setNear(infos.data));
    return () => clearInterval(interval);
  }, []);

  const transformation = useMemo(
    () =>
      near.map((str) => {
        const [gender, age] = str.split('_');
        return {
          gender,
          age: +age
        };
      }),
    [near]
  );

  const maleVsFemale = useMemo(() => {
    const femaleCount = transformation.reduce((acc, curr) => {
      const add1 = curr.gender === 'f' ? 1 : 0;
      return acc + add1;
    }, 0);
    return [
      {
        color: '#1f77b4',
        label: 'male',
        value: transformation.length - femaleCount
      },
      {
        color: '#9467bd',
        label: 'female',
        value: femaleCount
      }
    ];
  }, [transformation]);

  const groupFemaleByAge = useMemo(() => {
    const tmp = R.groupBy<{ age: number }>(classifyByAge)(
      transformation.filter((e) => e.gender === 'f')
    );
    return Object.keys(tmp).map((k) => ({
      label: k,
      value: tmp[k].length
    }));
  }, [transformation]);

  const groupMaleByAge = useMemo(() => {
    const tmp = R.groupBy<{ age: number }>(classifyByAge)(
      transformation.filter((e) => e.gender === 'm')
    );
    return Object.keys(tmp).map((k) => ({
      label: k,
      value: tmp[k].length
    }));
  }, [transformation]);

  return (
    <>
      <>
        <div className={classes.filters}>
          <Button
            startIcon={<PersonPinCircleIcon />}
            variant="contained"
            onClick={() => {
              Array(500)
                .fill('')
                .forEach((_, idx) => {
                  const randomGender = Math.random() < 0.3 ? 'f' : 'm';
                  const randomAge = Math.floor(Math.random() * 65);
                  api.get(
                    `/api/client/stores?id=${idx}&age=${randomAge}&gender=${randomGender}`
                  );
                });
            }}>
            {t('generate-traffice')}
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
          <Grid xs={12} md={12} lg={4} item>
            <Card component="div" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <PieChart title={t('int.male')} data={groupMaleByAge} />
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={12} lg={4} item>
            <Card component="div" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <PieChart title={t('int.female')} data={groupFemaleByAge} />
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={12} lg={4} item>
            <Card component="div" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <BarChart title={t('int.male-female')} data={maleVsFemale} />
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={12} lg={4} item>
            <Card component="div" className={classes.radar}>
              <CardHeader title="women-per-age" />
              <CardContent className={classes.cardContentRadar}>
                <RadarChart data={data} />
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={12} lg={4} item>
            <Card component="div" className={classes.radar}>
              <CardHeader title="male-per-age" />
              <CardContent className={classes.cardContentRadar}>
                <RadarChart data={data} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </>
  );
}
export default Near;
