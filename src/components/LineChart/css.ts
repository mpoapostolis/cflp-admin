import { css } from 'emotion';
import { mq } from '../../css';

export const container = css`
  background: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  text {
    font-size: 12px;
  }

  .xAxis {
    path {
      stroke: #0001;
    }
    text {
      ${mq[5]} {
        font-size: xx-small;
      }
    }
  }
  .yAxis path {
    stroke: #0001;
  }
  .tick line {
    stroke: #0001;
  }
`;

export const headerClass = css`
  height: 50px;
  display: flex;
  align-items: center;
`;

export const labelPoint = css`
  display: flex;
  justify-content: space-around;
  margin-left: 15px;
  align-items: center;
  cursor: pointer;
  &.disabled {
    opacity: 0.4;
  }
`;

export const toolTipClass = css`
  z-index: 9999;
  display: none;
  position: absolute;
  padding: 10px;
  box-shadow: 0 0 2px 2px #0003;
  background: #fff;
  font-size: 14px;

  .d3_toolTip_line {
    display: flex;
    min-height: 30px;
    align-items: center;
  }

  .d3_toolTip_value {
  }
  .d3_toolTip_label {
    margin-right: 20px;
  }
`;
