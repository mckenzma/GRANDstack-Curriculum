import React, { useState, useRef } from "react";
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

import Testing from "./Testing";

// import RankSelect from "./RankSelect";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    /*<Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      <Box p={9}>{children}</Box>
    </Typography>*/
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}));

export default function TabsWrappedLabel({headerHeight}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const tabHeaderRef = useRef(null);
  const style = { top: headerHeight };
  const style2 = {
    marginTop:
      headerHeight// +
      //(tabHeaderRef.current ? tabHeaderRef.current.offsetHeight : 0)
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={style} className={classes.root} ref={tabHeaderRef}>
      <AppBar position="absolute" style={style2}>
        <Tabs
          value={value}
          onChange={handleChange}
          // aria-label="wrapped label tabs example"
          aria-label="scrollable force tabs example"
          // centered
          scrollButtons="on"
          variant="scrollable"
          // scrollButtons="on"
        >
          <Tab /*value="one"*/ label="Testing" {...a11yProps(0)} />
          <Tab /*value="two"*/ label="Rank" {...a11yProps(1)} />
          <Tab /*value="three"*/ label="Strike" {...a11yProps(2)} />
          <Tab /*value="four"*/ label="Block" {...a11yProps(3)} />
          <Tab /*value="five"*/ label="Kick" {...a11yProps(4)} />
          <Tab /*value="six"*/ label="Stance" {...a11yProps(5)} />
          <Tab /*value="seven"*/ label="Movement" {...a11yProps(6)} />
          <Tab /*value="eight"*/ label="Turn" {...a11yProps(7)} />
          <Tab /*value="nine"*/ label="Kata" {...a11yProps(8)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {/*Testing*/}
        {/*<RankSelect />*/}
        <Testing headerHeight={headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/*<Rank />*/}
        <Rank headerHeight={headerHeight}/>
        {/*<CreateRank />*/}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Strike headerHeight={headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/*<Block />*/}
      </TabPanel>
      <TabPanel value={value} index={4}>
        {/*<Kick />*/}
      </TabPanel>
      <TabPanel value={value} index={5}>
        {/*<Stance />*/}
      </TabPanel>
      <TabPanel value={value} index={6}>
        {/*<Movement />*/}
      </TabPanel>
      <TabPanel value={value} index={7}>
        {/*<Turn />*/}
      </TabPanel>
      <TabPanel value={value} index={8}>
        {/*<Kata />*/}
      </TabPanel>
    </div>
  );
}
