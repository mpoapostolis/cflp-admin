import api from '../ky';
import qs from 'query-string';

const URL = `/api/orders`;

export async function getOrders(
  _key: string,
  _params: Record<string, any>
): Promise<any> {
  const params = qs.stringify(_params);
  return await api.get(`${URL}?${params}`).json();
}
