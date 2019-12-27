import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Hidden } from '@material-ui/core';

type Props = {
  setOpen: () => void;
};
function Header(props: Props) {
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Hidden mdUp>
          <IconButton onClick={props.setOpen} edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
