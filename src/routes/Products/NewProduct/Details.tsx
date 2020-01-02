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
  const [infos, setInfos] = useState({});

  const _setInfos = useCallback(obj => {
    setInfos(s => ({ ...s, ...obj }));
  }, []);

  const t = useContext(I18n);

  const api = useApi();

  const createNew = useCallback(
    infos => {
      api
        .post('/api/bo/products', {
          body: JSON.stringify(infos)
        })
        .json();
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
              fullWidth
              onChange={evt => _setInfos({ name: evt.currentTarget.value })}
              label={t('int.name')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              onChange={evt => _setInfos({ price: evt.currentTarget.value })}
              type={'number'}
              label={t('int.price')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              type={'number'}
              label={t('int.lpReward')}
              margin="dense"
              onChange={evt => _setInfos({ lpReward: evt.currentTarget.value })}
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
