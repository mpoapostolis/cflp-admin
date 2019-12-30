import React, { useContext, useCallback, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import FilterListIcon from '@material-ui/icons/FilterList';
import { TextField, MenuItem, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import queryString from 'query-string';
import Calendar from 'react-calendar';
import I18n from '../../I18n';
import { FilterType } from './types';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    width: 330,
    padding: 10
  },

  icon: {
    marginRight: theme.spacing(1)
  },

  closeBtnIcon: {
    marginRight: theme.spacing(1)
  }
}));

type Props = {
  filterConf: FilterType[];
  onSubmit: (obj: Record<string, any>) => void;
};

function Filters(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Record<string, any>>({});
  const history = useHistory();
  const t = useContext(I18n);

  const handleChangeValue = useCallback((obj: Record<string, any>) => {
    setState(s => ({ ...s, ...obj }));
  }, []);

  useEffect(() => {
    const params = queryString.parse(history.location.search);
    const keys = props.filterConf
      .map(obj => (obj.type === 'date' ? [obj.keyNameFrom, obj.keyNameTo] : obj.keyName))
      .flatMap(e => e);
    const newState = keys.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: params[curr],
        curr
      }),
      {}
    );
    setState(newState);
  }, [open, history]);

  function getComponent(obj: FilterType) {
    switch (obj.type) {
      case 'select':
        return (
          <TextField
            label={obj.label}
            fullWidth
            select
            margin="dense"
            value={state[obj.keyName] || ''}
            onChange={e => handleChangeValue({ [obj.keyName]: e.target.value })}
            variant="outlined">
            {obj.options.map((obj, idx) => (
              <MenuItem key={idx} value={obj.value}>
                {obj.label}
              </MenuItem>
            ))}
          </TextField>
        );

      case 'date':
        const dateValues =
          state[obj.keyNameFrom] && state[obj.keyNameTo]
            ? [new Date(+state[obj.keyNameFrom]), new Date(+state[obj.keyNameTo])]
            : undefined;

        return (
          <Calendar
            onChange={dates => {
              const d = dates as Date[];
              const from = d[0].getTime();
              const to = d[1].getTime();
              handleChangeValue({
                [obj.keyNameFrom]: from,
                [obj.keyNameTo]: to
              });
            }}
            value={dateValues}
            selectRange
          />
        );

      default:
        break;
    }
  }

  function handleSubmit() {
    const params = queryString.parse(history.location.search);
    const newParams = { ...params, ...state };
    const url = queryString.stringify(newParams);
    history.push(`?${url}`);
    props.onSubmit(state);
    setOpen(false);
  }

  function handleClear() {
    const clearObj = Object.keys(state).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: undefined
      }),
      {}
    );
    setState(clearObj);
  }

  return (
    <>
      <Button onClick={() => setOpen(!open)} color="primary" variant="outlined">
        <FilterListIcon className={classes.icon} />
        {t('int.show-filters')}
      </Button>
      <br />
      <br />

      <Drawer variant="temporary" anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className={classes.list}>
          <Button onClick={() => setOpen(false)}>
            <CloseIcon className={classes.closeBtnIcon} />
            <Typography variant="h6">{t('int.close')}</Typography>
          </Button>
          <br />
          <br />
          <Divider />

          {props.filterConf.map((obj, idx) => (
            <ListItem key={idx}>{getComponent(obj)}</ListItem>
          ))}

          <br />
          <br />

          <ListItem>
            <Button onClick={handleClear} fullWidth color="default" variant="contained">
              <DeleteOutlineIcon className={classes.icon} />
              {t('int.clear')}
            </Button>
          </ListItem>

          <ListItem>
            <Button onClick={handleSubmit} fullWidth color="primary" variant="contained">
              {t('int.apply-filters')}
            </Button>
          </ListItem>
        </div>
      </Drawer>
    </>
  );
}
export default Filters;
