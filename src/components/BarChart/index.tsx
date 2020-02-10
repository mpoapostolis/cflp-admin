import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import Chart from 'chart.js';

type Props = {
  title: string;
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};

function BarChart(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        ...props
      },
      options: {
        legend: {
          display: false
        },
        scales: {}
      }
    });
  }, []);

  return (
    <Card>
      <CardHeader title={props.title}></CardHeader>
      <CardContent>
        <canvas ref={canvasRef}></canvas>
      </CardContent>
    </Card>
  );
}

export default BarChart;
