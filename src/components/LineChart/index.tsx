import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState
} from 'react';
import { container, headerClass, labelPoint, toolTipClass } from './css';
import { LineChartData, LineChartPoint } from './types';
import Label from './Label';
import {
  select,
  scaleLinear,
  axisBottom,
  extent,
  axisLeft,
  scaleTime,
  line,
  schemeCategory10,
  event,
  timeFormat,
  curveMonotoneX
} from 'd3';

import { useParentDims } from '../../Hooks/useParentDims';
import { cx } from 'emotion';

const MARGINS = { top: 10, right: 30, bottom: 30, left: 60 };
const isFireFox = ~navigator.userAgent.search('Firefox');

function getAllPoints(data: LineChartData) {
  return data.map(line => line.points).flatMap(e => e);
}

function getBasis(data: LineChartData) {
  return Array.from(new Set(getAllPoints(data).map(o => o.x)));
}

// unit:pixels
type Dims = {
  width: number;
  height: number;
};

type Props = {
  dims?: Dims;
  data: LineChartData;
};

type ToolTipInfos = {
  x: number | undefined;
  lines: {
    label: string;
    value: number;
    color: string;
  }[];
};

function LineChart(props: Props) {
  const renderNode = useRef<SVGSVGElement>(null);
  const toolTipNode = useRef<HTMLDivElement>(null);
  const [hiddenLines, setHideLines] = useState<string[]>([]);
  const [toolTipInfos, setToolTipInfos] = useState<ToolTipInfos>();
  /**
   * initate colors and filter for hiddenLines
   */
  const data = useMemo(
    () =>
      props.data
        .map((o, idx) => ({
          ...o,
          color: o.color || schemeCategory10[idx % 10]
        }))
        .filter(line => !hiddenLines.includes(line.label)),
    [props.data, hiddenLines]
  );

  /**
   * show or hide a line
   */
  const toggleLine = useCallback(
    label => {
      const exists = hiddenLines.includes(label);
      const tmp = exists
        ? hiddenLines.filter(line => line !== label)
        : [...hiddenLines, label];

      setHideLines(tmp);
    },
    [hiddenLines]
  );

  // all unique X points
  const basis = useMemo(() => getBasis(data), [data]);

  // minMax from xPoints
  const xDomain = useMemo(() => extent(getAllPoints(data), d => d.x), [
    data
  ]) as [number, number];

  // minMax from yPoints
  const yDomain = useMemo(() => extent(getAllPoints(data), d => d.y), [
    data
  ]) as [number, number];

  // Choose between fixed or parrent Dimensions
  const parrentDims = useParentDims(renderNode);
  const _dims = props.dims || parrentDims;

  useEffect(() => {
    initChart();
    renderChart();
  }, [_dims, data]);

  /**
   * initiate svg dimensions
   */
  function initChart() {
    const svgEle = renderNode.current;
    if (!svgEle || !svgEle.parentElement) return;

    const svgWidth = _dims.width;
    const svgHeight = _dims.height;
    svgEle.setAttribute('width', `${svgWidth}`);
    svgEle.setAttribute('height', `${svgHeight}`);
  }

  /**
   * draw Axis lines and circles
   */
  const renderChart = useCallback(() => {
    if (!renderNode.current || !toolTipNode.current) return void 0;

    const svg = select(renderNode.current);
    const toolTip = select(toolTipNode.current);

    const width = Number(svg.attr('width')) - -MARGINS.left - MARGINS.right;
    const height =
      Number(svg.attr('height')) - MARGINS.bottom - MARGINS.top - 60; // 60 is the header Label and rotate Xaxis text
    const board = svg.select('.d3__board');
    const driverLine = board.select('.driverLine');

    // move the driverLine
    svg
      .on('mousemove', () => {
        const { layerX, offsetX } = event;

        // Reason we need this is cause  Firefox set OffsetX to zero
        const posX = isFireFox ? layerX - 30 : offsetX - 25;

        driverLine
          .attr('display', 'block')
          .attr('x1', posX)
          .attr('x2', posX)
          .attr('y1', 0)
          .attr('y2', height);
      })
      .on('mouseleave', () => {
        driverLine.attr('display', 'none');
      });

    const xScale = scaleTime()
      .domain(xDomain)
      .rangeRound([0, width - 58]);

    const yScale = scaleLinear()
      .domain(yDomain)
      .range([height, 0]);

    //generate d attribute for path
    const linePath = line<LineChartPoint>()
      .x(point => xScale(point.x))
      .y(point => yScale(point.y))
      .curve(curveMonotoneX);

    const xAxis = axisBottom(xScale).tickSize(-height);

    const yAxis = axisLeft(yScale)
      .tickSize(-width)
      .ticks(8);

    const groupLine = board.selectAll('.d3__group').data(data);

    groupLine
      .select('.d3__line')
      .attr('fill', 'none')
      .attr('stroke-width', '1')
      .attr('d', line => linePath(line.points))
      .attr('stroke', line => line.color);

    board

      .selectAll(`.d3__conceivable_axis`)
      .attr('x1', p => xScale(p as number))
      .data(basis)
      .attr('x2', p => xScale(p))
      .attr('y1', 0)
      .attr('y2', height)
      .on('mouseenter', (x, idx) => {
        const { layerX, offsetX, layerY, offsetY } = event;

        groupLine
          .select('.d3__circle')
          .attr('cx', line => xScale(line.points[idx].x))
          .attr('cy', line => yScale(line.points[idx].y))
          .attr('fill', line => line.color)
          .attr('r', 6)
          .attr('stroke', '#000a');

        setToolTipInfos({
          x,
          lines: data.map(line => ({
            label: line.label,
            value: line.points[idx].y,
            color: line.color
          }))
        });

        toolTip.style('display', 'block');
        const posX = isFireFox ? layerX : offsetX;
        const posY = isFireFox ? layerY : offsetY;
        const _offsetX = posX + 150 > _dims.width ? posX - 150 : posX - 50;
        const _offsetY = posY + 120 > _dims.height ? posY - 75 : posY + 75;
        toolTip.style('left', `${_offsetX}px`).style('top', `${_offsetY}px`);
      })
      .on('mouseleave', () => {
        setToolTipInfos(undefined);

        toolTip.style('display', 'none');
        groupLine.select('.d3__circle').attr('r', 0);
      });

    board
      .select<SVGGElement>('.xAxis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    board.select<SVGGElement>('.yAxis').call(yAxis);
  }, [data, _dims]);

  return (
    <div className={container}>
      <div className={headerClass}>
        {props.data.map((line, idx) => (
          <Label
            className={cx(labelPoint, {
              disabled: hiddenLines.includes(line.label)
            })}
            onClick={toggleLine}
            key={line.label}
            label={line.label}
            size={9}
            color={line.color || schemeCategory10[idx % 10]}
          />
        ))}
      </div>
      <svg ref={renderNode}>
        <g className="d3__board" transform={`translate(27, 10)`}>
          <g className={'xAxis'} />
          <g className={'yAxis'} />
          {data.map(line => (
            <g key={line.label} className="d3__group">
              <path className={`d3__line`} />
              <circle className={`d3__circle`} key={line.label} />
            </g>
          ))}

          {basis.map((_, idx) => (
            <line
              strokeWidth={11}
              stroke={'#f000'}
              key={idx}
              className={`d3__conceivable_axis`}
            />
          ))}

          <line className="driverLine" strokeDasharray="2" stroke="#000" />
        </g>
      </svg>
      <div className={toolTipClass} ref={toolTipNode}>
        {toolTipInfos?.lines.map(l => (
          <div className="d3_toolTip_line" key={l.label}>
            <strong style={{ color: l.color }} className={'d3_toolTip_label'}>
              {l.label}:{' '}
            </strong>{' '}
            <span className="d3_toolTip_value">{l.value}</span>
          </div>
        ))}
        <br />
        <div>
          <strong>
            {timeFormat('%d %B %Y')(new Date(toolTipInfos?.x ?? Date.now()))}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default LineChart;
