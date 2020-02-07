import React, { useContext, useState } from 'react';
import InfoCard from '../../components/InfoCard';
import { container } from './css';
import I18n from '../../I18n';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { EUROSIGN } from '../../utils';
import { Typography, Button, Popover } from '@material-ui/core';
import Calendar, { CalendarProps } from 'react-calendar';
import { subDays, format } from 'date-fns';

export const formatDate = (date?: number) =>
  date ? format(+date, 'd MMM yyy') : '';

const defautDates = [new Date(), subDays(Date.now(), 1)];

function Dashboard() {
  const t = useContext(I18n);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [dates, setDates] = useState(defautDates);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleChangeDates(evt: any) {
    setDates(evt);
    handleClose();
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [from, to] = dates;

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
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}>
          {`${formatDate(from.getTime())} - ${formatDate(to.getTime())}`}
        </Button>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
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
      <div className={container}>
        <InfoCard
          icon={<AllInboxIcon />}
          value={'10'}
          iconColor="blue"
          title={t('int.products-purchased')}
        />
        <InfoCard
          iconColor="orange"
          icon={<LocalOfferIcon />}
          value={'2'}
          title={t('int.offers-purchased')}
        />

        <InfoCard
          icon={<img style={{ width: '30px' }} src="/images/live.svg" />}
          value={'2'}
          title={t('int.online-users')}
        />

        <InfoCard
          iconColor="green"
          icon={<AttachMoneyIcon />}
          title={t('int.total-profit')}
          value={`${12}${EUROSIGN}`}
        />
      </div>
    </>
  );
}

export default Dashboard;
