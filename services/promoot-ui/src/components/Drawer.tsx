
import * as React from 'react';
import { AppBar, Toolbar, IconButton, Hidden, Typography, Drawer, withStyles, Divider } from '@material-ui/core';
import { StyleRules, Theme, WithStyles } from '@material-ui/core/styles';
import MenuIcon from "@material-ui/icons/Menu";
import createPalette from '@material-ui/core/styles/createPalette';

const drawerWidth = 240;

const styles = (theme: Theme): StyleRules => ({
  root: {
    width: "100%",
    zIndex: 1,
    overflowX: "hidden"
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    position: "fixed",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  grow: {
    flex: "1 1 auto"
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    },
    color: "white"
  },
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      position: "fixed",
      height: "100%"
    }
  },
  toolbar: theme.mixins.toolbar,
  content: {
    marginTop: 64,
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth
    },
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  title: {
    color: "white"
  }
});

interface ResponsiveDrawerProps {
  title: string;
  listItems: JSX.Element;
}

interface ResponsiveDrawerState {
  mobileOpen: boolean;
}

class ResponsiveDrawer extends React.Component<ResponsiveDrawerProps & WithStyles, ResponsiveDrawerState> {
  state: Readonly<ResponsiveDrawerState> = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme, children, title, listItems } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        {listItems}
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" noWrap className={classes.title}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          {children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);