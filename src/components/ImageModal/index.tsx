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
  onClose: () => void;
}

function ImageModal(props: IProps) {
  const [open, setOpen] = useState();
  const classes = useStyles();

  useEffect(() => {
    setOpen(Boolean(props.src));
  }, [props.src]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  return (
    <Dialog classes={classes} onClose={handleClose} open={open}>
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
