import * as React from "react";
import { Doughnut } from "react-chartjs-2";

interface Part {
  value: number;
  label: string;
  color: string;
}

interface PartsChartProps {
  parts: Part[]
  title?: string;
}

export const PartsChart: React.SFC<PartsChartProps> = props => {
  const { parts, title } = props;

  return (
    <Doughnut
      data={{
        labels: parts.map(p => p.label),
        datasets: [{
          backgroundColor: parts.map(p => p.color),
          data: parts.map(p => p.value)
        }]
      }}
      options={{
        title: {
          display: !!title,
          text: title,
        }
      }}
    />
  )
}