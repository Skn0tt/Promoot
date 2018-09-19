import * as React from "react";
import { CircularProgress, Card, CardContent, Typography, CardHeader, Avatar, WithStyles, createStyles, Theme, colors, withStyles } from "@material-ui/core";
import { Maybe, None, Some } from "monet";
import { RouteComponentProps } from "react-router";
import { Ticket } from "../interfaces";
import { checkInTicket } from "../api";

const styles = () => ({
  avatar: {
    backgroundColor: colors.red[500]
  }
})

interface CheckInOwnProps {}

type CheckInProps = CheckInOwnProps & RouteComponentProps<{ ticketId: string }>;

interface CheckInState {
  ticket?: Maybe<Ticket>;
}

export class CheckIn extends React.PureComponent<CheckInProps & WithStyles<"avatar">, CheckInState> {

  state: Readonly<CheckInState> = {}
  
  componentDidMount = async () => {
    const { match } = this.props;
    const { ticketId } = match.params;

    try {
      const ticket = await checkInTicket(ticketId);
      this.setState({ ticket: Some(ticket) });
    } catch (_) {
      this.setState({ ticket: None() });
    }
  }

  render() {
    const { classes } = this.props;
    const { ticket } = this.state;

    if (!ticket) {
      return <CircularProgress />;
    }

    return ticket.cata(
      () => (
        <Typography variant="headline">
          Ticket not found.
        </Typography>
      ),
      ticket => (
        <div>
          <Card>
            <CardHeader
              avatar={
                <Avatar className={classes.avatar}>
                  {ticket.group}
                </Avatar>
              }
              title={ticket.merchant}
            />
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                {ticket.firstName} {ticket.lastName}
              </Typography>
              <Typography component="p">
                {ticket.email}
              </Typography>
            </CardContent>
          </Card>
        </div>
      )
    )
  }
}

export default withStyles(styles)(CheckIn);