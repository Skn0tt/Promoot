import * as React from "react";
import * as _ from "lodash";
import { Bar } from "react-chartjs-2";

export interface Group {
  label: string;
  columns: { [key: string]: number };
  color: string;
}

interface GroupedBarChartProps {
  items: Group[];
  title?: string;
}

const toChartJs = (groups: Group[]) => {
  const groupLabels = groups.map(i => i.label);
  const dataSetsByColumn: { [group: string]: { label: string, data: number[], backgroundColor: string } } = {};

  // for each group
  groups.forEach(group => {
    // create a DataSet per column
    _.forEach(group.columns, (_, columnKey) => {
      dataSetsByColumn[columnKey] = {
        label: columnKey,
        data: groupLabels.map(_ => 0),
        backgroundColor: group.color
      }
    });
  });

  // for each group
  groups.forEach((group, groupIndex) => {
    // forEach column
    _.forEach(group.columns, (columnValue, columnKey) => {
      // add the data to the DataSets
      dataSetsByColumn[columnKey].data[groupIndex] = columnValue;
    });
  });

  return {
    labels: groupLabels,
    datasets: _.toArray(dataSetsByColumn)
  };
}

export const GroupedBarChart: React.SFC<GroupedBarChartProps> = props => {
  const { items, title } = props;

  return (
    <Bar
      data={toChartJs(items)}
      options={{
        title: {
          display: !!title,
          text: title
        }
      }}
    />
  );
}



