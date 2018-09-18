import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core";

interface PasswordDialogProps {
  onSubmit: (candidate: string) => void;
  onCancel: () => void;
  open: boolean;
}

interface PasswordDialogState {
  value: string;
}

export class PasswordDialog extends React.PureComponent<PasswordDialogProps, PasswordDialogState> {

  state: Readonly<PasswordDialogState> = {
    value: ""
  }

  render() {
    const { onSubmit, open, onCancel } = this.props;
    const { value } = this.state;

    return (
      <Dialog
        open={open}
      >
        <DialogTitle>Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To access the admin page, please enter the admin password.
          </DialogContentText>
          <TextField
            onChange={({ target: { value }}) => this.setState({ value })}
            autoFocus
            label="Password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => onSubmit(value)} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}