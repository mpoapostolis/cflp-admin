import React, { ReactNode } from 'react';
import { Card, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
  return (
    <div className={classes.header}>
      <span className={classes.spacer} />
      {props.children}
    </div>
  );
}
export default ActionHeader;
