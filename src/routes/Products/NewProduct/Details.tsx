import React, { useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  InputAdornment
} from '@material-ui/core';
import I18n from '../../../I18n';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

const useStyles = makeStyles(() => ({
  cardContent: {
    maxHeight: '62vh',
    minHeight: '167px',
    overflow: 'auto'
  },

  spacer: {
    flexGrow: 1
  }
}));

type Props = {
  infos: {
    name: string;
    price: number;
    lpReward: number;
  };
  setInfos: React.Dispatch<
    React.SetStateAction<{
      name: string;
      price: number;
      lpReward: number;
    }>
  >;
};

function AccountDetails(props: Props) {
  const classes = useStyles();
  const { infos, setInfos } = props;

  const _setInfos = useCallback((obj) => {
    setInfos((s) => ({ ...s, ...obj }));
  }, []);

  const t = useContext(I18n);

  return (
    <Card>
      <CardHeader
        subheader={t('int.edit-product-info')}
        title={t('int.product')}></CardHeader>
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              value={R.propOr('', 'name', infos)}
              onChange={(evt) => _setInfos({ name: evt.currentTarget.value })}
              label={t('int.name')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              value={R.propOr('', 'price', infos)}
              fullWidth
              onChange={(evt) => _setInfos({ price: +evt.currentTarget.value })}
              type={'number'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                )
              }}
              label={t('int.price')}
              required
              margin="dense"
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              value={R.propOr('', 'lpReward', infos)}
              fullWidth
              label={t('int.lpReward')}
              margin="dense"
              onChange={(evt) =>
                _setInfos({ lpReward: +evt.currentTarget.value })
              }
              required
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AccountDetails;
