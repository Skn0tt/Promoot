import * as React from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import { Stats as StatsRecord, getStats } from "../api";
import { Maybe, None, Some } from "monet";
import { CircleChart } from "../components/CircleChart";
import * as _ from "lodash";
import stringHash from "string-hash";
import { PartsChart } from "../components/PartsChart";
import { GroupedBarChart, Group as GroupedBarChartGroup } from "../components/GroupedBarChart";

interface StatsState {
  stats: Maybe<StatsRecord>;
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

const soldByMerchant = (stats: StatsRecord) =>
    _.mapValues(stats, v => _.sumBy(_.toArray(v), v => v.sold))

const soldByGroup = (stats: StatsRecord) => {
  const result: { [k: string]: number } = {};
  _.forEach(stats, s => {
    _.forEach(s, (v, g) => {
      result[g] = (result[g] || 0) + v.sold;
    })
  })
  return result;
}

const soldByMerchantAndGroup = (stats: StatsRecord): GroupedBarChartGroup[] => {
  return _.toArray(_.map(
    stats,
    (groups, merchant) => ({
      label: merchant,
      columns: _.mapValues(groups, g => g.sold),
      color: colorFor(merchant)
    })
  ))
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
        const sold = soldTickets(stats);
        const checkedIn = checkedInTickets(stats);
        const byMerchant = soldByMerchant(stats);
        const byGroup = soldByGroup(stats);
        const byMerchantAndGroup = soldByMerchantAndGroup(stats);
        return (
          <Grid container style={{ height: "100%" }} alignContent="flex-start" justify="flex-start" direction="row">
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} md={6} lg={3}>
                  <CircleChart
                    remaining={sold}
                    remainingLabel="Available"
                    remainingFill="#3f51b5"
                    fulfilled={sold}
                    title="Ticket Sales"
                    fulfilledLabel="Sold"
                    fulfilledFill="red"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <CircleChart
                    title="Check In"
                    remaining={sold - checkedIn}
                    remainingLabel="Not Checked In"
                    remainingFill="red"
                    fulfilled={checkedIn}
                    fulfilledLabel="Checked In"
                    fulfilledFill="#3f51b5"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <PartsChart
                    title="By Merchant"
                    parts={_.map(
                      byMerchant,
                      (b, k) => ({
                        value: b,
                        label: k,
                        color: colorFor(k)
                      })
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <PartsChart
                    title="By Group"
                    parts={_.map(
                      byGroup,
                      (b, k) => ({
                        value: b,
                        label: k,
                        color: colorFor(k)
                      })
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <GroupedBarChart
                items={byMerchantAndGroup}
                title="By Merchant and Group"
              />
            </Grid>
          </Grid>
        );
      }
    );
  }
}

export default Stats;
