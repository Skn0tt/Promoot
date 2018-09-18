import * as React from "react";
import { Maybe, Some } from "monet";
import { setCheckInPhase, setMaxTickets, getAdminInfo } from "../api";
import { PasswordDialog } from "../components/PasswordDialog";
import { FormGroup, FormControlLabel, Switch, TextField, Button } from "@material-ui/core";
import { RouteComponentProps } from "react-router";

interface AdminPlaneProps {}

interface AdminPlaneState {
  isInCheckInPhase: Maybe<boolean>;
  maxTickets: Maybe<number>;
  maxTicketsField: number,
  password: string;
}

export class AdminPlane extends React.PureComponent<AdminPlaneProps & RouteComponentProps, AdminPlaneState> {
  state: Readonly<AdminPlaneState> = {
    isInCheckInPhase: Maybe.None(),
    maxTickets: Maybe.None(),
    maxTicketsField: 0,
    password: ""
  }

  getInfo = async (password: string) => {
    const { isInCheckInPhase, maxTickets } = await getAdminInfo(password);
    this.setState({
      isInCheckInPhase: Maybe.Some(isInCheckInPhase),
      password,
      maxTickets: Maybe.Some(maxTickets),
      maxTicketsField: maxTickets
    });
  }

  setCheckInPhase = async () => {
    const { isInCheckInPhase, password } = this.state;
    const newValue = !isInCheckInPhase.some();
    const response = await setCheckInPhase(newValue, password);
    this.setState({ isInCheckInPhase: Some(response) });
  }

  setMaxTickets = async (value: number) => {
    const { password } = this.state;
    const res = await setMaxTickets(value, password);
    this.setState({ maxTickets: Maybe.Some(res), maxTicketsField: res });
  }

  render() {
    const { history } = this.props;
    const { isInCheckInPhase, maxTickets, maxTicketsField } = this.state;

    return (
      <React.Fragment>
        <PasswordDialog
          open={isInCheckInPhase.isNone()}
          onSubmit={this.getInfo}
          onCancel={() => history.goBack()}
        />
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={isInCheckInPhase.orSome(false)}
                onChange={this.setCheckInPhase}
                value="checkedB"
                color="primary"
              />
            }
            label="CheckIn Phase"
          />
        </FormGroup>
        <TextField
          id="standard-number"
          label="Max Tickets"
          value={maxTicketsField}
          onChange={
            ({ target: { value }}) => this.setState({ maxTicketsField: +value })
          }
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginRight: 20 }}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          disabled={maxTickets.orSome(maxTicketsField) === maxTicketsField}
          onClick={() => this.setMaxTickets(maxTicketsField)}
        >
          Update
        </Button>
      </React.Fragment>
    )
  }
}

export default AdminPlane
