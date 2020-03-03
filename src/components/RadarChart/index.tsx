import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { container } from './css';
import { select, scaleLinear, max, line, curveLinear } from 'd3';
import { useParentDims } from '../../Hooks/useParentDims';
import { RadarData } from './types';

let colors = ['darkorange', 'gray', 'navy'];
const angleToRads = (angle: number) => (angle * Math.PI) / 180;

/**
 * This function will return a distinct Array
 */
const distinctΑrr = (arr: any[]) => {
  const step = Math.floor(Math.max(...arr) / 4);
  return Array(5)
    .fill(step)
    .map((step, idx) => step * idx);
};

let ticks = Array(20)
  .fill('')
  .map((_, idx) => Math.random() * 60);

let ticks1 = Array(20)
  .fill('')
  .map((_, idx) => Math.random() * 60);

type Props = {
  data: RadarData[];
};
function RadarChart(props: Props) {
  const renderNode = useRef<SVGSVGElement>(null);
  const parrentDims = useParentDims(renderNode);
  const _dims = parrentDims;

  const uniqueLabels = useMemo(
    () => new Set(props.data.map(o => o.scores.map(o => o.label)).flat(1)),
    []
  );

  const allValues = useMemo(
    () => new Set(props.data.map(o => o.scores.map(o => o.score)).flat(1)),
    []
  );

  const labels = Array.from(uniqueLabels);
  const values = distinctΑrr(Array.from(allValues));

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

    const angle = 360 / labels.length;

    function angleToCoordinate(idx: number, value: number, factor: number = 1) {
      let x =
        width / 2 -
        Math.cos(angleToRads(idx * angle)) * radialScale(value) * factor;
      let y =
        height / 2 -
        Math.sin(angleToRads(idx * angle)) * radialScale(value) * factor;
      return { x, y };
    }

    let radialScale = scaleLinear()
      .domain([0, maxValue])
      .range([0, maxRangeValue - 10]);

    board
      .selectAll('circle')
      .data(values)
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('stroke', '#0002')
      .attr('r', d => radialScale(d));

    board
      .selectAll('text')
      .data(labels)
      .attr('x', (_d, i) => angleToCoordinate(i, maxValue, 1.2).x)
      .attr('y', (_d, i) => angleToCoordinate(i, maxValue, 1.2).y)
      .attr('text-anchro', 'left')
      .text((_d, idx) => labels[idx]);

    board
      .selectAll('line')
      .data(labels)
      .attr('x1', width / 2)
      .attr('y1', height / 2)
      .attr('x2', (_d, i) => angleToCoordinate(i, maxValue, 1.1).x)
      .attr('y2', (_d, i) => angleToCoordinate(i, maxValue, 1.1).y)
      .attr('stroke', '#0002');

    let xLine = line<{ x: number; y: number }>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(curveLinear);

    board
      .selectAll('path')
      .data(props.data)
      .attr('d', (_d, i) => {
        const coords = _d.scores.map((t, idx) =>
          angleToCoordinate(idx, t.score, 0.8)
        );
        return xLine(coords);
      })

      .attr('fill', (_, idx) => colors[idx])
      .attr('stroke-opacity', 0.4);
  }, [_dims]);

  return (
    <div className={container}>
      <svg ref={renderNode}>
        <g className="d3__board">
          {values.map((_, idx) => (
            <circle fill="none" key={idx} />
          ))}
          {props.data.map((_, idx) => (
            <path
              key={idx}
              strokeOpacity={0.4}
              stroke={colors[idx]}
              fillOpacity={0.2}
            />
          ))}
          {labels.map((label, idx) => (
            <g key={idx}>
              <line />
              <text textAnchor="midle">{label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default RadarChart;
