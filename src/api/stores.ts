import api from '../ky';

const URL = `/api/stores/infos`;

export async function getStoreInfos(_key: string): Promise<any> {
  return await api.get(URL).json();
}
