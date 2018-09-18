import * as React from "react";
import { TextField, Select, Grid, FormControl, InputLabel, createStyles, withStyles, WithStyles, Button } from "@material-ui/core";
import * as config from "../config";
import { createTicket } from "../api";
import { InfoContext } from "../App";

const styles = createStyles(theme => ({
  formControl: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 120,
    width: "100%",
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
}));

const { MERCHANT_NAMES, TICKET_GROUPS } = config.get();

interface NewTicketState {
  firstName: string;
  lastName: string;
  email: string;
  merchant: string;
  password: string;
  group: string;
}

const isValidEmail = (s: string) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(s)
const isNotEmpty = (s: string) => s !== ""
const isValidMerchant = (s: string) => MERCHANT_NAMES.includes(s)
const isValidTicketGroup = (g: string) => TICKET_GROUPS.includes(g)

export class NewTicket extends React.PureComponent<WithStyles, NewTicketState> {
  state: Readonly<NewTicketState> = {
    firstName: "",
    email: "",
    lastName: "",
    merchant: "",
    password: "",
    group: "",
  }

  static isInputValid = ({ email, firstName, lastName, merchant, password, group }: NewTicketState): boolean =>
    isValidEmail(email) &&
    isNotEmpty(firstName) &&
    isNotEmpty(lastName) &&
    isNotEmpty(password) &&
    isValidMerchant(merchant) &&
    isValidTicketGroup(group)

  createTicket = (onInfo: (s: string) => void) => async () => {
    const { email, firstName, lastName, merchant, password, group } = this.state;
    const ticket = await createTicket({ email, firstName, lastName, group }, merchant, password);
    onInfo(`Successfully created ticket for ${ticket.firstName}: ${ticket.id}`);
    this.setState({ email: "", firstName: "", lastName: "", group: "" });
  }

  render() {
    const { classes } = this.props;
    const { merchant, lastName, email, firstName, password, group } = this.state;

    return (
      <InfoContext.Consumer>
        {addItem => (
          <Grid container>
            <Grid item container spacing={16}>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="merchant">Merchant</InputLabel>
                  <Select
                    value={merchant}
                    native
                    fullWidth
                    onChange={({ target: { value: merchant }}) => this.setState({ merchant })}
                    inputProps={{ id: "merchant" }}
                  >
                    {[""].concat(MERCHANT_NAMES).map(name => (
                      <option value={name} key={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="password"
                  label="Password"
                  value={password}
                  fullWidth
                  type="password"
                  onChange={({ target: { value: password }}) => this.setState({ password })}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <TextField
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  fullWidth
                  onChange={({ target: { value: firstName }}) => this.setState({ firstName })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  value={lastName}
                  fullWidth
                  onChange={({ target: { value: lastName }}) => this.setState({ lastName })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email"
                  value={email}
                  fullWidth
                  onChange={({ target: { value: email }}) => this.setState({ email })}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="ticketGroup">Ticket Group</InputLabel>
                  <Select
                    value={group}
                    native
                    fullWidth
                    onChange={({ target: { value: group }}) => this.setState({ group })}
                    inputProps={{ id: "ticketGroup" }}
                  >
                    {[""].concat(TICKET_GROUPS).map(name => (
                      <option value={name} key={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!NewTicket.isInputValid(this.state)}
                className={classes.button}
                onClick={this.createTicket(addItem)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        )}
      </InfoContext.Consumer>
    )
  }
}

export default withStyles(styles)(NewTicket);