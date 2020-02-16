import React from 'react';
import { Typography } from '@material-ui/core';
import { css, cx } from 'emotion';

const cn = css`
  display: flex;
  align-items: center;
`;
type Props = {
  color: string;
  label: string;
  size?: number;
  onClick?: (e?: string) => void;
  className?: string;
};
function Label(props: Props) {
  const { color, size = 10, label } = props;
  return (
    <div
      className={cx(cn, props.className)}
      onClick={() => props.onClick && props.onClick(label)}>
      <div
        style={{
          borderRadius: '50%',
          background: color,
          width: `${size}px`,
          height: `${size}px`,
          marginRight: '15px'
        }}
      />
      <Typography variant={'caption'}>{label}</Typography>
    </div>
  );
}

export default Label;
