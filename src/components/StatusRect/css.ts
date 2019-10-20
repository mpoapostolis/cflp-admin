import css from 'styled-jsx/css';

export const container = css`
  min-height: 18px;
  border-radius: 2px;
  font-size: small;
  text-align: center;
  color: #fff;
  word-break: none;

  display: inline-flex;
  min-width: 50px;
  justify-content: center;
  align-items: center;
  padding: 5px 9px 5px 7px;
  border-radius: 4px;
  background-color: #e9bb47;
  &.active {
    background-color: #00b287;
  }
  &.true {
    background-color: #00b287;
  }
  &.approved {
    background-color: #00b287;
  }

  &.draw {
    background: #333;
  }

  &.drawcomplete {
    background: #333;
  }
  &.finished {
    background: #000;
  }
  &.inactive {
    background-color: #dc1937;
  }
  &.false {
    background-color: #dc1937;
  }
  &.canceled {
    background: #de1331;
  }
  &.disabled {
    background: #de1331;
  }

  &.pending {
    background: #eabc39;
  }
  &.draft {
    background: #c1c1c1;
  }
  &.evaluated {
    background: #12c796;
  }
  &.evaluating {
    background: #b9b9b9;
  }
  &.scheduled {
    background: #f2af65;
  }
  &.building {
    background: #b9b9b9;
  }
  &.ready {
    background: #12c796;
  }
  &.active {
    background: #12c796;
  }
  &.invited {
    background: #f2af65;
  }
  &.created {
    background: #c1c1c1;
  }
  &.opt.out {
    background: var(--emphasis-color);
  }
`;
