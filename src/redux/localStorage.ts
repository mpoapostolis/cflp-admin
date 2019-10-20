import { IReduxStore } from './reducers';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('slourp__adm');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};
export const saveState = (state: IReduxStore) => {
  try {
    const { i18n, account } = state;
    const serializedState = JSON.stringify({ i18n, account });
    localStorage.setItem('slourp__adm', serializedState);
  } catch (e) {} //eslint-disable-line
};
