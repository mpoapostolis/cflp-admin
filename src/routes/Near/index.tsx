import React, { useContext, useState, useEffect, useMemo } from 'react';
import I18n from '../../I18n';
import { Button, Grid, Card, CardContent, makeStyles } from '@material-ui/core';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import PieChart from '../../components/PieChart';
import BarChart from '../../components/BarChart';
import useApi from '../../Hooks';
import { SECOND } from '../../utils';
import * as R from 'ramda';

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
    : score < 41
    ? '25-40'
    : score < 61
    ? '41-60'
    : '60+';
}

function Near() {
  const classes = useStyles();
  const t = useContext(I18n);
  const api = useApi();
  const [near, setNear] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      api
        .get(`/api/bo/analytics/near`)
        .then(e => e.json())
        .then(infos => setNear(infos.data));
    }, SECOND);
    api
      .get(`/api/bo/analytics/near`)
      .then(e => e.json())
      .then(infos => setNear(infos.data));
    return () => clearInterval(interval);
  }, []);

  const transformation = useMemo(
    () =>
      near.map(str => {
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
      transformation.filter(e => e.gender === 'f')
    );
    return Object.keys(tmp).map(k => ({
      label: k,
      value: tmp[k].length
    }));
  }, [transformation]);

  const groupMaleByAge = useMemo(() => {
    const tmp = R.groupBy<{ age: number }>(classifyByAge)(
      transformation.filter(e => e.gender === 'm')
    );
    return Object.keys(tmp).map(k => ({
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
                  const randomAge = Math.floor(Math.random() * 80);
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
        </Grid>
      </>
    </>
  );
}
export default Near;
