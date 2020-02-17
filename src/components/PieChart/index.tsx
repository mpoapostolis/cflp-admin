import React, { createRef, useEffect, useState } from 'react';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { select, selectAll } from 'd3-selection';
import { PieArcDatum, pie, arc } from 'd3-shape';
import { css, cx } from 'emotion';
import { useWindowSize } from '../../Hooks/useWindowSize';
import { container, headerClass, label } from './css';
import { Typography } from '@material-ui/core';
import Label from '../LineChart/Label';

const defaultColor = schemeCategory10;
const path = css`
  cursor: pointer;
`;

export enum Position {
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom',
  default = ''
}

type DonutData = {
  value: number;
  label?: string;
  color?: string;
};
function midAngle(d: PieArcDatum<DonutData>) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

interface IProps {
  size?: number;
  title?: string;
  colors?: Array<string>;
  lineWidth?: number;
  data: Array<DonutData>;
  position?: Position;
}

const emptyData = [
  {
    value: 1,
    label: 'Empty data'
  }
];
const PieChart = React.memo((props: IProps) => {
  const renderNode = createRef<SVGSVGElement>();
  const [hoveredItem, setHoveredItem] = useState(-1);
  const { data, size } = props;
  const windowSize = useWindowSize();
  useEffect(() => {
    const svgEle = renderNode.current;
    const margin = 15;
    if (svgEle && svgEle.parentElement) {
      const { parentElement } = svgEle;
      const svgWidth = size ? size : parentElement.clientWidth;
      const svgHeight = size ? size : parentElement.clientHeight - 85;
      svgEle.setAttribute('width', String(svgWidth));
      svgEle.setAttribute('height', String(svgHeight));

      const svg = select(svgEle);
      const radius = Math.min(svgWidth, svgHeight) / 2 - margin;
      const total = data.reduce((acc, obj) => acc + obj.value, 0);
      const isTotalZero = total === 0;
      const colors = isTotalZero
        ? ['#d3d3d3']
        : data.map((e, i) => e.color || defaultColor[i]);
      const perc = (value: number) =>
        isTotalZero ? `0%` : `${((value / total) * 100).toFixed(2)}%`;
      const xOffset = svgWidth / 2;
      const body = svg
        .select('g')
        .attr('transform', `translate(${xOffset} ,${svgHeight / 2})`);
      // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.

      const _pie = pie<DonutData>()
        .sort(null)
        .value(d => d.value);

      const _arc = arc<DonutData>()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);

      const outerArc = arc<DonutData>()
        .outerRadius(radius * 0.95)
        .innerRadius(radius * 0.95);

      body
        .datum(isTotalZero ? emptyData : data)
        .selectAll('path')
        .data(_pie)
        .attr('fill', (_d, i) => `${colors[i]}af`)
        .attr('stroke', '#0001')
        .attr('d', _arc);

      body
        .selectAll('.d3DonutSlice')
        .on('mouseover', (_, idx, elements) => {
          body
            .selectAll('.d3DonutSlice')
            .select('path')
            .attr('opacity', 0.4);

          select(elements[idx])
            .select('path')
            .attr('opacity', 1)
            .attr('fill', colors[idx]);
          setHoveredItem(idx);
        })
        .on('mouseleave', (_, idx, elements) => {
          body
            .selectAll('.d3DonutSlice')
            .select('path')
            .attr('opacity', 1);

          select(elements[idx])
            .select('path')
            .attr('fill', `${colors[idx]}Bf`);
          setHoveredItem(-1);
        });

      body
        .selectAll('polyline')
        .data(_pie(isTotalZero ? emptyData : data))
        .attr('points', d => {
          // see label transform function for explanations of these three lines.
          const pos = outerArc.centroid(d);
          pos[0] = radius * 0.9 * (midAngle(d) < Math.PI ? 1.2 : -1);
          return [_arc.centroid(d), outerArc.centroid(d), pos].join(' ');
        });

      const textGroup = body
        .selectAll('.textGroup')
        .data(_pie(isTotalZero ? emptyData : data))
        .attr('transform', d => {
          const pos = outerArc.centroid(d);
          pos[0] = radius * (midAngle(d) < Math.PI ? 1.2 : -1.4);
          return `translate(${pos})`;
        });

      const valueText = textGroup.select('.d3TextValue');

      valueText.select('.actualValue').text(d => perc(d.value));
      valueText
        .select('.percentage')
        .text(d => (isTotalZero ? 0 : `total: ${d.value}`));
    }
  }, [data, windowSize]); // eslint-disable-line
  return (
    <div className={container}>
      <div className={headerClass}>
        <Typography variant="h6">{props.title}</Typography>
        <br />
        {props.data.map((obj, idx) => (
          <Label
            className={cx(label, {
              hovered: Boolean(~hoveredItem),
              active: idx === hoveredItem
            })}
            key={idx}
            label={obj.label || ''}
            color={schemeCategory10[idx]}
          />
        ))}
      </div>
      <svg ref={renderNode}>
        <g>
          {data.map((_, key) => (
            <g className="d3DonutSlice" key={key}>
              <polyline stroke="#0002" fill="none" />
              <path className={path} key={key} />
              <g className="textGroup">
                <text className="d3TextValue" textLength="120%">
                  <tspan
                    fontWeight="bold"
                    fontSize="13px"
                    x="0"
                    fill={schemeCategory10[0]}
                    className="percentage"
                  />
                  <tspan
                    fontSize="12px"
                    x="0"
                    dy="1.2em"
                    fill="#717171"
                    className="actualValue"
                  />
                </text>
              </g>
              ))}
            </g>
          ))}
          <image />
        </g>
      </svg>
    </div>
  );
});

export default PieChart;
