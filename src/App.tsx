import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import { useSelector } from 'react-redux';
import I18n from './I18n';
import { IReduxStore } from './redux/reducers';
import * as R from 'ramda';
import Login from './routes/Login';
import Layout from './Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [translations, lang] = useSelector((store: IReduxStore) => [
    store.i18n.translations,
    store.i18n.lang
  ]);
  const t = (key: string) => {
    return R.pathOr(key, [key, lang], translations);
  };

  return (
    <ThemeProvider theme={theme}>
      <I18n.Provider value={t}>
        <BrowserRouter>
          <Switch>
            <Route path="/login" exact component={Login} />
            <PrivateRoute path="/" component={Layout} />
          </Switch>
        </BrowserRouter>
      </I18n.Provider>
    </ThemeProvider>
  );
}

export default App;
