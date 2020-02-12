import React, { createRef, useEffect } from 'react';
import { select, schemeCategory10, scaleBand, scaleSqrt } from 'd3';
import { css } from 'emotion';
import { useWindowSize } from '../../Hooks/useWindowSize';
const defaultColor = schemeCategory10;

const pointer = css`
  cursor: pointer;
`;

interface Dims {
  width: number;
  height: number;
}

interface IProps {
  size?: Dims;
  data: Array<Conf>;
}

type Conf = {
  value: number;
  color?: string;
};

function BarChart(props: IProps) {
  const renderNode = createRef<SVGSVGElement>();
  const { data, size } = props;
  const windowSize = useWindowSize();

  useEffect(() => {
    const svgEle = renderNode.current;
    if (svgEle && svgEle.parentElement) {
      const { parentElement } = svgEle;
      const svgWidth = size ? size.width : parentElement.clientWidth;
      const svgHeight = size ? size.height : parentElement.clientHeight;
      svgEle.setAttribute('width', String(svgWidth));
      svgEle.setAttribute('height', String(svgHeight));

      let sum = 0;
      const datum = data.map((obj, idx) => {
        sum += Number(obj.value);
        return {
          value: Number(obj.value),
          color: obj.color || defaultColor[idx]
        };
      });

      const isTotalZero = sum === 0;

      const svg = select(svgEle);
      const body = svg
        .select('g')
        .attr('transform', `scale(1,-1) translate(0, ${-svgHeight})`);

      const xScale = scaleBand<Number>()
        .rangeRound([0, svgWidth])
        .domain(datum.map((_e, i) => i))
        .paddingInner(0.2);

      const yScale = scaleSqrt()
        .range([svgHeight, 0])
        .domain([0, Math.max(...datum.map(e => e.value))]);

      const rects = body.selectAll('rect').data(datum);

      rects.select('title').text(d => d.value);
      rects
        .attr('x', (_d, i) => xScale(i) || 0)
        .attr('fill', d => d.color)
        .attr('height', d =>
          isTotalZero ? 2 : 2 + svgHeight - yScale(d.value)
        )
        .attr('width', xScale.bandwidth());
    }
  }, [data, renderNode, size, windowSize]);
  return (
    // <svg ref={renderNode}>
    //   <g>
    //     {data.map((_, key) => (
    //       <rect rx={2} ry={2} className={pointer} key={key}>
    //         <title />
    //       </rect>
    //     ))}
    //   </g>
    // </svg>

    <svg ref={renderNode}>
      <g className="d3__board" transform={`translate(27, 10)`}>
        <g className={'xAxis'} />
        <g className={'yAxis'} />
        <g>
          {data.map((_, key) => (
            <rect rx={2} ry={2} className={pointer} key={key}>
              <title />
            </rect>
          ))}
        </g>
      </g>
    </svg>
  );
}

export default BarChart;
