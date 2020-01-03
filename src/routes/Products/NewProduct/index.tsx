import React, { useState, useContext, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import Images from './Images';
import Details from './Details';
import ActionHeader from '../../../components/ActionHeader';
import I18n from '../../../I18n';
import { useParams, useHistory } from 'react-router';
import queryString from 'query-string';
import useApi from '../../../Hooks';

function NewProduct() {
  const t = useContext(I18n);
  type Image = {
    file: File;
    url: string;
  };
  const [images, setImages] = useState<Image[]>([]);

  const history = useHistory();
  const search = history.location.search;
  const _infos = queryString.parse(search);
  console.log(images.filter(e => e.file));

  const infos = {
    name: _infos.name,
    price: Number(_infos.price),
    lpReward: Number(_infos.lpReward)
  };
  const api = useApi();
  const params = useParams<{ id?: string }>();

  useEffect(() => {
    if (!params.id) return;
    console.log('---');
    api
      .get(`/api/bo/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        const images = data.images.map((url: string) => ({
          file: null,
          url
        }));
        setImages(images);
      })
      .catch(console.log);
  }, []);

  const handleSubmit = () => {
    const formData = new FormData();
    images.forEach(f => formData.append('image', f.file));
    formData.append('infos', JSON.stringify(infos));

    api
      .post('/api/bo/products', {
        body: formData
      })
      .then(e => history.push('/products?offset=0&limit=10'));
  };

  return (
    <>
      <ActionHeader>
        <Button onClick={handleSubmit} variant="outlined">
          {t('int.save')}
        </Button>
      </ActionHeader>
      <br />
      <Grid container spacing={4}>
        <Grid item xl={6} lg={6} md={12} xs={12}>
          <Details />
        </Grid>
        <Grid item xl={6} lg={6} md={12} xs={12}>
          <Images images={images} setImages={setImages} />
        </Grid>
      </Grid>
    </>
  );
}

export default NewProduct;
