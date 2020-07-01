import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import clsx from "clsx";

// import React from 'react';
// import PropTypes from "prop-types";
// import classNames from "classnames";
// import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import List from "@material-ui/core/List";
// import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import { mailFolderListItems, otherMailFolderListItems } from "./tileData";

import HomeIcon from "@material-ui/icons/Home";
import CropFreeIcon from "@material-ui/icons/CropFree";
import ListIcon from "@material-ui/icons/List";
import PersonIcon from "@material-ui/icons/Person";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import TabPanel from "./TabPanel";

// import Timeline from "./Timeline";

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';
// import grey from '@material-ui/core/colors/grey';
// import green from '@material-ui/core/colors/green';

const drawerWidth = 240;

// const styles = theme => ({
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    // height: 430,
    height: "100%",
    // height: "auto",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    // position: 'absolute',
    // position: 'flex',
    display: "flex",
    // width: "100%",
    flexGrow: 1
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // backgroundColor: "black",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  },
}));


/*use this to set theme colors*/
const theme2 = createMuiTheme({
  palette: {
    // primary: purple,
    // primary: grey[900],
    primary: {
      main: "#212121" // "black"
    },
    // secondary: green,
    secondary: {
      main: "#ffeb3b" // "yellow"
    },
  },
  status: {
    danger: 'orange',
  },
});

export default function App() {
// class App extends Component {
  // state = {
  //   open: false,
  //   anchor: "left"
  // };
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState("left");

  const handleDrawerOpen = () => {
    // this.setState({ open: true });
    setOpen(true);
  };

  const handleDrawerClose = () => {
    // this.setState({ open: false });
    setOpen(false);
  };

  // const handleChangeAnchor = event => {
  //   // this.setState({
  //   //   anchor: event.target.value
  //   // });
  //   setAnchor(event.target.value);
  // };

  // render() {
    // const { classes, theme } = this.props;
    // const { anchor, open } = this.state;

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={/*this.*/handleDrawerClose}>
            {classes.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <CropFreeIcon />
          </ListItemIcon>
          <ListItemText primary="Rings" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Divisions" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Competitors" />
        </ListItem>
        <Divider />
        {/*<List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>*/}
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === "left") {
      before = drawer;
    } else {
      after = drawer;
    }

    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);
    useEffect(() => {
      if (headerRef) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      // window.temp = headerRef.current;
    });


    return (
    <ThemeProvider theme={theme2}> {/*use this to set theme colors*/}
      <div className="App">
        {/*<header className="App-header">
          {/*<img src={process.env.PUBLIC_URL + '/img/grandstack.png'} className="App-logo" alt="logo" />*/}
        {/*<h1 className="App-title">UFAF ITC</h1>
        </header>*/}

        <div className={classes.root}>
          {/*<TextField
          id="persistent-anchor"
          select
          label="Anchor"
          value={anchor}
          onChange={this.handleChangeAnchor}
          margin="normal"
        >
          <MenuItem value="left">left</MenuItem>
          <MenuItem value="right">right</MenuItem>
        </TextField>*/}
          <div className={classes.appFrame}>
            <AppBar
              ref={headerRef}
              // className={classNames(classes.appBar, {
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                [classes[`appBarShift-${anchor}`]]: open
                // })}
              })}
            >
              <Toolbar disableGutters={!open}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={/*this.*/handleDrawerOpen}
                  // className={classNames(
                  className={
                    clsx(classes.menuButton, open && classes.hide)
                    // )}
                  }
                >
                  <MenuIcon />
                </IconButton>
                {/*<Typography variant="h6" color="inherit" noWrap>*/}
                <Typography color="inherit" noWrap>
                  UFAF Curriculum
                </Typography>
              </Toolbar>
            </AppBar>
            {before}
            <main
              className={
                clsx(classes.content, classes[`content-${anchor}`], {
                  [classes.contentShift]: open,
                  [classes[`contentShift-${anchor}`]]: open
                })
              }
            >
              {/*<div className={classes.drawerHeader} />*/}


              <TabPanel headerHeight={headerHeight}/>

            </main>
            {after}
          </div>
        </div>
      </div>
      </ThemeProvider>
    );
  // }
}

// App.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired
// };

// export default withStyles(styles, { withTheme: true })(App);
// export default App;
