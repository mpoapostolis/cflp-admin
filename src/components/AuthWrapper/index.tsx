import React from 'react';
import { Redirect } from 'react-router-dom';
import intersection from 'ramda/src/intersection';
import { useAccount } from '../../provider';

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
  const account = useAccount();
  if (!account.permissions) return null;

  const hasPerm =
    reqPerm.length === 0 ||
    intersection(reqPerm, account.permissions).length > 0;

  if (hasPerm) return props.children;
  else if (redirect) {
    return <Redirect to={{ pathname: '/not-found' }} />;
  } else return null;
}

export default AuthWrapper;
