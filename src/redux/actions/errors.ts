import { createAction } from 'redux-actions';
import { SET_ERRORS, CLEAR_ERRORS } from '../names';

export const setErrors = createAction(SET_ERRORS);
export const clearErrors = createAction(CLEAR_ERRORS);
