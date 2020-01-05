import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Grid
} from '@material-ui/core';
import I18n from '../../../I18n';
import { useParams, useHistory } from 'react-router';
import useApi from '../../../Hooks';
import * as R from 'ramda';
import InfoItem from '../../../components/InfoItem';
import { css } from 'emotion';
import ImageModal from '../../../components/ImageModal';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';

const imgModal = css`
  max-width: 250px;
  min-height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: cover;
  margin: 20px;
  cursor: pointer;
`;

const imgClass = css`
  height: 100%;
  width: 100%;
`;

const imgCont = css`
  display: flex;
  flex-wrap: wrap;
`;

function ViewOffer() {
  const t = useContext(I18n);
  const api = useApi();
  const [infos, setInfos] = useState({});
  const [images, setImages] = useState<{ url: string }[]>([]);
  const params = useParams<{ id?: string }>();
  const history = useHistory();

  useEffect(() => {
    if (!params.id) return;
    api
      .get(`/api/bo/offers/${params.id}`)
      .then(res => res.json())
      .then(data => {
        const { name = '', description = '', purchased = 0 } = data;
        const images = data.images.map((url: string) => ({
          url
        }));
        setInfos({ name, description, purchased });
        setImages(images);
      })
      .catch(console.error);
  }, []);

  const deleteProduct = useCallback(() => {
    api.delete(`/api/bo/offers/${params.id}`);
    toast.success(t('int.product-delete-successfully'));
    history.push('/offers');
  }, [params]);

  console.log(infos, images);

  const keys = useMemo(
    () =>
      Object.keys(infos).map(k => ({
        label: t(`int.${k.toLocaleLowerCase()}`),
        value: R.propOr('', k, infos) as string
      })),
    [infos]
  );
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={t('int.actions')}
            action={
              <>
                <IconButton
                  onClick={() => history.push(`/offers/${params.id}/edit`)}
                  title={t('int.edit')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={deleteProduct} title={t('int.delete')}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={t('int.product-infos')}></CardHeader>
          <Divider />
          <CardContent>
            {keys.map((obj, idx) => (
              <InfoItem key={idx} {...obj} />
            ))}
            <br />
          </CardContent>
        </Card>
      </Grid>
      {images.length > 0 && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <CardHeader title={t('int.images')} />
              <Divider />

              <div className={imgCont}>
                {images.map((f, idx) => (
                  <ImageModal key={idx} className={imgModal} src={f.url}>
                    <img className={imgClass} src={f.url} alt={'img'} />
                  </ImageModal>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default ViewOffer;
