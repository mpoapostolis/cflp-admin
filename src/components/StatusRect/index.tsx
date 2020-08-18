import React, { ReactElement } from 'react';
import { Button } from '@material-ui/core';

function StatusRect(props: { children: 'pending' | 'complete' | 'canceled' }) {
  const color =
    props.children === 'pending'
      ? '#F89A02'
      : props.children === 'complete'
      ? '#91CD26'
      : 'gray';
  return (
    <Button
      variant="outlined"
      size="small"
      style={{
        color,
        borderColor: color
      }}>
      {props.children}
    </Button>
  );
}

export default StatusRect;
