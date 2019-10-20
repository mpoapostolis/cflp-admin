import React from 'react';
import Dialog from '@material-ui/core/Dialog';

interface IProps {
  children: JSX.Element;
  path?: string;
}

function ImageModal(props: IProps) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{props.children}</div>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <img style={{ border: 'solid 1px #fff' }} src={`/static/uploads/${props.path}`}></img>
      </Dialog>
    </div>
  );
}

export default ImageModal;
