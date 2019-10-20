import { SET_ERRORS, CLEAR_ERRORS } from '../names';
import { AnyAction } from 'redux';

export interface IErrors {
  fieldErrors: Record<string, any>;
}

export const initErrors = {
  fieldErrors: {}
};

const errors = (state: IErrors = initErrors, action: AnyAction) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ERRORS:
      return payload;
    case CLEAR_ERRORS:
      return initErrors;

    default:
      return state;
  }
};

export default errors;
