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

export type Discount = {
  name?: string;
  price?: number;
  discount?: number;
};

const useStyles = makeStyles(() => ({
  root: {},
  cardContent: {
    minHeight: '167px',
    overflow: 'auto'
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
    lpReward?: number;
    lpPrice?: number;
    type: 'REWARD' | 'CHARGE';
  };
  setInfos: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      status: string;
      discounts: Discount[];
      lpReward?: number;
      lpPrice?: number;
      type: 'REWARD' | 'CHARGE';
    }>
  >;
};

function AccountDetails(props: Props) {
  const classes = useStyles();
  const { infos, setInfos } = props;
  const errors = useSelector((store: IReduxStore) => store.errors);

  const discounts = infos.discounts;
  const setDiscounts = (discounts: Discount[]) =>
    setInfos(s => ({ ...s, discounts }));

  function addDiscount() {
    setDiscounts([...discounts, {}]);
  }

  const chooseProduct = useCallback(
    (obj: Partial<Discount>, idx: number) => {
      const infos = {
        ...R.pick(['name', 'price', '_id'], { ...obj }),
        discount: 0
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

  const deleteDiscount = (obj: any) => {
    setDiscounts(discounts.filter(o => o !== obj));
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
    <Card className={classes.root}>
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
                { label: t('int.draft'), value: 'DRAFT' }
              ].map((obj, idx) => (
                <MenuItem key={idx} value={obj.value}>
                  {obj.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item md={12} xs={12}>
            <TextField
              select
              value={R.propOr('', 'type', infos)}
              fullWidth
              error={Boolean(R.prop('type', errors))}
              helperText={R.propOr('', 'type', errors)}
              onChange={evt =>
                _setInfos({
                  type: evt.target.value,
                  [evt.target.value === 'CHARGE'
                    ? 'lpReward'
                    : 'lpPrice']: undefined
                })
              }
              label={t('int.type')}
              margin="dense"
              required
              variant="outlined">
              {[
                { label: t('int.reward'), value: 'REWARD' },
                { label: t('int.charge'), value: 'CHARGE' }
              ].map((obj, idx) => (
                <MenuItem key={idx} value={obj.value}>
                  {obj.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {infos.type === 'CHARGE' && (
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                value={R.propOr('', 'lpPrice', infos)}
                error={Boolean(R.prop('lpPrice', errors))}
                onChange={evt =>
                  _setInfos({ lpPrice: evt.currentTarget.value })
                }
                helperText={R.propOr('', 'lpPrice', errors)}
                label={t('int.lpPrice')}
                margin="dense"
                required
                variant="outlined"
              />
            </Grid>
          )}
          {infos.type === 'REWARD' && (
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                value={R.propOr('', 'lpReward', infos)}
                error={Boolean(R.prop('lpReward', errors))}
                onChange={evt =>
                  _setInfos({ lpReward: evt.currentTarget.value })
                }
                helperText={R.propOr('', 'lpReward', errors)}
                label={t('int.lpReward')}
                margin="dense"
                required
                variant="outlined"
              />
            </Grid>
          )}

          {discounts.length > 0 && (
            <Grid item md={12} xs={12}>
              <br />
              <Typography variant={'h5'}>{t('int.discounts')}</Typography>
            </Grid>
          )}

          {discounts.map((obj, idx) => (
            <React.Fragment key={idx}>
              <Grid item md={10} xs={10}>
                <Typography variant="caption">
                  {t('int.discount')}: {idx + 1}
                </Typography>
                <Divider />
              </Grid>
              <Grid item md={4} xs={9}>
                <AsyncAutoComplete
                  value={obj}
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
                    startAdornment: (
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
                  onClick={() => deleteDiscount(obj)}
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
          size={'small'}
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
