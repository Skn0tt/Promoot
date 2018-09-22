import * as React from "react";
import { Maybe, None, Some } from "monet";
import { CircularProgress, TextField } from "@material-ui/core";
import MuiDataTable from "mui-datatables";
import { Ticket } from "../interfaces";
import { getAllTickets, deleteTicket } from "../api";
import { InfoContext } from "../App";

interface TicketListProps {
  onInfo: (s: string) => void;
}

interface TicketListState {
  tickets: Maybe<Ticket[]>;
  adminPassword: string;
}

export class TicketList extends React.PureComponent<TicketListProps, TicketListState> {
  state: Readonly<TicketListState> = {
    tickets: None(),
    adminPassword: ""
  }

  componentDidMount = async () => {
    try {
      const tickets = await getAllTickets();
      this.setState({ tickets: Some(tickets) });
    } catch (error) {}
  }

  onRowsDelete = (onInfo: (s: string) => void) => async ({ data }) => {
    const { tickets, adminPassword } = this.state;
    const deletedIds: string[] = data.map(
      ({ dataIndex }) => tickets.some()[dataIndex].id
    );
    deletedIds.forEach(async s => {
      const ticket = await deleteTicket(s, adminPassword);
      onInfo(`Successfully deleted ${ticket.firstName}'s Ticket (${ticket.id})`);
    })
  }

  render() {
    const { tickets } = this.state;

    return tickets.cata(
      () => (
        <CircularProgress />
      ),
      tickets => {
        const columns = ["ID", "First Name", "Last Name", "Email", "Group", "Merchant", "Checked In"];
        const data = tickets.map(t => [t.id, t.firstName, t.lastName, t.email, t.group, t.merchant, "" + t.checkedIn]);
        return (
          <InfoContext.Consumer>
            {addInfo => (
              <React.Fragment>
                <TextField
                  id="password-input"
                  label="Admin Password"
                  type="password"
                  fullWidth
                  autoComplete="current-password"
                  margin="normal"
                  onChange={({ target: { value: adminPassword }}) => this.setState({ adminPassword })}
                />
                <MuiDataTable
                  data={data}
                  columns={columns}
                  options={{
                    onRowsDelete: rows => this.onRowsDelete(addInfo)(rows)
                  }}
                />
              </React.Fragment>
            )}
          </InfoContext.Consumer>
        )
      }
    );
  }
}

export default TicketList;
