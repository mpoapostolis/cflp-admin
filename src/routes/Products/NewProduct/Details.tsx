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
    height: '167px'
  }
}));

function AccountDetails() {
  const classes = useStyles();

  const t = useContext(I18n);

  return (
    <Card>
      <CardHeader
        action={
          <Button color="primary" variant="outlined">
            Save
          </Button>
        }
        subheader={t('int.edit-answers')}
        title={t('int.answers')}></CardHeader>
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label={t('int.result')}
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
      <CardActions></CardActions>
    </Card>
  );
}

export default AccountDetails;
