import React, { useState } from 'react';

import { Dialog, Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import queryString from 'query-string';
import QrReader from 'react-qr-reader';

const useStyles = makeStyles({
  root: {
    maxWidth: 'none'
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    width: 'inherit',
    maxWidth: 'unset'
  }
});

function QRcodeScanner(props: {}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const url = queryString.stringify(props);

  function handleScan(data: any) {
    if (data) {
      console.log(data);
    }
  }
  function handleError(err: any) {
    console.error(err);
  }
  const classes = useStyles();
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Avatar />
      </IconButton>
      <Dialog classes={classes} onClose={handleClose} open={open}>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '45vw' }}
        />
      </Dialog>
    </>
  );
}

export default QRcodeScanner;
