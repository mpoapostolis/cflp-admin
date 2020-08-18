import React, { useState, useEffect } from 'react';
import { useAccount } from '../../provider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Typography } from '@material-ui/core';

function OrderModal(props: {
  handleClickOpen: (data: any[]) => void;
  handleClose: () => void;
  order?: any[];
}) {
  return (
    <Dialog
      fullWidth
      open={Boolean(props.order)}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{'Παραγγελία'}</DialogTitle>
      <DialogContent>
        {props.order?.map((obj) => (
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
        <Button onClick={props.handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={props.handleClose} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default OrderModal;
