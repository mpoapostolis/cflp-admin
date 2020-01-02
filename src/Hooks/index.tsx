import React, { useState } from 'react';
import { IReduxStore } from '../redux/reducers';
import { useSelector } from 'react-redux';

function useFetch() {
  const token = useSelector((store: IReduxStore) => store.account.token);
  const header = { Authorization: `Bearer ${token}` };

  return header;
}

export default useFetch;
