import * as React from "react";
import Drawer from "./components/Drawer";
import { Routes } from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import TicketList from "./routes/TicketList";
import AdminPlane from "./routes/AdminPlane";
import NewTicket from "./routes/NewTicket";
import CheckIn from "./routes/CheckIn";
import { InfoBar } from "./components/InfoBar";
import { Stats } from "./routes/Stats";
import { CssBaseline } from "@material-ui/core";

interface AppState {
  infos: string[];
}

export const InfoContext = React.createContext<(s: string) => void>(() => {});

export class App extends React.PureComponent<{}, AppState> {
  state: Readonly<AppState> = {
    infos: []
  }

  addItem = (i: string) => this.setState(({ infos }) => ({ infos: infos.concat(i) }))

  render() {
    const { infos } = this.state;

    return (
      <BrowserRouter>
        <InfoContext.Provider value={this.addItem}>
          <CssBaseline />
          <Switch>
            <Route
              exact
              path="/tickets/:ticketId/checkIn"
              component={CheckIn}
            />

            <React.Fragment>
            <InfoBar items={infos} onChange={infos => this.setState({ infos })}/>
              <Drawer
                title="SüM - Promoot"
                listItems={<Routes />}
              >
                <Switch>
                  <Route
                    exact
                    path="/tickets"
                    component={TicketList}
                  />
                  <Route
                    exact
                    path="/tickets/new"
                    component={NewTicket}
                  />
                  <Route
                    exact
                    path="/admin"
                    component={AdminPlane}
                  />
                  <Route
                    exact
                    path="/stats"
                    component={Stats}
                  />
                </Switch>
              </Drawer>
            </React.Fragment>
          </Switch>
        </InfoContext.Provider>
      </BrowserRouter>
    )
  }
}