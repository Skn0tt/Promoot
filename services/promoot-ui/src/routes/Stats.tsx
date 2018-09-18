import * as React from "react";
import { CircularProgress } from "@material-ui/core";
import { Stats as StatsRecord, getStats } from "../api";
import { Maybe, None, Some } from "monet";
import { PieChart, Pie, Tooltip, Cell, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import * as _ from "lodash";
import stringHash from "string-hash";
import * as config from "../config";

const { TICKET_GROUPS } = config.get();

interface StatsState {
  stats: Maybe<StatsRecord>;
}

const merchantsBarData = (stats: StatsRecord) =>
  _.map(stats, (merchantData, merchant) => ({
    name: merchant,
    ..._.mapValues(merchantData, v => v.sold)
  }));

const merchantsPieData = (stats: StatsRecord) => {
  return _.map(stats, (merchantData, merchant) => ({
    name: merchant,
    value: _.sumBy(_.values(merchantData), v => v.sold)
  }));
}

const groupsPieData = (stats: StatsRecord) => {
  const result =  _.flatMap(stats, (merchantData, merchant) =>
    _.map(merchantData, (groupData, group) => ({
      name: merchant + " " + group,
      value: groupData.sold
    }))
  );

  return result;
}

const reduceAllItems = (reducer: (v: { sold: number, checkedIn: number }) => number) => (stats: StatsRecord) =>
  _.sumBy(
    _.values(stats),
    v => _.sumBy(
      _.toArray(v),
      reducer
    )
  )

const soldTickets = reduceAllItems(v => v.sold)

const checkedInTickets = reduceAllItems(v => v.checkedIn)

const checkedInPieData = (stats: StatsRecord) => {
  const checkedIn = checkedInTickets(stats);
  const missing = soldTickets(stats) - checkedIn;

  return [{
    name: "Checked In",
    value: checkedIn
  }, {
    name: "Missing",
    value: missing
  }];
}

const colors = ["#FFE082", "#C5E1A5", "#81D4FA", "#B39DDB", "#EF9A9A", "#CE93D8", "#BCAAA4", "#EEEEEE", "#B0BEC5"];

const colorFor = (s: string) => colors[stringHash(s) % colors.length]

export class Stats extends React.PureComponent<{}, StatsState> {
  state: Readonly<StatsState> = {
    stats: None()
  }

  componentDidMount = async () => {
    const stats = await getStats();
    this.setState({ stats: Some(stats) });
  }

  render() {
    const { stats } = this.state;

    return stats.cata(
      () => (
        <CircularProgress />
      ),
      stats => {
        console.log(merchantsBarData(stats))
        const mData = merchantsPieData(stats);
        const gData = groupsPieData(stats);
        const cData = checkedInPieData(stats);
        return (
          <React.Fragment>
            <BarChart width={730} height={250} data={merchantsBarData(stats)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {TICKET_GROUPS.map(group => (
                <Bar dataKey={group} fill={colorFor(group)} />
              ))}
            </BarChart>
            <PieChart width={800} height={400}>
              <Pie
                dataKey="value"
                data={cData}
                cx={200}
                cy={200}
                innerRadius={70}
                outerRadius={90}
                fill="#82ca9d"
                label
              >
                <Cell
                  fill="#A5D6A7"
                />
                <Cell
                  fill="#FFAB91"
                />
              </Pie>
              <Tooltip />
              <Legend verticalAlign="top" height={36}/>
            </PieChart>
          </React.Fragment>
        );
      }
    );
  }
}

export default Stats;
