import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import Routes from './routes';
import { useSelector } from 'react-redux';
import { IReduxStore } from './redux/reducers';
import I18n from './I18n';

const browserHistory = createBrowserHistory();

function App() {
  const [translations, lang] = useSelector((store: IReduxStore) => [store.i18n.translations, store.i18n.lang]);
  const t = (key: string) => {
    return translations[key] ? translations[key][lang] : key;
  };

  return (
    <ThemeProvider theme={theme}>
      <I18n.Provider value={t}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </I18n.Provider>
    </ThemeProvider>
  );
}

export default App;
