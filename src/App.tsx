import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import Routes from './routes';
import { useSelector } from 'react-redux';
import I18n from './I18n';
import { IReduxStore } from './redux/reducers';
import * as R from 'ramda';
import Login from './routes/Login';

function App() {
  const [translations, lang] = useSelector((store: IReduxStore) => [store.i18n.translations, store.i18n.lang]);
  const t = (key: string) => {
    return R.pathOr(key, [key, lang], translations);
  };

  return (
    <ThemeProvider theme={theme}>
      <I18n.Provider value={t}>
        <BrowserRouter>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/" render={() => <Routes />} />
          </Switch>
        </BrowserRouter>
      </I18n.Provider>
    </ThemeProvider>
  );
}

export default App;
