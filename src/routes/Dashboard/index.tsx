import React, { useContext, useState, useEffect, useMemo } from 'react';
import { filterClass } from './css';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Button, Popover, Grid } from '@material-ui/core';
import Calendar from 'react-calendar';
import { subDays, format } from 'date-fns';
import Overview from './Overview';
import Analytics from './Analytics';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import api from '../../ky';

const SECOND = 1000;

export const formatDate = (date?: number) =>
  date ? format(+date, 'd MMM yyy') : '';

const defautDates = [subDays(Date.now(), 1), new Date()];
type DashBoardParams = { from: string; to: string };

export type AggregateData = {
  name: string;
  purchased: number;
}[];

export type TimeSeriesData = {
  dateCreated: Date;
  total: number;
}[];

function Dashboard() {
  const [anchorDateEl, setAnchorDateEl] = useState<HTMLButtonElement | null>(
    null
  );

  const history = useHistory();
  const urlParams = queryString.parse(history.location.search);
  const { from, to } = urlParams as DashBoardParams;
  const [live, setLive] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [aggregatedProducts, setAggregatedProducts] = useState<AggregateData>(
    []
  );
  const [aggregatedOffers, setAggregatedOffers] = useState<AggregateData>([]);

  const [timeSeriesProducts, settimeSeriesProducts] = useState<TimeSeriesData>(
    []
  );
  const [timeSeriesOffers, settimeSeriesOffers] = useState<TimeSeriesData>([]);

  useEffect(() => {
    const urlParams = queryString.parse(history.location.search);
    const defaultParams = {
      from: defautDates[0].getTime(),
      to: defautDates[1].getTime(),
      ...urlParams
    };
    history.replace(`?${queryString.stringify(defaultParams)}`);
  }, []);

  const handleOpenDates = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorDateEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setAnchorDateEl(null);
  };

  function handleChangeDates(evt: any) {
    const [from, to] = evt;
    const urlParams = queryString.parse(history.location.search);
    history.push(
      `?${queryString.stringify({
        ...urlParams,
        from: from.getTime(),
        to: to.getTime()
      })}`
    );
    handleDateClose();
  }

  return (
    <>
      <div className={filterClass}>
        <Button
          startIcon={<DateRangeIcon />}
          variant="contained"
          onClick={handleOpenDates}>
          {`${formatDate(+from)} - ${formatDate(+to)}`}
        </Button>
      </div>
      <br />

      <Grid spacing={3} container>
        <Overview
          live={live}
          offersPurchased={timeSeriesOffers.reduce(
            (acc, curr) => acc + curr.total,
            0
          )}
          revenue={revenue}
          productsPurchased={timeSeriesProducts.reduce(
            (acc, curr) => acc + curr.total,
            0
          )}
        />
        <Analytics
          aggregatedProducts={aggregatedProducts}
          aggregatedOffers={aggregatedOffers}
          timeSeriesProducts={timeSeriesProducts}
          timeSeriesOffers={timeSeriesOffers}
        />
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
        <Calendar
          onChange={handleChangeDates}
          value={[new Date(+from), new Date(+to)]}
          selectRange
        />
      </Popover>
    </>
  );
}

export default Dashboard;
