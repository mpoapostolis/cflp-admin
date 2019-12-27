import React, { useContext } from 'react';
import I18n from '../../I18n';
import { Card, Typography, CardContent, TextField, Button, Divider, CardMedia, Box } from '@material-ui/core';
import { cardContainer, loginContainer, card, media, content } from './css';
import CardHeader from '@material-ui/core/CardHeader';
import { format } from 'date-fns/esm';
import LockIcon from './LockIcon';

const dateNow = format(new Date(), 'EEEE dd MMMM yyyy');

const Login = () => {
  const t = useContext(I18n);

  return (
    <div className={loginContainer}>
      <div className={cardContainer}>
        <LockIcon />
        <Card classes={{ root: card }} elevation={3}>
          <CardContent classes={{ root: content }}>
            <CardHeader
              title={<Typography variant="h3">{t('int.login')}</Typography>}
              subheader={<Typography variant="caption">{dateNow}</Typography>}></CardHeader>
            <Box>
              <TextField label={t('int.username')} required variant="outlined" fullWidth></TextField>
              <br />
              <br />
              <TextField label={t('int.password')} required variant="outlined" fullWidth></TextField>
            </Box>
            <Button variant="contained" color="secondary" fullWidth>
              {t('int.login')}
            </Button>
          </CardContent>
          <CardMedia className={media} image="https://source.unsplash.com/random/800x600/?inspiration" />
          <Divider />
        </Card>
      </div>
    </div>
  );
};

export default Login;
