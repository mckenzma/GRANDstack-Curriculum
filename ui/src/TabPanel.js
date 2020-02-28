import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

// import Registration from "./Registration";
// import RingList from "./RingList";
// import DivisionList from "./DivisionList";
// import CompetitorList from "./CompetitorList";
// import Summary from "./Summary";

// import Rank from "./Rank";
// import CreateRank from "./CreateRank";
import Rank from "./Rank2";

// import Strike from "./Strike";
import Strike from "./Strike2";
// import Block from "./Block";
// import Kick from "./Kick";
// import Stance from "./Stance";
// import Movement from "./Movement";
// import Turn from "./Turn";
// import Kata from "./Kata";

import RankSelect from "./RankSelect";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      <Box p={9}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}));

export default function TabsWrappedLabel() {
  const classes = useStyles();
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          centered
          // variant="scrollable"
          // scrollButtons="on"
        >
          <Tab value="one" label="Testing" wrapped {...a11yProps("one")} />
          <Tab value="two" label="Rank" wrapped {...a11yProps("two")} />
          <Tab value="three" label="Strike" {...a11yProps("three")} />
          <Tab value="four" label="Block" {...a11yProps("four")} />
          <Tab value="five" label="Kick" {...a11yProps("five")} />
          <Tab value="six" label="Stance" {...a11yProps("six")} />
          <Tab value="seven" label="Movement" {...a11yProps("seven")} />
          <Tab value="eight" label="Turn" {...a11yProps("eight")} />
          <Tab value="nine" label="Kata" {...a11yProps("nine")} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index="one">
        {/*Testing*/}
        <RankSelect />
      </TabPanel>
      <TabPanel value={value} index="two">
        {/*<Rank />*/}
        <Rank />
        {/*<CreateRank />*/}
      </TabPanel>
      <TabPanel value={value} index="three">
        <Strike />
      </TabPanel>
      <TabPanel value={value} index="four">
        {/*<Block />*/}
      </TabPanel>
      <TabPanel value={value} index="five">
        {/*<Kick />*/}
      </TabPanel>
      <TabPanel value={value} index="six">
        {/*<Stance />*/}
      </TabPanel>
      <TabPanel value={value} index="seven">
        {/*<Movement />*/}
      </TabPanel>
      <TabPanel value={value} index="eight">
        {/*<Turn />*/}
      </TabPanel>
      <TabPanel value={value} index="nine">
        {/*<Kata />*/}
      </TabPanel>
    </div>
  );
}
