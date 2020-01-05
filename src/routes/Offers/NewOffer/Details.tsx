import React, { useContext, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  MenuItem,
  CardActions,
  Button,
  Typography,
  InputAdornment,
  Hidden,
  IconButton
} from '@material-ui/core';
import I18n from '../../../I18n';
import { useSelector } from 'react-redux';
import { IReduxStore } from '../../../redux/reducers';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';
import AsyncAutoComplete from './AsyncAutoComplete';
import { red } from '@material-ui/core/colors';

const randomString = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15);

const useStyles = makeStyles(() => ({
  cardContent: {
    minHeight: '167px'
  },
  btn: {
    display: 'flex',
    justifyContent: 'space-arround'
  },

  spacer: {
    flexGrow: 1
  }
}));

type Props = {
  infos: {
    name: string;
    description: string;
    status: string;
    discounts: Discount[];
  };
  setInfos: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      status: string;
      discounts: Discount[];
    }>
  >;
};

export type Discount = {
  name?: string;
  price?: number;
  discount?: number;
  tableId: string;
};

function AccountDetails(props: Props) {
  const classes = useStyles();
  const { infos, setInfos } = props;
  const errors = useSelector((store: IReduxStore) => store.errors);

  const discounts = infos.discounts;
  const setDiscounts = (discounts: Discount[]) =>
    setInfos(s => ({ ...s, discounts }));

  function addDiscount() {
    setDiscounts([...discounts, { tableId: randomString() }]);
  }

  const chooseProduct = useCallback(
    (obj: Partial<Discount>, idx: number) => {
      const infos = {
        ...R.pick(['name', 'price', '_id'], { ...obj }),
        discount: 0,
        tableId: discounts[idx].tableId
      };
      setDiscounts(discounts.map((o, i) => (i === idx ? infos : o)));
    },
    [discounts]
  );

  const setProductDiscount = useCallback(
    (discount: number, idx: number) => {
      const tmp = R.assocPath(
        [idx, 'discount'],
        Math.max(Math.min(discount, 100), 0),
        discounts
      );
      setDiscounts(tmp);
    },
    [discounts]
  );

  const deleteDiscount = (idx: number) => {
    setDiscounts(discounts.filter((_, i) => i !== idx));
  };

  const _setInfos = useCallback(obj => {
    setInfos(s => ({ ...s, ...obj }));
  }, []);

  const t = useContext(I18n);

  function finalPrice(discount: number = 0, price?: number) {
    if (!price) return '';
    return `${(price * ((100 - discount) / 100)).toFixed(2)} €`;
  }

  return (
    <Card>
      <CardHeader
        subheader={t('int.edit-product-info')}
        title={t('int.product')}></CardHeader>
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              value={R.propOr('', 'name', infos)}
              error={Boolean(R.prop('name', errors))}
              onChange={evt => _setInfos({ name: evt.currentTarget.value })}
              helperText={R.propOr('', 'name', errors)}
              label={t('int.name')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              value={R.propOr('', 'description', infos)}
              error={Boolean(R.prop('description', errors))}
              onChange={evt =>
                _setInfos({ description: evt.currentTarget.value })
              }
              helperText={R.propOr('', 'description', errors)}
              label={t('int.description')}
              margin="dense"
              required
              variant="outlined"
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              select
              value={R.propOr('', 'status', infos)}
              fullWidth
              error={Boolean(R.prop('status', errors))}
              helperText={R.propOr('', 'status', errors)}
              onChange={evt => _setInfos({ status: evt.target.value })}
              label={t('int.status')}
              margin="dense"
              required
              variant="outlined">
              {[
                { label: t('int.active'), value: 'ACTIVE' },
                { label: t('int.inactive'), value: 'INACTIVE' }
              ].map((obj, idx) => (
                <MenuItem key={idx} value={obj.value}>
                  {obj.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {discounts.length > 0 && (
            <Grid item md={12} xs={12}>
              <br />
              <Typography variant={'h5'}>{t('int.discounts')}</Typography>
            </Grid>
          )}

          {discounts.map((obj, idx) => (
            <React.Fragment key={obj.tableId}>
              <Grid item md={10} xs={10}>
                <Typography variant="caption">
                  {t('int.discount')}: {idx + 1}
                </Typography>
                <Divider />
              </Grid>
              <Grid item md={4} xs={9}>
                <AsyncAutoComplete
                  url={'/api/bo/products'}
                  onChange={obj => chooseProduct(obj, idx)}
                />
              </Grid>
              <Hidden smDown>x</Hidden>
              <Grid item md={4} xs={6}>
                <TextField
                  fullWidth
                  onChange={evt =>
                    setProductDiscount(+evt.currentTarget.value, idx)
                  }
                  disabled={Boolean(!discounts[idx].name)}
                  margin={'dense'}
                  label={t('int.discount')}
                  type={'number'}
                  value={discounts[idx].discount || ''}
                  inputProps={{
                    min: 0,
                    max: 100
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              =
              <Grid item md={2} xs={2}>
                <Typography
                  style={{
                    textDecoration: discounts[idx].discount
                      ? 'line-through'
                      : '',
                    opacity: discounts[idx].discount ? '0.5' : ''
                  }}>
                  {obj.price ? `${obj.price}€` : ''}
                </Typography>
                {discounts[idx].discount ? (
                  <Typography>
                    {finalPrice(discounts[idx].discount, obj.price)}
                  </Typography>
                ) : (
                  ''
                )}
              </Grid>
              <Grid item md={1} xs={1}>
                <IconButton
                  onClick={() => deleteDiscount(idx)}
                  size={'small'}
                  title={t('int.delete')}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <span className={classes.spacer}></span>

        <Button
          onClick={addDiscount}
          className={classes.btn}
          title={t('int.add-discount')}
          variant={'outlined'}>
          {t('int.add-discount')}
        </Button>
      </CardActions>
    </Card>
  );
}

export default AccountDetails;
