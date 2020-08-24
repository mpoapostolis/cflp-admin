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
  event
} from 'd3';

import { useParentDims } from '../../Hooks/useParentDims';
import { Typography } from '@material-ui/core';

const keys = [
  'Under 5 Years',
  '5 to 13 Years',
  '14 to 17 Years',
  '18 to 24 Years',
  '25 to 44 Years',
  '45 to 64 Years',
  '65 Years and Over'
];

const data = [
  {
    State: 'CA',
    'Under 5 Years': 2704659,
    '5 to 13 Years': 4499890,
    '14 to 17 Years': 2159981,
    '18 to 24 Years': 3853788,
    '25 to 44 Years': 10604510,
    '45 to 64 Years': 8819342,
    '65 Years and Over': 4114496
  },
  {
    State: 'TX',
    'Under 5 Years': 2027307,
    '5 to 13 Years': 3277946,
    '14 to 17 Years': 1420518,
    '18 to 24 Years': 2454721,
    '25 to 44 Years': 7017731,
    '45 to 64 Years': 5656528,
    '65 Years and Over': 2472223
  },
  {
    State: 'NY',
    'Under 5 Years': 1208495,
    '5 to 13 Years': 2141490,
    '14 to 17 Years': 1058031,
    '18 to 24 Years': 1999120,
    '25 to 44 Years': 5355235,
    '45 to 64 Years': 5120254,
    '65 Years and Over': 2607672
  },
  {
    State: 'FL',
    'Under 5 Years': 1140516,
    '5 to 13 Years': 1938695,
    '14 to 17 Years': 925060,
    '18 to 24 Years': 1607297,
    '25 to 44 Years': 4782119,
    '45 to 64 Years': 4746856,
    '65 Years and Over': 3187797
  },
  {
    State: 'IL',
    'Under 5 Years': 894368,
    '5 to 13 Years': 1558919,
    '14 to 17 Years': 725973,
    '18 to 24 Years': 1311479,
    '25 to 44 Years': 3596343,
    '45 to 64 Years': 3239173,
    '65 Years and Over': 1575308
  },
  {
    State: 'PA',
    'Under 5 Years': 737462,
    '5 to 13 Years': 1345341,
    '14 to 17 Years': 679201,
    '18 to 24 Years': 1203944,
    '25 to 44 Years': 3157759,
    '45 to 64 Years': 3414001,
    '65 Years and Over': 1910571
  }
];

var schemeCategory10 = ['#ca0020', '#f4a582', '#d5d5d5', '#92c5de', '#0571b0'];
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
  const xDomain = useMemo(() => props.data.map((d) => d.label), [props.data]);

  // minMax from yPoints
  const yDomain = useMemo(() => extent(props.data, (d) => d.value), [
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

    const x0 = scaleBand()
      .domain(['Under 5 Years'])
      .rangeRound([MARGINS.left, width - MARGINS.right])
      .paddingInner(0.1);

    const x1 = scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    board
      .select('.xAxis')
      .selectAll('.tick')
      .select('text')
      .attr('transform', `translate(0 , 10)`);

    const xScale = scaleBand()
      .domain(xDomain)
      .rangeRound([0, width - 66])
      .paddingOuter(0.1)
      .paddingInner(0.2);

    const yScale = scaleLinear()
      .domain([0, yDomain[1] + yDomain[1] * 0.1])
      .range([height, 0]);

    const xAxis = axisBottom(xScale).tickSize(-height).ticks(8);
    const yAxis = axisLeft(yScale).tickSize(-width).ticks(8);

    board
      .select<SVGGElement>('.xAxis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    board.select<SVGGElement>('.yAxis').call(yAxis);

    const rects = board.selectAll('rect').data(props.data);

    rects

      .attr('x', (d) => xScale(d.label) || 0)
      .attr('y', (d: any) => yScale(d.value))

      .attr('height', (d: any) => height - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .on('mouseenter', (data) => {
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
              ry={1}
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
