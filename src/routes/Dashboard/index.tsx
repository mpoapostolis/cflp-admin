import React, { useContext, useState, useEffect, useMemo } from 'react';
import InfoCard from '../../components/InfoCard';
import { sliderCont } from './css';
import I18n from '../../I18n';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { EUROSIGN, debounce, colorArray } from '../../utils';
import {
  Typography,
  Button,
  Popover,
  Slider,
  Grid,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';
import Calendar from 'react-calendar';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';
import { subDays, format } from 'date-fns';
import LineChart from '../../components/LineChart';
import DonutChart from '../../components/DonutChart';
import BarChart from '../../components/BarChart';
import useApi from '../../Hooks';
import { uniq } from 'ramda';

export const formatDate = (date?: number) =>
  date ? format(+date, 'd MMM yyy') : '';

const defautDates = [new Date(), subDays(Date.now(), 1)];

function Dashboard() {
  const t = useContext(I18n);
  const [anchorDateEl, setAnchorDateEl] = useState<HTMLButtonElement | null>(
    null
  );

  const api = useApi();

  const [
    anchorRadiusEl,
    setAnchorRadiusEl
  ] = useState<HTMLButtonElement | null>(null);

  const [dates, setDates] = useState(defautDates);
  const [radius, setRadius] = useState(1);
  const [from, to] = dates;

  const [products, setProducts] = useState();
  const [offers, setOffers] = useState();

  const handleOpenDates = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorDateEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setAnchorDateEl(null);
  };

  function handleChangeDates(evt: any) {
    setDates(evt);
    handleDateClose();
  }

  const handleOpenRadius = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorRadiusEl(event.currentTarget);
  };

  const handleRadiusClose = () => {
    setAnchorRadiusEl(null);
  };

  function handleChangeRadius(evt: any, radius: number) {
    setRadius(radius);
  }
  const _setRadius = debounce(handleChangeRadius, 1000);

  const commonActions = [
    <Button size="small" color="secondary">
      {t('int.see-more')}
    </Button>
  ];

  useEffect(() => {
    api
      .get(`/api/bo/transactions/offers/timeseries`)
      .then(e => e.json())
      .then(infos => setOffers(uniq(infos.data)));

    api
      .get(`/api/bo/transactions/products/timeseries`)
      .then(e => e.json())
      .then(infos => setProducts(uniq(infos.data)));
  }, [dates]);

  const totalProducts = useMemo(
    () => products?.reduce((acc: any, curr: any) => acc + curr.purchased, 0),
    [products]
  );

  const totalOffers = useMemo(
    () => offers?.reduce((acc: any, curr: any) => acc + curr.purchased, 0),
    [offers]
  );

  const totalProfit = products?.reduce(
    (acc: number, obj: any) => acc + obj.purchased * obj.price,
    0
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <Typography color="textSecondary" variant="h6">
          {t('int.hello-{user}')}
        </Typography>

        <Button
          startIcon={<DateRangeIcon />}
          variant="contained"
          onClick={handleOpenDates}>
          {`${formatDate(from.getTime())} - ${formatDate(to.getTime())}`}
        </Button>

        <Popover
          open={Boolean(anchorDateEl)}
          anchorEl={anchorDateEl}
          onClose={handleDateClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}>
          <Calendar onChange={handleChangeDates} value={dates} selectRange />
        </Popover>
      </div>
      <br />

      <Grid spacing={3} container>
        <Grid item md={6} lg={3} xs={12}>
          <InfoCard
            actions={commonActions}
            icon={<AllInboxIcon />}
            value={totalProducts}
            iconColor="blue"
            title={t('int.products-purchased')}
          />
        </Grid>
        <Grid item md={6} lg={3} xs={12}>
          <InfoCard
            iconColor="orange"
            icon={<LocalOfferIcon />}
            value={totalOffers}
            title={t('int.offers-purchased')}
            actions={commonActions}
          />
        </Grid>
        <Grid item md={6} lg={3} xs={12}>
          <InfoCard
            actions={commonActions}
            iconColor="green"
            icon={<AttachMoneyIcon />}
            title={t('int.total-profit')}
            value={`${totalProfit}${EUROSIGN}`}
          />
        </Grid>

        <Grid item md={6} lg={3} xs={12}>
          <InfoCard
            actions={[
              ...commonActions,
              <Button
                startIcon={<SettingsInputAntennaIcon />}
                size="small"
                variant="outlined"
                onClick={handleOpenRadius}>
                {radius}km
              </Button>
            ]}
            icon={<img style={{ width: '30px' }} src="/images/live.svg" />}
            value={'2'}
            title={t('int.online-users')}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <LineChart
            title={t('int.offers-products-purchased')}
            labels={[1, 2, 3, 4, 5, 6, 7]}
            datasets={[
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
            ]}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <BarChart
            title={t('int.revenue-pre-product')}
            labels={products?.map((obj: any) => obj.name)}
            datasets={[
              {
                data: products?.map((obj: any) => obj.purchased),
                backgroundColor: colorArray,
                borderColor: colorArray,
                borderWidth: 1
              }
            ]}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <DonutChart
            title={t('int.purchased-per-offer')}
            labels={offers?.map((obj: any) => obj.name)}
            datasets={[
              {
                label: 'XX',
                data: offers?.map((obj: any) => obj.purchased),
                backgroundColor: [],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
              }
            ]}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <LineChart
            title={t('int.revenue')}
            labels={products?.map((obj: any) => obj.dateCreated ?? '')}
            datasets={[
              {
                label: 'Revenue',
                data: products?.map(
                  (obj: any) => obj.purchased * obj.price ?? ''
                ),
                backgroundColor: '#49A44C6F',
                borderWidth: 1
              }
            ]}
          />
        </Grid>
      </Grid>

      <Popover
        open={Boolean(anchorRadiusEl)}
        anchorEl={anchorRadiusEl}
        onClose={handleRadiusClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
        <Card className={sliderCont}>
          <CardHeader
            titleTypographyProps={{ variant: 'body2' }}
            title={`${t('int.change-radius')}: ${radius}km`}
          />
          <CardContent>
            <Slider
              onChange={_setRadius}
              color="secondary"
              defaultValue={1}
              valueLabelDisplay="auto"
              step={0.25}
              marks
              min={0}
              max={5}
            />
          </CardContent>
        </Card>
      </Popover>
    </>
  );
}

export default Dashboard;
