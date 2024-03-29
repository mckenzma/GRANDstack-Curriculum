import React, { /*useState,*/ useRef } from "react";
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

import Technique from "./Technique";

// import Strike2 from "./Strike";
import Strike from "./Strike2";
// import Block from "./Block";
import Block from "./Block2";
// import Kick from "./Kick";
import Kick from "./Kick2";
// import Stance from "./Stance";
import Stance from "./Stance2";
// import Movement from "./Movement";
import Movement from "./Movement2";
// import Turn from "./Turn";
import Turn from "./Turn2";
// import Kata from "./Kata";
import Kata from "./Kata2";

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
      {value === index && 
        <Box /*p={3}*/>
          {/*<Typography>*/}{children}{/*</Typography>*/}
        </Box>
      }
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
          <Tab label="Testing" {...a11yProps(0)} />
          <Tab label="Rank" {...a11yProps(1)} />
          <Tab label="Technique" {...a11yProps(2)} />
          {/*<Tab label="Strike" {...a11yProps(3)} />
          <Tab label="Block" {...a11yProps(4)} />
          <Tab label="Kick" {...a11yProps(5)} />
          <Tab label="Stance" {...a11yProps(6)} />
          <Tab label="Movement" {...a11yProps(7)} />
          <Tab label="Turn" {...a11yProps(8)} />*/}
          <Tab label="Kata" {...a11yProps(3)} />
          {/*<Tab /*value="nine"* / label="MDS" {...a11yProps(9)} />*/}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {/*Testing*/}
        {/*<RankSelect />*/}
        <Testing headerHeight={1.5*headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Rank headerHeight={1.5*headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Technique headerHeight={1.5*headerHeight}/>
      </TabPanel>
      {/*<TabPanel value={value} index={3}>
        <Strike headerHeight={headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Block headerHeight={headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Kick headerHeight={headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <Stance headerHeight={headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={7}>
        <Movement headerHeight={headerHeight}/>
      </TabPanel>
      <TabPanel value={value} index={8}>
        <Turn headerHeight={headerHeight}/>
      </TabPanel>*/}
      <TabPanel value={value} index={3}>
        <Kata headerHeight={1.5*headerHeight}/>
      </TabPanel>
      {/*<TabPanel value={value} index={9}>
        
      </TabPanel>*/}
    </div>
  );
}
