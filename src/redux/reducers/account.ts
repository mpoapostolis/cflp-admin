import { AnyAction } from 'redux';
import { LOGIN, UPDATE_TOKEN } from '../names';

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
}

export const initAccount = {};

function auth(state: IAccount = initAccount, action: AnyAction) {
  switch (action.type) {
    case LOGIN:
      return action.payload;

    case UPDATE_TOKEN:
      return { ...state, access_token: action.payload };
    default:
      return state;
  }
}

export default auth;
