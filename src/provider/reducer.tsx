import { LOGIN, LOGOUT } from './names';
import JwtDecode from 'jwt-decode';

export const LOCAL_STORAGE_AUTH_KEY = 'slourp_acount_key';

export const setKey = (payload: Record<string, any>) =>
  localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(payload));

export const loadKey = () => {
  const k = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  return k ? JSON.parse(k) : undefined;
};

const clearKey = (k: string) => {
  localStorage.removeItem(k);
};

export type Store = {
  _id?: string;
  username?: string;
  store_id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  token?: string;
  refreshToken?: string;
  permissions?: string[];
  expToken?: number;
  expRToken?: number;
};

type Action = {
  type: string;
  payload?: any;
};

export const initState: Store = loadKey() || {};

function reducer(state: Store, action: Action) {
  switch (action.type) {
    case LOGIN:
      const { exp: expToken } = JwtDecode(action?.payload?.token);
      const { exp: expRToken } = JwtDecode(action?.payload.refresh_token);
      setKey({
        ...action.payload,
        expToken: expToken * 1000,
        expRToken: expRToken * 1000
      });
      return {
        ...state,
        ...action.payload,
        expToken: expToken * 1000,
        expRToken: expRToken * 1000
      };
    case LOGOUT:
      clearKey('__account');
      return undefined;

    default:
      throw new Error();
  }
}
export default reducer;
