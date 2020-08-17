import React, { useEffect, useState } from 'react';
import { useAccount } from '../../provider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Typography } from '@material-ui/core';

function OrderModal() {
  const account = useAccount();
  const [order, setOrder] = useState<any[]>();

  // useEffect(() => {
  //   if (account.store_id) {
  //     const source = new EventSource(
  //       `http://localhost:4000/api/listen-orders/4746e2a6-c49b-41f5-be38-11792ba591c0?token=${account.token}`
  //     );
  //     source.onmessage = (evt) => handleClickOpen(JSON.parse(evt.data));
  //   }
  // }, []);

  const handleClickOpen = (data: any[]) => {
    setOrder(data);
  };

  const handleClose = () => {
    setOrder(undefined);
  };

  return (
    <Dialog
      fullWidth
      open={Boolean(order)}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{'Παραγγελία'}</DialogTitle>
      <DialogContent>
        {order?.map((obj) => (
          <Typography key={obj.id}>
            {obj.product_name}{' '}
            <Typography
              style={{ marginLeft: '20px' }}
              component="span"
              variant="body2">{`${obj.price} €`}</Typography>
          </Typography>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default OrderModal;
