import { AnyAction } from 'redux';
import { LOGIN, UPDATE_TOKEN } from '../names';
import JwtDecode from 'jwt-decode';

export interface IAccount {
  _id?: string;
  token?: string;
  refreshToken?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  gender?: 'male' | 'female';
  age?: number;
  username?: string;
  storeId?: string;
  permissions?: string[];
  tokenIat?: number;
  tokenExp?: number;
  rTokenIat?: number;
  rTokenExp?: number;
}

export const initAccount = {};

function decodeToken(token: string, refreshToken: string) {
  const { iat: tokenIat, exp: tokenExp } = JwtDecode(token);
  const { iat: rTokenIat, exp: rTokenExp } = JwtDecode(refreshToken);
  return {
    token,
    refreshToken,
    tokenIat: tokenIat * 1000,
    tokenExp: tokenExp * 1000,
    rTokenIat: rTokenIat * 1000,
    rTokenExp: rTokenExp * 1000
  };
}

function auth(state: IAccount = initAccount, action: AnyAction) {
  switch (action.type) {
    case LOGIN:
      return {
        ...action.payload,
        ...decodeToken(action.payload.token, action.payload.refreshToken)
      };

    case UPDATE_TOKEN:
      return {
        ...state,
        ...decodeToken(action.payload.token, action.payload.refreshToken)
      };
    default:
      return state;
  }
}

export default auth;
