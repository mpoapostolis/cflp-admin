import React, { useState, useContext, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Hidden,
  Typography,
  Theme,
  Menu,
  MenuItem,
  ListItemIcon,
  Popover,
  ListItem,
  List,
  Divider,
  ListItemText
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import I18n from '../../I18n';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxStore } from '../../redux/reducers';
import { useHistory } from 'react-router-dom';
import { logout } from '../../redux/actions/account';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
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

  const history = useHistory();
  const token = useSelector((store: IReduxStore) => store.account.token);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const _logout = React.useCallback(() => dispatch(logout()), [dispatch]);

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
        <Typography variant="h6" className={classes.title}>
          News
        </Typography>
        {token && (
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit">
            <AccountCircle />
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
            <ListItem onClick={_logout} button>
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
