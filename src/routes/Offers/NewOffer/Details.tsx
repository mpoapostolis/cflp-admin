import React, { useContext, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import I18n from '../../../I18n';
import useApi from '../../../Hooks';
import { useSelector } from 'react-redux';
import { IReduxStore } from '../../../redux/reducers';
import { useHistory } from 'react-router';
import queryString from 'query-string';
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
  const errors = useSelector((store: IReduxStore) => store.errors);

  const _setParam = useCallback(obj => {
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
              onChange={evt => _setParam({ name: evt.currentTarget.value })}
              helperText={R.propOr('', 'name', errors)}
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
              error={Boolean(R.prop('price', errors))}
              helperText={R.propOr('', 'price', errors)}
              onChange={evt => _setParam({ price: +evt.currentTarget.value })}
              type={'number'}
              label={t('int.price')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              value={R.propOr('', 'lpReward', infos)}
              fullWidth
              error={Boolean(R.prop('lpReward', errors))}
              helperText={R.propOr('', 'lpReward', errors)}
              label={t('int.lpReward')}
              margin="dense"
              onChange={evt =>
                _setParam({ lpReward: +evt.currentTarget.value })
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
