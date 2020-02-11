import React, { useContext, useState, useEffect, useMemo } from 'react';
import { filterClass } from './css';
import I18n from '../../I18n';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Button, Popover, Grid } from '@material-ui/core';
import Calendar from 'react-calendar';
import { subDays, format } from 'date-fns';
import useApi from '../../Hooks';
import { uniq } from 'ramda';
import Overview from './Overview';
import Analytics from './Analytics';

export const formatDate = (date?: number) =>
  date ? format(+date, 'd MMM yyy') : '';

const defautDates = [new Date(), subDays(Date.now(), 1)];

function Dashboard() {
  const t = useContext(I18n);
  const [anchorDateEl, setAnchorDateEl] = useState<HTMLButtonElement | null>(
    null
  );

  const api = useApi();

  const [dates, setDates] = useState(defautDates);
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

  useEffect(() => {
    api
      .get(`/api/bo/analytics/offers`)
      .then(e => e.json())
      .then(infos => setOffers(uniq(infos.data)));

    api
      .get(`/api/bo/analytics/products`)
      .then(e => e.json())
      .then(infos => setProducts(uniq(infos.data)));
  }, [dates]);

  return (
    <>
      <div className={filterClass}>
        <Button
          startIcon={<DateRangeIcon />}
          variant="contained"
          onClick={handleOpenDates}>
          {`${formatDate(from.getTime())} - ${formatDate(to.getTime())}`}
        </Button>
      </div>
      <br />

      <Grid spacing={3} container>
        <Overview offersPurchased={0} totalProfit={2} productsPurchased={3} />
        <Analytics products={products} offers={offers} transactions={[]} />
      </Grid>

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
    </>
  );
}

export default Dashboard;
