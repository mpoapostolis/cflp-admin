import React, { useState, useContext, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Hidden,
  Typography,
  Theme,
  ListItemIcon,
  Popover,
  ListItem,
  List,
  Divider,
  ListItemText,
  Avatar,
  Badge
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Notifications from '@material-ui/icons/Notifications';
import I18n from '../../I18n';

import QRCodeScanner from '../QRcodeScanner';
import { useAccount } from '../../provider';
import { LOGOUT } from '../../provider/names';
import { css } from 'emotion';
import api from '../../ky';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    xx: {
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

type Props = {
  setOpen: () => void;
};
function Header(props: Props) {
  const classes = useStyles();
  const [notf, setNotf] = useState(0);

  const account = useAccount();

  const getNotf = async () => {
    const res = await api.get('/api/orders/pending');
    const data = await res.json();
    setNotf(data.total);
  };
  useEffect(() => {
    if (account.store_id) {
      const source = new EventSource(
        `http://localhost:4000/api/listen-orders/4746e2a6-c49b-41f5-be38-11792ba591c0?token=${account.token}`
      );
      source.onmessage = () => {
        getNotf();
      };
    }
    getNotf();
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const t = useContext(I18n);
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            onClick={props.setOpen}
            edge="start"
            color="inherit"
            aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h6" className={classes.title}></Typography>

        <IconButton aria-label="cart">
          <Badge
            badgeContent={notf}
            classes={{
              badge: css`
                background: #dc0f77;
                color: white;
              `
            }}>
            <Notifications htmlColor="#fff" />
          </Badge>
        </IconButton>

        {account.token && (
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit">
            <Avatar className={classes.xx} />
          </IconButton>
        )}
        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem onClick={() => account.dispatch({ type: LOGOUT })} button>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={t('int.logout')} />
            </ListItem>
          </List>
          <Divider />
        </Popover>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
