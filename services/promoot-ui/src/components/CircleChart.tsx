import * as React from "react";
import { Pie } from "react-chartjs-2";

interface CircleChartProps {
  title?: string;
  remaining: number;
  remainingLabel: string;
  remainingFill: string;
  fulfilled: number;
  fulfilledLabel: string;
  fulfilledFill: string;
}

export const CircleChart: React.SFC<CircleChartProps> = props => {
  const { remaining, fulfilled, fulfilledLabel, remainingLabel, fulfilledFill, remainingFill, title } = props;

  return (
    <Pie
      data={{
        labels: [remainingLabel, fulfilledLabel],
        datasets: [{
          data: [remaining, fulfilled],
          backgroundColor: [remainingFill, fulfilledFill]
        }]
      }}
      options={{
        title: {
          display: !!title,
          text: title
        }
      }}
    />
  );
}