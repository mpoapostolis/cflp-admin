import ky from 'ky';
import { useAccount } from '../provider';
import { LOGOUT } from '../provider/names';

function useApi() {
  const account = useAccount();

  const api = ky.extend({
    hooks: {
      beforeRequest: [
        async (request) => {
          if (!account.refreshToken) {
            account.dispatch({ type: LOGOUT });
            return;
          }
        }
      ]
    }
  });

  return api;
}

export default useApi;
