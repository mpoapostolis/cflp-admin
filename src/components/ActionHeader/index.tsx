import React, { ReactNode, useContext } from 'react';
import { Card, Theme, Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import I18n from '../../I18n';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    background: 'transpartent',
    height: '60px'
  },
  spacer: {
    marginLeft: 'auto'
  }
}));

type Props = {
  children: ReactNode;
};

function ActionHeader(props: Props) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.header}>
      <IconButton onClick={() => history.goBack()}>
        <ArrowBackIcon />
      </IconButton>

      <span className={classes.spacer} />
      {props.children}
    </div>
  );
}
export default ActionHeader;
