import React, { useState, useCallback } from 'react';
import { IReduxStore } from '../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import ky from 'ky';
import { setErrors } from '../redux/actions/errors';
import * as R from 'ramda';

function useApi() {
  const token = useSelector((store: IReduxStore) => store.account.token);
  const err = useSelector((store: IReduxStore) => store.errors);
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
          if (!R.isEmpty(err)) _setErr({});
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      ],
      afterResponse: [
        async (_request, _options, response) => {
          const data = await response.json();
          if ('error' in data) _setErr(data.error);
        }
      ]
    }
  });

  return api;
}

export default useApi;
