import api from '../ky';
import qs from 'query-string';

const URL = `/api/geolog`;

export async function getPendingNotification(_key: string): Promise<any> {
  return await api.get(`${URL}/pending`).json();
}

export async function getGeoLog(
  _key: string,
  _params: Record<string, any>
): Promise<any> {
  const params = qs.stringify(_params);
  return await api.get(`${URL}?${params}`).json();
}

export async function getGeoLogInfos(
  _key: string,
  _params: Record<string, any>
): Promise<any> {
  const params = qs.stringify(_params);
  return await api.get(`${URL}/near?${params}`).json();
}
