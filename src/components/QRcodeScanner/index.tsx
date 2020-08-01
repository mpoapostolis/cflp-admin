import React, { useState } from 'react';

import { Dialog, IconButton, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import queryString from 'query-string';
import QrReader from 'react-qr-reader';
import LinkedCameraIcon from '@material-ui/icons/LinkedCamera';
import { red } from '@material-ui/core/colors';
import { toast } from 'react-toastify';
import api from '../../ky';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 'none',
    marginRight: '10px'
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

  function handleScan(params: any) {
    if (params) {
      const data = queryString.parse(params);

      if ('productId' in data) {
        api.post('/api/transactions/product', {
          json: data
        });
      }

      if ('offerId' in data) {
        api.post('/api/transactions/offer', {
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
