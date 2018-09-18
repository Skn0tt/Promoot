import * as React from "react";
import { Snackbar } from "@material-ui/core";

interface InfoBarProps {
  items: string[];
  onChange: (infos: string[]) => void;
}

const omitItem =
  <T extends any>(item: T) =>
  (values: T[]): T[] =>
  values.filter(v => v !== item)

export class InfoBar extends React.PureComponent<InfoBarProps> {

  render() {
    const { items, onChange } = this.props;

    return (
      <React.Fragment>
        {items.concat(items).map((info, i) => (
          <Snackbar
            key={i}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={true}
            autoHideDuration={1000 * 3}
            onClose={() => onChange(omitItem(info)(items))}
            message={info}
          />
        ))}
      </React.Fragment>
    );
  }
}
