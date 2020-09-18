import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography, Theme } from '@material-ui/core';
import { useAccount } from '../../provider';
import { useQuery } from 'react-query';
import { getStoreInfos } from '../../api/stores';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginBottom: theme.spacing(1)
  },
  storeName: {
    fontWeight: 'bolder',
    marginTop: theme.spacing(1)
  }
}));

function Profile() {
  const classes = useStyles();
  const account = useAccount();

  const { data: infos = { debits: 0, credits: 0 } } = useQuery(
    'storeInfos',
    getStoreInfos
  );

  return (
    <div className={classes.root}>
      <Avatar
        alt="Person"
        to="/settings"
        className={classes.avatar}
        component={RouterLink}
        src={'/images/avatar.png'}
      />

      <br />
      <Typography className={classes.storeName} variant="h4">
        {infos.name}
      </Typography>
      <Typography variant="body2">{account.email}</Typography>
    </div>
  );
}

export default Profile;
