import React, { Component } from 'react';
import './App.css';
//import UserList from './UserList';
import RankList from './RankList';
import StrikeList from './StrikeList';
import BlockList from './BlockList';
import KickList from './KickList';

import SimpleAppBar from './SimpleAppBar';
import SimpleSelect from './SimpleSelect';

// import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: 700,
    margin: "auto",
    marginTop: theme.spacing.unit * 3,
  },
});

class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className="App">
        {/*<header className="App-header">
          {/*<img src={process.env.PUBLIC_URL + '/img/grandstack.png'} className="App-logo" alt="logo" />*/}
          {/*<h1 className="App-title">Curriculum</h1>
        </header>*/}
        
        <SimpleAppBar />

        <Paper className={this.props.classes.root} elevation={1}>
          <Typography variant="h5" component="h3">
            Select a Rank
            <SimpleSelect />
          </Typography>
          <Typography component="p">
            {/*Paper can be used to build surface or other elements for your application.*/}
          

            {/*<UserList />*/}
            {/*<RankList />*/}
            <StrikeList />
            <BlockList />
            <KickList />

        </Typography>
        </Paper>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// export default App;
export default withStyles(styles)(App);
