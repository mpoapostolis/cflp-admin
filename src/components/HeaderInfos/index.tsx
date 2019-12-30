import React, { useContext } from 'react';
import { Card, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    padding: '0 15px 0 15px',
    alignItems: 'center',
    background: '#fff',
    height: '60px'
  },
  spacer: {
    marginLeft: 'auto'
  },
  giveMeMargin: { marginRight: '20px' }
}));

type Props = {
  filters: { label: string; value: any }[];
};

function HeaderInfos(props: Props) {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.header}>
        {props.filters.map((obj, idx) => (
          <div key={idx} className={classes.giveMeMargin}>
            <Typography variant="caption">{obj.label}</Typography>
            <br />
            <Typography>{obj.value}</Typography>
          </div>
        ))}
        <span className={classes.spacer} />
      </Card>
    </>
  );
}

export default HeaderInfos;
