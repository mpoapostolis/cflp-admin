import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  RouteProps
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import I18n from './I18n';
import Login from './routes/Login';
import Layout from './Layout';
import PrivateRoute from './components/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import AccountProvider, { useAccount } from './provider';
toast.configure();

function LoginWrapper(props: RouteProps) {
  const account = useAccount();
  return account.token ? <Redirect to="/" /> : <Route {...props} />;
}

function App() {
  const t = (key: string) => key;

  return (
    <ThemeProvider theme={theme}>
      <I18n.Provider value={t}>
        <AccountProvider>
          <BrowserRouter>
            <Switch>
              <LoginWrapper exact path="/login" component={Login} />
              <PrivateRoute path="/" component={Layout} />
            </Switch>
          </BrowserRouter>
        </AccountProvider>
      </I18n.Provider>
    </ThemeProvider>
  );
}

export default App;
