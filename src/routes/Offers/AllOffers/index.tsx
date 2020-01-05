import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import I18n from '../../../I18n';
import Filters from '../../../components/Filters';
import { FilterType } from '../../../components/Filters/types';
import MaterialTable from '../../../components/Table';
import { Button, Typography, IconButton } from '@material-ui/core';
import { Columns } from '../../../components/Table/types';
import { Link, useHistory } from 'react-router-dom';
import useApi from '../../../Hooks';
import queryString from 'query-string';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';
import { toast } from 'react-toastify';
import { cx } from 'emotion';
import { makeStyles } from '@material-ui/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { red, green } from '@material-ui/core/colors';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ImageRepresentation from '../../../components/ImageRepresentation';

const useStyles = makeStyles(() => ({
  btn: {
    '&.ACTIVE': {
      border: `solid 1px ${green[500]}`,
      color: `${green[500]}`
    },
    '&.INACTIVE': {
      border: `solid 1px ${red[500]}`,
      color: `${red[500]}`
    }
  },
  marginRight: {
    marginRight: '15px'
  },
  actionCont: { display: 'flex' }
}));

function AllOffers() {
  const t = useContext(I18n);
  const [infos, setInfos] = useState({
    data: [],
    offset: 0,
    total: 20,
    limit: 100
  });
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState([0, 0]);
  const api = useApi();
  const classes = useStyles();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        setCoords([p.coords.latitude, p.coords.longitude]);
      });
    }
  }, []);

  useEffect(() => {
    const search = history.location.search;
    const obj = queryString.parse(search);
    getOffers(obj);
  }, []);

  const getOffers = useCallback(
    (obj: Record<string, any>) => {
      setLoading(true);
      const url = queryString.stringify(obj);
      api
        .get(`/api/bo/offers?${url}`)
        .then(e => e.json())
        .then(infos => {
          setInfos(infos);
          setLoading(false);
        });
    },
    [history.location.search]
  );

  const deleteOffer = useCallback(
    (id: string) => {
      const params = queryString.parse(history.location.search);
      api.delete(`/api/bo/offers/${id}`);
      toast.success(t('int.offer-delete-successfully'));
      getOffers(params);
    },
    [history.location.search]
  );

  const toggleStatus = useCallback(
    (id: string, action: string) => {
      const msg =
        action === 'active'
          ? 'int.offer-deactivated-successfully'
          : 'int.offer-activated-successfully';
      const params = queryString.parse(history.location.search);
      api.post(`/api/bo/offers/${action}`, {
        json: {
          id
        }
      });
      toast.success(t(msg));
      getOffers(params);
    },
    [history.location.search]
  );

  const filterConf = useMemo(() => [] as FilterType[], [t]);

  const columns: Columns = [
    {
      title: t('int.name'),
      field: 'name'
    },
    {
      title: t('int.description'),
      field: 'description'
    },
    {
      title: t('int.loyalty-points'),
      field: 'loyaltyPoints'
    },
    {
      title: t('int.purchased'),
      render: obj => R.propOr('-', 'purchased', obj)
    },
    {
      title: t('int.images'),
      render: (obj: any, idx: number) => {
        const tmp: unknown[] = R.propOr([], 'images', obj);
        const howMany = tmp.length;
        return <ImageRepresentation howMany={howMany} />;
      }
    },
    {
      title: t('int.status'),
      render: (obj: any, idx: number) => {
        return (
          <Button
            size="small"
            disabled
            className={cx(classes.btn, obj.status)}
            variant="outlined">
            {obj.status}
          </Button>
        );
      }
    },
    {
      title: t('int.actions'),
      render: (obj: any, idx: number) => (
        <div>
          <IconButton
            className={classes.marginRight}
            size={'small'}
            onClick={() => history.push(`/offers/${obj._id}`)}
            title={t('int.view')}>
            <VisibilityIcon />
          </IconButton>

          {obj.status === 'INACTIVE' && (
            <IconButton
              size={'small'}
              className={classes.marginRight}
              onClick={() => toggleStatus(obj._id, 'activate')}
              title={t('int.delete')}>
              <PlayArrowIcon htmlColor={green[500]} />
            </IconButton>
          )}
          {obj.status === 'ACTIVE' && (
            <IconButton
              size={'small'}
              className={classes.marginRight}
              onClick={() => toggleStatus(obj._id, 'deactivate')}
              title={t('int.delete')}>
              <StopIcon htmlColor={red[500]} />
            </IconButton>
          )}
          <IconButton
            size={'small'}
            className={classes.marginRight}
            onClick={() => history.push(`/offers/${obj._id}/edit`)}
            title={t('int.view')}>
            <EditIcon />
          </IconButton>
          <IconButton
            size={'small'}
            className={classes.marginRight}
            onClick={() => deleteOffer(obj._id)}
            title={t('int.delete')}>
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{t('int.offers')}</Typography>

        <Button component={Link} to="/offers/new" variant="contained">
          {t('int.add-new')}
        </Button>
      </div>
      <br />
      <Filters onSubmit={getOffers} filterConf={filterConf} />
      <MaterialTable
        loading={loading}
        columns={columns}
        {...infos}
        onChange={getOffers}
      />
    </>
  );
}

export default AllOffers;
