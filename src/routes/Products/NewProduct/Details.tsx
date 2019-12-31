import React, { useState, useContext, useCallback } from 'react';
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

const useStyles = makeStyles(() => ({
  cardContent: {
    minHeight: '167px'
  },

  spacer: {
    flexGrow: 1
  }
}));

// name: string
// price: number
// lpReward: number
// images: string[]

function AccountDetails() {
  const classes = useStyles();

  const t = useContext(I18n);

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
              label={t('int.name')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label={t('int.price')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label={t('int.lpReward')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label={t('int.result')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <span className={classes.spacer}></span>
        <Button color="primary" variant="outlined">
          {t('int.save')}
        </Button>
      </CardActions>
    </Card>
  );
}

export default AccountDetails;
