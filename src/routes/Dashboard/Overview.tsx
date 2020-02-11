import React, { useContext } from 'react';
import I18n from '../../I18n';
import { Grid, Button } from '@material-ui/core';
import InfoCard from '../../components/InfoCard';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { EUROSIGN } from '../../utils';

type Props = {
  productsPurchased: number;
  offersPurchased: number;
  totalProfit: number;
};

function Overview(props: Props) {
  const t = useContext(I18n);
  return (
    <>
      <Grid item md={6} lg={3} xs={12}>
        <InfoCard
          actions={[
            <Button size="small" color="secondary">
              {t('int.see-more')}
            </Button>
          ]}
          icon={<AllInboxIcon />}
          value={props.productsPurchased.toFixed(0)}
          iconColor="blue"
          title={t('int.products-purchased')}
        />
      </Grid>
      <Grid item md={6} lg={3} xs={12}>
        <InfoCard
          iconColor="orange"
          icon={<LocalOfferIcon />}
          value={props.offersPurchased.toFixed(0)}
          title={t('int.offers-purchased')}
          actions={[
            <Button size="small" color="secondary">
              {t('int.see-more')}
            </Button>
          ]}
        />
      </Grid>
      <Grid item md={6} lg={3} xs={12}>
        <InfoCard
          actions={[
            <Button size="small" color="secondary">
              {t('int.see-more')}
            </Button>
          ]}
          iconColor="green"
          icon={<AttachMoneyIcon />}
          title={t('int.total-profit')}
          value={`${props.totalProfit}${EUROSIGN}`}
        />
      </Grid>
      <Grid item md={6} lg={3} xs={12}>
        <InfoCard
          actions={[
            <Button size="small" color="secondary">
              {t('int.see-more')}
            </Button>
          ]}
          icon={<img style={{ width: '30px' }} src="/images/live.svg" />}
          value={'2'}
          title={t('int.online-users')}
        />
      </Grid>
    </>
  );
}

export default Overview;
