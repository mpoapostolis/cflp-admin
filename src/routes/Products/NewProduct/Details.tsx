import React, { useContext, useCallback, useState } from 'react';
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

function AccountDetails() {
  const classes = useStyles();
  const errors = useSelector((store: IReduxStore) => store.errors);
  const history = useHistory();
  const params = history.location.search;
  const objParams = queryString.parse(params);

  const _setParam = useCallback(
    obj => {
      const url = queryString.stringify({ ...objParams, ...obj });
      history.replace(`?${url}`);
    },
    [params]
  );

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
              defaultValue={objParams['name']}
              fullWidth
              error={Boolean(R.prop('name', errors))}
              onBlur={evt => _setParam({ name: evt.currentTarget.value })}
              helperText={R.propOr('', 'name', errors)}
              label={t('int.name')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              defaultValue={objParams['price']}
              fullWidth
              error={Boolean(R.prop('price', errors))}
              helperText={R.propOr('', 'price', errors)}
              onBlur={evt => _setParam({ price: +evt.currentTarget.value })}
              type={'number'}
              label={t('int.price')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              defaultValue={objParams['lpReward']}
              fullWidth
              error={Boolean(R.prop('lpReward', errors))}
              helperText={R.propOr('', 'lpReward', errors)}
              label={t('int.lpReward')}
              margin="dense"
              onBlur={evt => _setParam({ lpReward: +evt.currentTarget.value })}
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
