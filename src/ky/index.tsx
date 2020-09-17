import ky from 'ky';
import { loadKey } from '../provider/reducer';

export const logoutEvent = new CustomEvent('__logout');
const logout = () => {
  window.dispatchEvent(logoutEvent);
};

const api = ky.extend({
  hooks: {
    beforeRequest: [
      async (request) => {
        const auth = loadKey();
        if (!auth || !auth.refresh_token || auth?.expRToken < Date.now())
          return logout();
        return request.headers.set('Authorization', `Bearer ${auth.token}`);
      }
    ]
  }
});

export default api;
