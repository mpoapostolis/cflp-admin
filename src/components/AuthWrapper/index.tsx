import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import intersection from 'ramda/src/intersection';
import { IReduxStore } from '../../redux/reducers';

/**
 * @prop {string[]} reqPerm
 * @prop {string[]} authorities
 * @prop {Boolean}  redirect
 */

interface IProps {
  reqPerm: string[];
  redirect?: Boolean;
  children: any;
}

function AuthWrapper(props: IProps) {
  const { reqPerm, redirect } = props;
  const permissions = useSelector((store: IReduxStore) =>
    store.account.userInfo ? store.account.userInfo.permissions : []
  );
  const hasPerm = reqPerm.length === 0 || intersection(reqPerm, permissions).length > 0;
  if (hasPerm) return props.children;
  else if (redirect) {
    return <Redirect to={{ pathname: '/not-found' }} />;
  } else return null;
}

export default AuthWrapper;
