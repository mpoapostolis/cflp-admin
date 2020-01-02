import React, { useState, useCallback } from 'react';
import { IReduxStore } from '../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import ky from 'ky';
import { setErrors } from '../redux/actions/errors';

function useApi() {
  const token = useSelector((store: IReduxStore) => store.account.token);
  const dispatch = useDispatch();
  const _setErr = useCallback(
    errors => {
      dispatch(setErrors(errors));
    },
    [dispatch]
  );

  const api = ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          _setErr({});
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      ],
      afterResponse: [
        async (_request, _options, response) => {
          const data = await response.json();
          console.log(data);
          if ('error' in data) _setErr(data.error);
          return data;
        }
      ]
    }
  });

  return api;
}

export default useApi;
