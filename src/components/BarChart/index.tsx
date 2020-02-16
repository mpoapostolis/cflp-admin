import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState
} from 'react';
import { container, headerClass, toolTipClass } from './css';
import { BarChartData, BarChartPoint } from './types';
import {
  select,
  scaleLinear,
  axisBottom,
  extent,
  axisLeft,
  timeFormat,
  scaleBand,
  schemeCategory10,
  event
} from 'd3';

import { useParentDims } from '../../Hooks/useParentDims';
import { Typography } from '@material-ui/core';

const MARGINS = { top: 10, right: 30, bottom: 30, left: 60 };
const isFireFox = ~navigator.userAgent.search('Firefox');

// unit:pixels
type Dims = {
  width: number;
  height: number;
};

type Props = {
  dims?: Dims;
  data: BarChartData;
  title?: string;
};

function LineChart(props: Props) {
  const renderNode = useRef<SVGSVGElement>(null);
  const toolTipNode = useRef<HTMLDivElement>(null);
  const [toolTipInfos, setToolTipInfos] = useState<BarChartPoint>();

  // minMax from xPoints
  const xDomain = useMemo(() => props.data.map(d => d.label), [props.data]);

  // minMax from yPoints
  const yDomain = useMemo(() => extent(props.data, d => d.value), [
    props.data
  ]) as [number, number];

  // Choose between fixed or parrent Dimensions
  const parrentDims = useParentDims(renderNode);
  const _dims = props.dims || parrentDims;

  useEffect(() => {
    initChart();
    renderChart();
  }, [_dims, props.data]);

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

  const renderChart = useCallback(() => {
    if (!renderNode.current || !toolTipNode.current) return void 0;

    const svg = select(renderNode.current);
    const toolTip = select(toolTipNode.current);

    const width = Number(svg.attr('width')) - -MARGINS.left - MARGINS.right;
    const height =
      Number(svg.attr('height')) - MARGINS.bottom - MARGINS.top - 60; // 60 is the header Label and rotate Xaxis text

    const board = svg.select('.d3__board');

    board
      .select('.xAxis')
      .selectAll('.tick')
      .select('text')
      .attr('transform', `translate(0 , 10)`);

    const xScale = scaleBand()
      .domain(xDomain)
      .rangeRound([0, width - 66])
      .paddingInner(0.2);

    const yScale = scaleLinear()
      .domain([0, yDomain[1] + 1])
      .range([height, 0]);

    const xAxis = axisBottom(xScale).tickSize(-height);
    const yAxis = axisLeft(yScale)
      .tickSize(-width)
      .ticks(8);

    board
      .select<SVGGElement>('.xAxis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    board.select<SVGGElement>('.yAxis').call(yAxis);

    const rects = board.selectAll('rect').data(props.data);

    rects
      .attr('x', d => xScale(d.label) || 0)
      .attr('y', (d: any) => yScale(d.value))
      .attr('height', (d: any) => height - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .on('mouseenter', data => {
        const { layerX, offsetX, layerY, offsetY } = event;
        setToolTipInfos(data);

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
      });
  }, [props.data, _dims]);

  return (
    <div className={container}>
      <div className={headerClass}>
        <Typography variant="h6">{props.title}</Typography>
      </div>

      <svg ref={renderNode}>
        <g className="d3__board" transform={`translate(35, 10)`}>
          <g className={'xAxis'} />
          <g className={'yAxis'} />
          {props.data.map((d, idx) => (
            <rect
              key={d.label}
              opacity={0.7}
              fill={d.color || schemeCategory10[idx % 10]}
            />
          ))}
        </g>
      </svg>
      <div className={toolTipClass} ref={toolTipNode}>
        <div className="d3_toolTip_line">
          <strong
            style={{
              display: 'block',
              opacity: 1,
              color: toolTipInfos?.color || schemeCategory10[0]
            }}
            className={'d3_toolTip_label'}>
            {toolTipInfos?.label}:{' '}
          </strong>
          <span className="d3_toolTip_value">{toolTipInfos?.value}</span>
        </div>
      </div>
    </div>
  );
}

export default LineChart;
