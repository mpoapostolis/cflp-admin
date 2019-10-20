import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import I18n from '../../I18n';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: 'auto'
  },
  red: {
    color: '#f00'
  }
}));

interface IProps {
  tittle: string;
  content: string;
  onSubmit: () => void;
  disabled?: boolean;
  children: JSX.Element;
}
function AlertDialog(props: IProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (!props.disabled) setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.onSubmit();
  };

  const t = useContext(I18n);

  const classes = useStyles();

  return (
    <div>
      <div onClick={handleClickOpen}>{props.children}</div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{props.tittle} </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('int.cancel')}</Button>
          <Button onClick={handleClose} className={classes.red} autoFocus>
            {t('int.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;
