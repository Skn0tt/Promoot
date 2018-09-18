import * as React from "react";
import { Route } from "react-router";
import AddCircle from "@material-ui/icons/AddCircle";
import BarChart from "@material-ui/icons/BarChart";
import Settings from "@material-ui/icons/Settings";
import List from "@material-ui/icons/List";
import { ListItemIcon, ListItemText, ListItem } from "@material-ui/core";

export const Routes: React.SFC = () => {
  return (
    <React.Fragment>
      <Route
        render={({ history }) => (
          <ListItem
            button
            onClick={() => history.push("/tickets/new")}
          >
            <ListItemIcon>
              <AddCircle />
            </ListItemIcon>
            <ListItemText primary="New Ticket" />
          </ListItem>
        )}
      />
      <Route
        render={({ history }) => (
          <ListItem
            button
            onClick={() => history.push("/tickets")}
          >
            <ListItemIcon>
              <List />
            </ListItemIcon>
            <ListItemText primary="All Tickets" />
          </ListItem>
        )}
      />
      <Route
        render={({ history }) => (
          <ListItem
            button
            onClick={() => history.push("/stats")}
          >
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Stats" />
          </ListItem>
        )}
      />
      <Route
        render={({ history }) => (
          <ListItem
            button
            onClick={() => history.push("/admin")}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItem>
        )}
      />
    </React.Fragment>
  )
}