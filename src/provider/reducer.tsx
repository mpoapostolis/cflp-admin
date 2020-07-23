import { LOGIN, LOGOUT } from './names';

export const setKey = (payload: Record<string, any>) =>
  localStorage.setItem('__account', JSON.stringify(payload));

export const loadKey = () => {
  const k = localStorage.getItem('__account');
  return k ? JSON.parse(k) : undefined;
};

const clearKey = (k: string) => {
  localStorage.removeItem(k);
};

export type Store = {
  _id?: string;
  username?: string;
  storeId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  token?: string;
  refreshToken?: string;
  permissions?: string[];
};

type Action = {
  type: string;
  payload?: any;
};

export const initState: Store = loadKey() || {};

function reducer(state: Store, action: Action) {
  switch (action.type) {
    case LOGIN:
      setKey(action.payload);
      return { ...state, ...action.payload };
    case LOGOUT:
      clearKey('__account');
      return undefined;
    default:
      throw new Error();
  }
}
export default reducer;
