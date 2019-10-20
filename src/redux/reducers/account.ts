import { AnyAction } from 'redux';
import { LOGIN, UPDATE_TOKEN } from '../names';

export type Airport = {
  code: string;
  locales: string[];
};

export interface IAccount {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: string;
  scope?: string;
  jti?: string;
  exp?: number;
  user_name?: string;
  client_id?: string;
  userInfo?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string;
    permissions: string[];
    airports: Airport[];
  };
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
