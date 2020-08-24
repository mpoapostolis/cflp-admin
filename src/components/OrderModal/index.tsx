import React, { useState, useEffect, useMemo } from 'react';
import { useAccount } from '../../provider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  List,
  Divider
} from '@material-ui/core';
import { useMutation, queryCache } from 'react-query';
import { approveOrder } from '../../api/notification';

function OrderModal(props: {
  handleClickOpen: (data: any[]) => void;
  handleClose: () => void;
  orderId?: string;
  orderName?: string;
  status?: string;
  order?: any[];
}) {
  const uniqCartItems = useMemo(() => {
    return new Set(
      props.order?.map((o) => ({
        id: o.id,
        product_name: o.product_name,
        price: o.price
      }))
    );
  }, [props.order]);

  const list: Record<
    string,
    { total: string; price: number; id: string }
  > = useMemo(() => {
    return Array.from(uniqCartItems).reduce((acc, curr) => {
      const total =
        props?.order?.filter((obj) => obj.id === curr.id).length ?? 1;
      return {
        ...acc,
        [curr.product_name]: { total, price: total * curr.price, id: curr.id }
      };
    }, {});
  }, [uniqCartItems, props.order]);

  const [_approveOrder] = useMutation(approveOrder, {
    onSuccess: () => {
      queryCache.invalidateQueries('pending-notifications');
      queryCache.invalidateQueries('notifications');
      props.handleClose();
    }
  });

  return (
    <Dialog
      fullWidth
      open={Boolean(props.order)}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{`Παραγγελία: ${props.orderName}`}</DialogTitle>
      <DialogContent>
        <List>
          {Object.keys(list).map((product_name) => (
            <ListItem key={product_name}>
              <ListItemText
                primary={
                  <>
                    <Typography component={'span'} variant="h6">
                      {product_name}
                    </Typography>
                    <Typography
                      component={'span'}
                      style={{ marginLeft: '5px' }}
                      variant="body2">
                      x{list[product_name].total}{' '}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Typography variant="h6">
                  {list[product_name].price.toFixed(2)}€
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <Divider />
          <ListItem>
            <ListItemText
              primary={<Typography variant="h6">Σύνολο</Typography>}
            />
            <ListItemSecondaryAction>
              <Typography variant="h6">
                {Object.keys(list)
                  .reduce((acc, curr) => acc + list[curr].price, 0)
                  .toFixed(2)}
                €
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </DialogContent>
      {/* {props.status !== 'complete' && (
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Ακυρωση
          </Button>
          <Button
            onClick={() => _approveOrder(props.orderId ?? '')}
            color="primary"
            autoFocus>
            Εγκριση
          </Button>
        </DialogActions>
      )} */}
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Ακυρωση
        </Button>
        <Button
          onClick={() => _approveOrder(props.orderId ?? '')}
          color="primary"
          autoFocus>
          Εγκριση
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default OrderModal;
