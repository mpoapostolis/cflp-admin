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
import { getPendingNotification } from '../../api/notification';

import { useAccount } from '../../provider';
import { LOGOUT } from '../../provider/names';

import { useQuery } from 'react-query';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

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

  const account = useAccount();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: notf = { totalUnread: 0 } } = useQuery(
    'pending-notifications',
    getPendingNotification
  );

  const t = useContext(I18n);
  return (
    <AppBar
      style={{
        background: '#486493'
      }}
      elevation={0}>
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
            badgeContent={notf.totalUnread}
            classes={{
              badge: css`
                background: #dc0f77;
                color: white;
              `
            }}>
            <Link to="/orders">
              <Notifications htmlColor="#fff" />
            </Link>
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
