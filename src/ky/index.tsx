import ky from 'ky';
import { setKey, loadKey } from '../provider/reducer';

const LOCAL_STORAGE_AUTH_KEY = '__account';

const LOGIN_URL = '/auth/realms/Sponsors/protocol/openid-connect/token';
export const logoutEvent = new CustomEvent('__logout');
const logout = () => {
  window.dispatchEvent(logoutEvent);
};

const headers: HeadersInit = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

const api = ky.extend({
  hooks: {
    beforeRequest: [
      async (request) => {
        const auth = loadKey();
        if (!auth) return;
        return request.headers.set('Authorization', `Bearer ${auth.token}`);
      }
    ]
  }
});

export default api;
