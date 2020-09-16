import React, { useState, useEffect, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

export type Props = {
  src?: string;
  children: ReactNode;
  className?: string;
};

function ImageModal(props: Props) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={props.className} onClick={handleClickOpen}>
        {props.children}
      </div>
      <Dialog onClose={handleClose} open={open}>
        <img
          style={{
            width: '100%',
            height: '100%'
          }}
          src={props.src}></img>
      </Dialog>
    </>
  );
}

export default ImageModal;
