import React, { useContext, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  MenuItem
} from '@material-ui/core';
import I18n from '../../../I18n';
import { useSelector } from 'react-redux';
import { IReduxStore } from '../../../redux/reducers';
import * as R from 'ramda';

const useStyles = makeStyles(() => ({
  cardContent: {
    minHeight: '167px'
  },

  spacer: {
    flexGrow: 1
  }
}));

type Props = {
  infos: {
    name: string;
    description: string;
    status: string;
    loyaltyPoints: number;
  };
  setInfos: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      status: string;
      loyaltyPoints: number;
    }>
  >;
};

function AccountDetails(props: Props) {
  const classes = useStyles();
  const { infos, setInfos } = props;
  const errors = useSelector((store: IReduxStore) => store.errors);

  const _setInfos = useCallback(obj => {
    setInfos(s => ({ ...s, ...obj }));
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
              error={Boolean(R.prop('name', errors))}
              onChange={evt => _setInfos({ name: evt.currentTarget.value })}
              helperText={R.propOr('', 'name', errors)}
              label={t('int.name')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              value={R.propOr('', 'description', infos)}
              error={Boolean(R.prop('description', errors))}
              onChange={evt =>
                _setInfos({ description: evt.currentTarget.value })
              }
              helperText={R.propOr('', 'description', errors)}
              label={t('int.description')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              value={R.propOr('', 'loyaltyPoints', infos)}
              fullWidth
              error={Boolean(R.prop('loyaltyPoints', errors))}
              helperText={R.propOr('', 'loyaltyPoints', errors)}
              label={t('int.loyaltyPoints')}
              margin="dense"
              onChange={evt =>
                _setInfos({ loyaltyPoints: +evt.currentTarget.value })
              }
              required
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              select
              value={R.propOr('', 'status', infos)}
              fullWidth
              error={Boolean(R.prop('status', errors))}
              helperText={R.propOr('', 'status', errors)}
              onChange={evt => _setInfos({ status: evt.target.value })}
              label={t('int.status')}
              margin="dense"
              required
              variant="outlined">
              {[
                { label: t('int.active'), value: 'ACTIVE' },
                { label: t('int.inactive'), value: 'INACTIVE' }
              ].map((obj, idx) => (
                <MenuItem key={idx} value={obj.value}>
                  {obj.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AccountDetails;
