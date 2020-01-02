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
  const [infos, setInfos] = useState({
    name: objParams.name,
    price: Number(objParams.price),
    lpReward: Number(objParams.lpReward)
  });

  const _setInfos = useCallback(
    obj => {
      setInfos(s => ({ ...s, ...obj }));
    },
    [objParams]
  );

  const _setParam = useCallback(obj => {
    const url = queryString.stringify({ ...objParams, ...obj });
    history.replace(`?${url}`);
  }, []);

  const t = useContext(I18n);

  const api = useApi();

  const createNew = useCallback(
    async (infos: Record<string, any>) => {
      api.post('/api/bo/products', {
        json: infos
      });
    },
    [api]
  );

  return (
    <Card>
      <CardHeader
        subheader={t('int.edit-answers')}
        title={t('int.answers')}></CardHeader>
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
              onChange={evt => _setInfos({ name: evt.currentTarget.value })}
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
              onChange={evt => _setInfos({ price: +evt.currentTarget.value })}
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
              onChange={evt =>
                _setInfos({ lpReward: +evt.currentTarget.value })
              }
              required
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <span className={classes.spacer}></span>
        <Button
          onClick={() => createNew(infos)}
          color="primary"
          variant="outlined">
          {t('int.save')}
        </Button>
      </CardActions>
    </Card>
  );
}

export default AccountDetails;
