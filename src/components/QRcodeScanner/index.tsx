import React, { useState } from 'react';

import { Dialog, Avatar, IconButton, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import queryString from 'query-string';
import QrReader from 'react-qr-reader';
import useApi from '../../Hooks';
import { product } from 'ramda';
import LinkedCameraIcon from '@material-ui/icons/LinkedCamera';
import { red } from '@material-ui/core/colors';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 'none',
    marginRight: '10px'
  },
  small: {
    width: theme.spacing(4),
    background: '#fffa',
    padding: '5px',
    height: theme.spacing(4)
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    width: 'inherit',
    maxWidth: 'unset'
  }
}));

function QRcodeScanner(props: {}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const api = useApi();
  function handleScan(params: any) {
    if (params) {
      const data = queryString.parse(params);

      if ('productId' in data) {
        api.post('/api/bo/transactions/product', {
          json: data
        });
      }

      if ('offerId' in data) {
        api.post('/api/bo/transactions/offer', {
          json: data
        });
      }

      toast.success('ok');

      setOpen(false);
    }
  }
  function handleError(err: any) {
    console.error(err);
  }
  const classes = useStyles();
  return (
    <>
      <IconButton className={classes.root} onClick={handleClickOpen}>
        <LinkedCameraIcon htmlColor={red[100]} />
      </IconButton>
      <Dialog classes={classes} onClose={handleClose} open={open}>
        <QrReader
          delay={500}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '70vw' }}
        />
      </Dialog>
    </>
  );
}

export default QRcodeScanner;
