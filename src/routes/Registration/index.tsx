import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import I18n from '../../I18n';
import { useHistory } from 'react-router';
import queryString from 'query-string';

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

function callToLogin(props: { token: string; password: string }) {
  return fetch('/api/users/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic c2FmY28tcmVwb3J0cy1hcHA6czRmYzAtcjNwMHJ0cy00cHA='
    },
    body: JSON.stringify(props)
  });
}

const Registration = () => {
  const history = useHistory();
  const token = (queryString.parse(history.location.search).token as string) || '';

  const classes = useStyles();

  const [infos, setInfos] = useState({
    password: '',
    retypePassword: ''
  });

  const [error, setError] = useState({
    password: undefined
  });

  const t = useContext(I18n);

  const handleChange = React.useCallback((obj: Record<string, any>) => {
    setInfos(s => ({ ...s, ...obj }));
  }, []);

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
                <Typography className={classes.title} variant="h2">
                  {t('int.welcome')}
                </Typography>
                <TextField
                  className={classes.textField}
                  fullWidth
                  label={t('int.password')}
                  error={Boolean(error.password)}
                  onChange={e => handleChange({ password: e.currentTarget.value })}
                  type="password"
                  value={infos.password}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  error={Boolean(error.password)}
                  label={t('int.retype-password')}
                  onChange={e => handleChange({ retypePassword: e.currentTarget.value })}
                  type="password"
                  value={infos.retypePassword}
                  variant="outlined"
                />
                <Button
                  className={classes.signInButton}
                  disabled={infos.password !== infos.retypePassword || (!infos.password && !infos.retypePassword)}
                  color="primary"
                  fullWidth
                  onClick={() => {
                    callToLogin({
                      token,
                      password: infos.password
                    })
                      .then(e => {
                        if (+e.status > 399) {
                          throw e;
                        } else {
                          history.push('/');
                        }
                      })
                      .catch(async err => {
                        const res = await err.json();
                        setError(res.fieldErrors);
                      });
                  }}
                  size="large"
                  type="submit"
                  variant="contained">
                  {t('int.register')}
                </Button>
                <Typography style={{ color: '#f00' }}>{error.password}</Typography>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Registration;
