import React, { useEffect, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { debounce } from '../../../utils';
import { ListItemText } from '@material-ui/core';
import I18n from '../../../I18n';
import { Discount } from './Details';
import api from '../../../ky';

type Props = {
  url: string;
  onChange: (obj: any) => void;
  value: Discount;
};
function AsyncAutoComplete(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>([]);
  const loading = open && options.length === 0;

  const handleSearchTerm = (searchTerm: string) => {
    setOpen(true);
    api
      .get(`${props.url}?searchTerm=${searchTerm}&limit=10`)
      .then((res) => res.json())
      .then((d) => {
        if (d.data.length === 0) {
          setOptions([]);
          setOpen(false);
        }
        setOptions(d.data);
      });
  };
  const debounceOnChange = debounce(handleSearchTerm, 200);

  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  const t = useContext(I18n);
  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        handleSearchTerm('');
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={props.value}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option: Discount) => option.name || ''}
      options={options}
      loading={loading}
      onChange={(_, value) => {
        props.onChange(value);
      }}
      renderOption={(option: any) => (
        <ListItemText primary={option.name} secondary={`${option.price} €`} />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('int.product')}
          fullWidth
          onChange={(e) => debounceOnChange(e.currentTarget.value)}
          margin={'dense'}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  );
}

export default AsyncAutoComplete;
