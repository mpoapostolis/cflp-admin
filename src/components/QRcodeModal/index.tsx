import React, { useState } from 'react';
import QRcode from 'qrcode.react';
import { Button, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import queryString from 'query-string';

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

function QRCodeModal(props: {
  productId: string;
  offerId?: string;
  storeId?: string;
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const url = queryString.stringify(props);

  const classes = useStyles();
  return (
    <>
      <Button onClick={handleClickOpen}>Generate QrCode</Button>
      <Dialog classes={classes} onClose={handleClose} open={open}>
        <QRcode size={500} value={url} />
      </Dialog>
    </>
  );
}

export default QRCodeModal;
