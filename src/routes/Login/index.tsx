import React, { useContext, useState, useCallback } from 'react';
import I18n from '../../I18n';
import { Card, Typography, CardContent, TextField, Button, Divider, CardMedia, Box } from '@material-ui/core';
import { cardContainer, loginContainer, card, media, content } from './css';
import CardHeader from '@material-ui/core/CardHeader';
import { format } from 'date-fns/esm';
import LockIcon from './LockIcon';
import * as R from 'ramda';
import ky from 'ky';

const dateNow = format(new Date(), 'EEEE dd MMMM yyyy');

const Login = () => {
  const t = useContext(I18n);

  const [infos, setInfos] = useState({
    username: '',
    password: ''
  });
  const [err, setErr] = useState({});

  const handleChange = useCallback(obj => {
    setInfos(s => ({ ...s, ...obj }));
  }, []);

  const handleSubmit = useCallback(obj => {
    ky.post('/api/auth/login?user_type=employee', { json: obj }).catch(e => console.log(e));
  }, []);

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
              <TextField
                onChange={evt =>
                  handleChange({
                    username: evt.currentTarget.value
                  })
                }
                error={Boolean(R.propOr('', 'username', err))}
                helperText={R.propOr('', 'username', err)}
                label={t('int.username')}
                required
                variant="outlined"
                fullWidth></TextField>
              <br />
              <br />
              <TextField
                onChange={evt =>
                  handleChange({
                    password: evt.currentTarget.value
                  })
                }
                type="password"
                error={Boolean(R.propOr('', 'password', err))}
                helperText={R.propOr('', 'password', err)}
                label={t('int.password')}
                required
                variant="outlined"
                fullWidth></TextField>
            </Box>
            <Button onClick={() => handleSubmit(infos)} variant="contained" color="secondary" fullWidth>
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
