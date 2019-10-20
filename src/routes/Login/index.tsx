import React, { useState, useContext, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import I18n from '../../I18n';
import { useHistory } from 'react-router';
import { parseJwt } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/account';
import { IReduxStore } from '../../redux/reducers';

function callToLogin(creds: { username: string; password: string }) {
  return fetch('/api/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic c2FmY28tcmVwb3J0cy1hcHA6czRmYzAtcjNwMHJ0cy00cHA='
    },
    body: `username=${creds.username}&password=${creds.password}&grant_type=password`
  });
}

function forgotPasswordCall(username: string) {
  return fetch('/api/users/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic c2FmY28tcmVwb3J0cy1hcHA6czRmYzAtcjNwMHJ0cy00cHA='
    },
    body: JSON.stringify({
      username: username,
      origin: 'ADMIN'
    })
  });
}

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between;'
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },

  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const Login = () => {
  const classes = useStyles();

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

  useEffect(() => {
    if (account.access_token) {
      history.push('/');
    }
  }, [account]);

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote} />
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <div className={classes.form}>
                <Typography className={classes.title} variant="h4">
                  {forgotPassword ? t('int.please-enter-username') : t('int.sign-in')}
                </Typography>
                {forgotPassword ? (
                  <TextField
                    className={classes.textField}
                    fullWidth
                    label={t('int.email')}
                    onChange={e => setEmail(e.currentTarget.value)}
                    value={email}
                    variant="outlined"
                  />
                ) : (
                  <>
                    <TextField
                      className={classes.textField}
                      fullWidth
                      label={t('int.username')}
                      onChange={e => handleChange({ username: e.currentTarget.value })}
                      value={infos.username}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      fullWidth
                      onKeyDown={e => {
                        e.key === 'Enter' &&
                          callToLogin(infos)
                            .then(async e => {
                              if (+e.status > 399) {
                                throw e;
                              } else {
                                const info = await e.json();
                                const { exp, user_name, client_id } = parseJwt(info.access_token);
                                _signIn({ ...info, exp, user_name, client_id });
                              }
                            })
                            .catch(async err => {
                              const res = await err.json();
                              console.log(res);
                              setError(res);
                            });
                      }}
                      label={t('int.password')}
                      onChange={e => handleChange({ password: e.currentTarget.value })}
                      type="password"
                      value={infos.password}
                      variant="outlined"
                    />
                  </>
                )}
                <Button
                  className={classes.signInButton}
                  disabled={!forgotPassword && (infos.username.length < 3 || infos.password.length < 3)}
                  color="primary"
                  fullWidth
                  onClick={() => {
                    forgotPassword
                      ? forgotPasswordCall(email)
                      : callToLogin(infos)
                          .then(async e => {
                            if (+e.status > 399) {
                              throw e;
                            } else {
                              const info = await e.json();
                              const { exp, user_name, client_id } = parseJwt(info.access_token);
                              _signIn({ ...info, exp, user_name, client_id });
                            }
                          })
                          .catch(async err => {
                            const res = await err.json();
                            console.log(res);
                            setError(res);
                          });
                  }}
                  size="large"
                  type="submit"
                  variant="contained">
                  {forgotPassword ? t('int.send-username') : t('int.register')}
                </Button>
                <div className={classes.flex}>
                  <Typography style={{ color: '#f00' }}>{t(error.error_description)}</Typography>
                  <Button onClick={() => toggleForgotPassword()} color="primary">
                    {forgotPassword ? t('int.sign-in') : t('int.forgot-password')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
