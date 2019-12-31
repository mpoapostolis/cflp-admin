import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

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

export interface IProps {
  src?: string;
  open: boolean;
  onClose: () => void;
}

function ImageModal(props: IProps) {
  const classes = useStyles();

  return (
    <Dialog classes={classes} onClose={props.onClose} open={props.open}>
      <img
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
        src={props.src}></img>
    </Dialog>
  );
}

export default ImageModal;
