import api from '../ky';
import qs from 'query-string';

const URL = `/api/products/all`;

export async function getProducts(
  _key: string,
  _params: Record<string, any>
): Promise<any> {
  const params = qs.stringify(_params);
  return await api.get(`${URL}?${params}`).json();
}
