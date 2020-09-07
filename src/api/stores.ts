import api from '../ky';

const URL = `/api/stores/debits-credits`;

export async function getDebitCredits(_key: string): Promise<any> {
  return await api.get(URL).json();
}
