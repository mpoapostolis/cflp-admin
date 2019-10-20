import palette from './palette';
import overrides from './overrides';
import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette,
  overrides,
  zIndex: {
    drawer: 1100
  }
});

export default theme;
