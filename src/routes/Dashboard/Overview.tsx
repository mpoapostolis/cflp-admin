import React, { useContext } from 'react';
import I18n from '../../I18n';
import { Grid, Button, Typography } from '@material-ui/core';
import InfoCard from '../../components/InfoCard';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { EUROSIGN } from '../../utils';
import { Link } from 'react-router-dom';

type Props = {
  productsPurchased: number;
  offersPurchased: number;
  revenue: number;
  live: number;
};

function Overview(props: Props) {
  const t = useContext(I18n);
  return (
    <>
      <Grid item md={12} lg={4} xs={12}>
        <InfoCard
          iconColor="orange"
          icon={<AttachMoneyIcon />}
          title={t('int.revenue')}
          value={`${props.revenue.toFixed(2)}${EUROSIGN}`}
        />
      </Grid>

      <Grid item md={12} lg={4} xs={12}>
        <InfoCard
          iconColor="green"
          icon={<AttachMoneyIcon />}
          title={t('int.revenue')}
          value={`${props.revenue.toFixed(2)}${EUROSIGN}`}
        />
      </Grid>
      <Grid item md={12} lg={4} xs={12}>
        <InfoCard
          icon={
            <Typography
              style={{
                color: 'white',
                padding: '10px',
                background: `linear-gradient(180deg, #F54764 0%, #Ff0704 100%)`
              }}
              variant="caption"
              color="textPrimary">
              Live
            </Typography>
          }
          value={`${props.live}`}
          title={t('int.online-users')}
        />
      </Grid>
    </>
  );
}

export default Overview;
