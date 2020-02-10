import React, { useContext, useState } from 'react';
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

export const formatDate = (date?: number) =>
  date ? format(+date, 'd MMM yyy') : '';

const defautDates = [new Date(), subDays(Date.now(), 1)];

function Dashboard() {
  const t = useContext(I18n);
  const [anchorDateEl, setAnchorDateEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [
    anchorRadiusEl,
    setAnchorRadiusEl
  ] = useState<HTMLButtonElement | null>(null);

  const [dates, setDates] = useState(defautDates);
  const [radius, setRadius] = useState(1);
  const [from, to] = dates;

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
            value={'10'}
            iconColor="blue"
            title={t('int.products-purchased')}
          />
        </Grid>
        <Grid item md={6} lg={3} xs={12}>
          <InfoCard
            iconColor="orange"
            icon={<LocalOfferIcon />}
            value={'2'}
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
            value={`${12}${EUROSIGN}`}
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
            labels={[
              'product1',
              'product2',
              'product3',
              'product4',
              'product5',
              'product5',
              'product5',
              'product5',
              'product5',
              'product5',
              'product5',
              'product6'
            ]}
            datasets={[
              {
                data: [1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 6],
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
            labels={[
              'offer1',
              'offer2',
              'offer3',
              'offer4',
              'offer5',
              'offer5',
              'offer5',
              'offer5',
              'offer5',
              'offer5',
              'offer5',
              'offer6'
            ]}
            datasets={[
              {
                label: '# of Votes',
                data: [
                  12,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
              }
            ]}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <LineChart
            title={t('int.revenue')}
            labels={[1, 2, 3, 4, 5, 6, 7]}
            datasets={[
              {
                label: 'Revenue',
                data: [1, 6, 1, 2, 4, 15, 6, 1, 2, 3, 4, 5, 6],
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
