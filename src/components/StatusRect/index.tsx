import React, { useContext } from 'react';
import { container } from './css';
import I18n from '../../I18n';
import clsx from 'clsx';

interface IProps {
  children: string;
  className?: string;
}

function StatusRect(props: IProps) {
  const t = useContext(I18n);
  const status = props.children
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')[0];
  const statusClass = status
    .split(' ')[0]
    .split('_')[0]
    .toLocaleLowerCase()
    .replace('int.', '');

  return <div className={clsx(container, statusClass, props.className)}>{t(status)}</div>;
}

export default StatusRect;
