import React, { useContext, useEffect, useState, useCallback } from 'react';
import I18n from '../../I18n';
import {
  Card,
  Typography,
  CardContent,
  TextField,
  Button,
  Divider,
  CardMedia
} from '@material-ui/core';
import {
  cardContainer,
  loginContainer,
  card,
  media,
  content,
  btn
} from './css';
import CardHeader from '@material-ui/core/CardHeader';
import { format } from 'date-fns/esm';
import LockIcon from './LockIcon';
import * as R from 'ramda';
import { useHistory } from 'react-router-dom';
import { useAccount } from '../../provider';
import ky from 'ky';
import { LOGIN } from '../../provider/names';
const dateNow = format(new Date(), 'EEEE dd MMMM yyyy');

const URL = '/api/employees/login';

type Creds = {
  username: string;
  password: string;
};

async function login(creds: Creds) {
  return await ky.post(URL, { json: creds });
}

const Login = () => {
  const t = useContext(I18n);
  const account = useAccount();
  const token = account.token;
  const [infos, setInfos] = useState({
    username: '',
    password: ''
  });
  const [err, setErr] = useState({});

  const handleChange = useCallback((obj) => {
    setInfos((s) => ({ ...s, ...obj }));
  }, []);

  const handleSubmit = useCallback((infos: Creds) => {
    setErr({});
    return login(infos)
      .then((res) => res.json())
      .then((data) => {
        if ('error' in data) setErr(data.error);
        account.dispatch({ type: LOGIN, payload: data });
      })
      .catch((err) => setErr({ ...err }));
  }, []);

  const history = useHistory();
  useEffect(() => {
    if (Boolean(token)) history.push('/');
  }, [token]);

  return (
    <div className={loginContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(infos);
        }}
        className={cardContainer}>
        <LockIcon />
        <Card classes={{ root: card }} elevation={3}>
          <CardContent classes={{ root: content }}>
            <CardHeader
              title={<Typography variant="h3">{t('int.login')}</Typography>}
              subheader={
                <Typography variant="caption">{dateNow}</Typography>
              }></CardHeader>
            <br />
            <br />
            <TextField
              onChange={(evt) =>
                handleChange({
                  username: evt.currentTarget.value
                })
              }
              error={Boolean(R.propOr('', 'username', err))}
              helperText={R.propOr('', 'username', err)}
              label={t('int.username')}
              required
              variant="outlined"
              fullWidth
            />

            <br />
            <TextField
              onChange={(evt) =>
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
              fullWidth
            />
            <br />
            <br />
            <br />
            <Button
              classes={{ root: btn }}
              type="submit"
              size="large"
              variant="contained"
              color="secondary"
              fullWidth>
              {t('int.login')}
            </Button>
          </CardContent>
          <CardMedia
            className={media}
            image="https://source.unsplash.com/random/800x600/?inspiration"
          />
          <Divider />
        </Card>
      </form>
    </div>
  );
};

export default Login;
