import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import Chart from 'chart.js';

type Props = {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};

function DonutChart(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'pie',
      data: {
        ...props
      },
      options: {
        legend: {
          display: false
        },

        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }, [props]);

  return (
    <Card>
      <CardHeader title={props.title}></CardHeader>
      <CardContent>
        <canvas ref={canvasRef}></canvas>
      </CardContent>
    </Card>
  );
}

export default DonutChart;
