import React, { useContext, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  Chip
} from '@material-ui/core';
import I18n from '../../../I18n';
import * as R from 'ramda';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from '../../../ky';

const useStyles = makeStyles(() => ({
  cardContent: {
    maxHeight: '62vh',
    minHeight: '167px',
    overflow: 'auto'
  },

  spacer: {
    flexGrow: 1
  }
}));

type Props = {
  infos: {
    product_name: string;
    price: number;
    tags: string[];
  };
  setInfos: React.Dispatch<
    React.SetStateAction<{
      product_name: string;
      price: number;
      tags: string[];
    }>
  >;
};

function AccountDetails(props: Props) {
  const classes = useStyles({});
  const { infos, setInfos } = props;
  const [tags, setTags] = useState([]);

  const _setInfos = useCallback((obj) => {
    setInfos((s) => ({ ...s, ...obj }));
  }, []);

  useEffect(() => {
    api
      .get('/api/tags')
      .then((d) => d.json())
      .then((tags) => setTags(tags.map((t: any) => t.tag_name)));
  }, []);

  const t = useContext(I18n);
  return (
    <Card>
      <CardHeader
        subheader={t('int.edit-product-info')}
        title={t('int.product')}></CardHeader>
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              value={R.propOr('', 'product_name', infos)}
              onChange={(evt) =>
                _setInfos({ product_name: evt.currentTarget.value })
              }
              label={t('int.product_name')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              value={R.propOr('', 'price', infos)}
              fullWidth
              onChange={(evt) => _setInfos({ price: +evt.currentTarget.value })}
              type={'number'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                )
              }}
              label={t('int.price')}
              required
              margin="dense"
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <Autocomplete
              multiple
              options={tags}
              value={infos.tags}
              freeSolo
              onChange={(_, newTags) => {
                _setInfos({ tags: newTags });
              }}
              renderTags={(value, getTagProps) =>
                value.map((option: any, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  label="tags"
                  placeholder="Favorites"
                />
              )}
            />{' '}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AccountDetails;
