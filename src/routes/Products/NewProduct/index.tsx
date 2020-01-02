import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Images from './Images';
import Details from './Details';

function NewProduct() {
  return (
    <Grid container spacing={4}>
      <Grid item xl={6} lg={6} md={12} xs={12}>
        <Details />
      </Grid>
      <Grid item xl={6} lg={6} md={12} xs={12}>
        <Images />
      </Grid>
    </Grid>
  );
}

export default NewProduct;
