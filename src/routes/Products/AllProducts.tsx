import React, { useContext } from 'react';
import { Card, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import I18n from '../../I18n';

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
  }
}));

function AllProducts() {
  const classes = useStyles();
  const t = useContext(I18n);
  return (
    <>
      <Card className={classes.header}>
        <div style={{ marginRight: '20px' }}>
          <Typography variant="caption">{t('int.airport')}</Typography>
          <br />
          <Typography>{'airport'}</Typography>
        </div>

        <div style={{ marginRight: '20px' }}>
          <Typography variant="caption">{t('int.airport')}</Typography>
          <br />
          <Typography>{'airport'}</Typography>
        </div>
        <div style={{ marginRight: '20px' }}>
          <Typography variant="caption">{t('int.airport')}</Typography>
          <br />
          <Typography>{'airport'}</Typography>
        </div>
        <div style={{ marginRight: '20px' }}>
          <Typography variant="caption">{t('int.airport')}</Typography>
          <br />
          <Typography>{'airport'}</Typography>
        </div>
      </Card>
    </>
  );
}

export default AllProducts;
