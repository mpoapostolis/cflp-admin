import React, { useState, useContext, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import Details from './Details';
import ActionHeader from '../../../components/ActionHeader';
import I18n from '../../../I18n';
import { useParams, useHistory } from 'react-router';
import { toast } from 'react-toastify';
import EditImages from '../../../components/EditImages';
import api from '../../../ky';

function NewProduct() {
  const t = useContext(I18n);

  const [infos, setInfos] = useState<{
    product_name: string;
    price: number;
    tags: string[];
    images?: string;
  }>({
    product_name: '',
    price: 0,
    tags: [],
    images: undefined
  });

  const params = useParams<{ id?: string }>();

  const onChange = (images: string) => {
    setInfos((s) => ({ ...s, images }));
  };

  useEffect(() => {
    if (!params.id) return;
    api
      .get(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        const { product_name = '', images, tags, price = 0 } = data;
        setInfos({ product_name, price, tags, images });
      })
      .catch(console.error);
  }, []);

  const isEdit = Boolean(params.id);
  const history = useHistory();

  const handleSubmit = () => {
    const action = isEdit ? api.patch : api.post;
    const url = isEdit ? `/api/products/${params.id}` : `/api/products`;
    const successMsg = isEdit
      ? 'int.product-updated-successfully'
      : 'int.product-created-successfully';
    action(url, {
      json: infos
    }).then(() => {
      toast.success(successMsg);
      history.push('/products');
    });
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
          <Details infos={infos} setInfos={setInfos} />
        </Grid>
        <Grid item xl={6} lg={6} md={12} xs={12}>
          <EditImages
            image={infos.images}
            onChange={onChange}
            isEdit={isEdit}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default NewProduct;
