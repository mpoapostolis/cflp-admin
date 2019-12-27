import React, { useState, useContext, useCallback, useEffect } from 'react';
import I18n from '../../I18n';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/account';
import { IReduxStore } from '../../redux/reducers';
import {
  Card,
  Typography,
  CardContent,
  TextField,
  CardActionArea,
  Button,
  CardActions,
  Divider,
  CardMedia,
  Box
} from '@material-ui/core';
import { cardContainer, loginContainer, svg, card, media, content } from './css';
import CardHeader from '@material-ui/core/CardHeader';
import { format } from 'date-fns/esm';

const dateNow = format(new Date(), 'EEEE dd MMMM yyyy');

const Login = () => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState('');

  const [infos, setInfos] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState({
    error_description: ''
  });

  function toggleForgotPassword() {
    setInfos({
      username: '',
      password: ''
    });
    setEmail('');
    setError({
      error_description: ''
    });
    setForgotPassword(!forgotPassword);
  }

  const t = useContext(I18n);

  const handleChange = React.useCallback((obj: Record<string, any>) => {
    setInfos(s => ({ ...s, ...obj }));
  }, []);

  const dispatch = useDispatch();

  const _signIn = useCallback(
    payload => {
      dispatch(login(payload));
    },
    [dispatch]
  );

  const history = useHistory();

  const account = useSelector((store: IReduxStore) => store.account);
  return (
    <div className={loginContainer}>
      <div className={cardContainer}>
        <svg className={svg} height={24} width={24} viewBox="0 0 24 24">
          <path
            fill="#fff"
            d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
        </svg>
        <Card classes={{ root: card }} elevation={3}>
          <CardContent classes={{ root: content }}>
            <CardHeader subheader={dateNow} title={t('int.login')}>
              <Typography variant="body2"></Typography>
            </CardHeader>
            <Box>
              <TextField label={t('int.username')} required variant="outlined" fullWidth></TextField>
              <br />
              <br />
              <TextField label={t('int.password')} required variant="outlined" fullWidth></TextField>
            </Box>
            <br />
            <Button fullWidth>{t('int.login')}</Button>
          </CardContent>
          <CardMedia className={media} image="https://source.unsplash.com/random/800x600/?inspiration" /> <Divider />
        </Card>
      </div>
    </div>
  );
};

export default Login;
