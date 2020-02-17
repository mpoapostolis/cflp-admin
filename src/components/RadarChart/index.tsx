import React, { useEffect, useRef, useCallback } from 'react';
import { container, headerClass } from './css';
import { select, scaleLinear, max } from 'd3';
import { useParentDims } from '../../Hooks/useParentDims';

const angleToRads = (angle: number) => (angle * Math.PI) / 180;

const distinctΑrr = (arr: any[], howMany: number) => {
  return arr.length < howMany
    ? arr
    : arr.filter((_, idx) => {
        return (
          idx === 0 || // first element
          idx === arr.length - 1 || // last element
          idx % Math.floor(arr.length / howMany) === 0
        );
      });
};

let labels = ['A', 'B', 'C', 'D', 'E', 'F'];

const points = labels.map(_ => 1 + Math.random() * 8);
let ticks1 = Array(20)
  .fill('')
  .map((_, idx) => idx * 2);

let ticks = Array(20)
  .fill('')
  .map((_, idx) => idx * 2);

const MARGINS = { top: 10, right: 10, bottom: 10, left: 10 };

function RadarChart() {
  const renderNode = useRef<SVGSVGElement>(null);

  const parrentDims = useParentDims(renderNode);
  const _dims = parrentDims;

  const values = distinctΑrr(ticks, 5);

  useEffect(() => {
    initChart();
    renderChart();
  }, [_dims]);

  function initChart() {
    const svgEle = renderNode.current;
    if (!svgEle || !svgEle.parentElement) return;

    const svgWidth = _dims.width;
    const svgHeight = _dims.height;
    svgEle.setAttribute('width', `${svgWidth}`);
    svgEle.setAttribute('height', `${svgHeight}`);
  }

  const renderChart = useCallback(() => {
    if (!renderNode.current) return void 0;
    const svg = select(renderNode.current);

    const width = Number(svg.attr('width'));
    const height = Number(svg.attr('height')); // 60 is the header Label and rotate Xaxis text
    const board = svg.select('.d3__board');

    const maxValue = max(values) || 0;
    const maxRangeValue = Math.min(width, height) / 2 - 40;

    const angle = 360 / values.length;

    let radialScale = scaleLinear()
      .domain([0, maxValue])
      .range([0, maxRangeValue]);

    board
      .selectAll('circle')
      .data(values)
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('stroke', '#0005')
      .attr('r', d => radialScale(d));

    board
      .selectAll('text')
      .data(values)
      .attr('x', width / 2 - 2)
      .attr('y', d => maxRangeValue + 35 - radialScale(d))
      .attr('text-anchro', 'left')
      .text(d => d.toString());

    board
      .selectAll('line')
      .data(values)
      .attr('x1', width / 2)
      .attr('y1', height / 2)
      .attr(
        'x2',
        (_d, i) =>
          // ANGLE TO RADS -> APPLY TRIGONOMETRY
          width / 2 -
          Math.cos(angleToRads(i * angle)) * radialScale(maxValue) * 1.2
      )
      .attr(
        'y2',
        (_d, i) =>
          height / 2 -
          Math.sin(angleToRads(i * angle)) * radialScale(maxValue) * 1.2
      )
      .attr('stroke', '#0005');
  }, [_dims]);

  return (
    <div className={container}>
      <svg ref={renderNode}>
        <g className="d3__board">
          {values.map((_, idx) => (
            <circle fill="none" key={idx} />
          ))}

          {values.map((_, idx) => (
            <text fontSize="9" fill="grey" key={idx} />
          ))}

          {labels.map((label, idx) => (
            <g key={idx}>
              <line />
              <text>{label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default RadarChart;
