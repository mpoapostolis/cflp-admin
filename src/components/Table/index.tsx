import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { TextField, InputAdornment } from '@material-ui/core';
import I18n from '../../I18n';
import SearchIcon from '@material-ui/icons/Search';
import { Columns, Data } from './types';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import * as R from 'ramda';
import { debounce } from '../../utils';
import { cx } from 'emotion';

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 20px)',
    padding: '10px'
  },
  container: {
    maxHeight: `59vh`
  },
  searchTermCont: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  textField: {
    width: '200px'
  },
  underline: {
    '&::before': {
      borderBottom: 'solid 1px #0002'
    },
    '&::after': {
      borderBottom: 'solid 1px #000a'
    },
    '&:hover': {
      '&::before': {
        borderBottom: 'solid 1px #0005 !important'
      }
    }
  }
});

type Props = {
  columns: Columns;
  data: Data;
  offset: number;
  limit: number;
  total: number;
  onChange: (e: Record<string, any>) => void;
};

function MaterialTable(props: Props) {
  const classes = useStyles();

  const t = useContext(I18n);
  const history = useHistory();
  const debouncePush = debounce(history.push, 200);
  const params = queryString.parse(history.location.search);

  const filters = {
    offset: params.offset,
    limit: params.limit,
    searchTerm: params.searchTerm
  };
  function handleChange(obj: Record<string, any>) {
    const url = queryString.stringify({ ...params, ...obj });
    props.onChange({ ...filters, ...obj });
    debouncePush(`?${url}`);
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.searchTermCont}>
        <TextField
          InputProps={{
            classes: { underline: classes.underline },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          className={cx(classes.textField, 'without-padding')}
          defaultValue={R.propOr('', 'searchTerm', params)}
          onChange={evt => {
            const searchTerm =
              evt.currentTarget.value === ''
                ? undefined
                : evt.currentTarget.value;
            handleChange({ searchTerm });
          }}
          placeholder={t('int.search')}
        />
      </div>
      <br />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column, idx) => (
                <TableCell key={idx} align={'left'}>
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((row, idx) => (
              <TableRow key={idx} hover role="checkbox" tabIndex={-1}>
                {props.columns.map((column, idx) => (
                  <TableCell key={idx}>
                    {'render' in column
                      ? column.render(column, idx)
                      : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.total}
        rowsPerPage={Number(params.limit) || 10}
        page={Number(params.offset) || 0}
        onChangePage={(_, offset) => {
          handleChange({ offset: +offset });
        }}
        onChangeRowsPerPage={evt => {
          handleChange({
            offset: 0,
            limit: +evt.target.value
          });
        }}
      />
    </Paper>
  );
}
export default MaterialTable;
