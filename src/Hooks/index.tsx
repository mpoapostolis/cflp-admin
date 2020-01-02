import React, { useState } from 'react';
import { IReduxStore } from '../redux/reducers';
import { useSelector } from 'react-redux';
import ky from 'ky';

function useApi() {
  const token = useSelector((store: IReduxStore) => store.account.token);

  const api = ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      ]
    }
  });

  return api;
}

export default useApi;
