import * as React from "react";
import { Maybe, Some } from "monet";
import { isInCheckInPhase, setCheckInPhase } from "../api";
import { PasswordDialog } from "../components/PasswordDialog";
import { FormGroup, FormControlLabel, Switch } from "@material-ui/core";

interface AdminPlaneProps {}

interface AdminPlaneState {
  checkInPhase: Maybe<boolean>;
  password: string;
}

export class AdminPlane extends React.PureComponent<AdminPlaneProps, AdminPlaneState> {
  state: Readonly<AdminPlaneState> = {
    checkInPhase: Maybe.None(),
    password: ""
  }

  getInfo = async (password: string) => {
    const checkInPhase = await isInCheckInPhase(password);
    this.setState({ checkInPhase: Maybe.Some(checkInPhase), password });
  }

  setCheckInPhase = async () => {
    const { checkInPhase, password } = this.state;
    const newValue = !checkInPhase.some();
    const response = await setCheckInPhase(newValue, password);
    this.setState({ checkInPhase: Some(response) });
  }

  render() {
    const { checkInPhase } = this.state;

    return (
      <React.Fragment>
        <PasswordDialog
          open={checkInPhase.isNone()}
          onSubmit={this.getInfo}
        />
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={checkInPhase.orSome(false)}
                onChange={this.setCheckInPhase}
                value="checkedB"
                color="primary"
              />
            }
            label="CheckIn Phase"
          />
        </FormGroup>
      </React.Fragment>
    )
  }
}

export default AdminPlane
