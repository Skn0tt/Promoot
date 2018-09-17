import * as React from "react";
import Drawer from "./components/Drawer";
import { Routes } from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import TicketList from "./routes/TicketList";
import NewTicket from "./routes/NewTicket";
import { InfoBar } from "./components/InfoBar";

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
          <InfoBar items={infos} onChange={infos => this.setState({ infos })}/>
          <Drawer
            title="SüM-Ticketing"
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
            </Switch>
          </Drawer>
        </InfoContext.Provider>
      </BrowserRouter>
    )
  }
}