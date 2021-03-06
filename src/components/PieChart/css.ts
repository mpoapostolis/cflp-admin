import { css } from 'emotion';

export const container = css`
  background: #fff;
  position: relative;
  width: 100%;
  height: 100%;
`;

export const headerClass = css`
  padding-top: 10px;
  height: 50px;
  padding-left: 10px;
`;

export const label = css`
  &.hovered {
    opacity: 0.05;
    &.active {
      opacity: 1;
    }
  }
`;

export const LabelCont = css``;
