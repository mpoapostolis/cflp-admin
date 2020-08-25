import api from '../ky';

const URL = `/api/tags-analytics`;

export async function getTagsAnalytics(_key: string): Promise<any> {
  return await api.get(URL).json();
}
