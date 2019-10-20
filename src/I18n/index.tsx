import React from 'react';
import store from 'redux';
import * as R from 'ramda';

export type Translate = (key: string) => string;

const I18n = React.createContext<Translate>(key => key);

export default I18n;
