import React, { useState } from 'react';
import { IReduxStore } from '../redux/reducers';
import { useSelector } from 'react-redux';

async function useFetch(
  END_POINT: string,
  METHOD: string,
  HEADERS: Record<string, string>,
  BODY?: BodyInit
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const token = useSelector((store: IReduxStore) => store.account.token);
  HEADERS.Authorization = `Bearer ${token}`;

  const config: RequestInit = {
    method: METHOD,
    headers: HEADERS,
    body: BODY
  };

  setLoading(true);
  const res = await fetch(END_POINT, config);
  const _data = await res.json();
  setData(_data);
  setLoading(false);

  if ('error' in data || data.status > 399) {
    throw data;
  }

  return { loading, data };
}

export default useFetch;
