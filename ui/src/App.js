import React, { Component } from 'react';
import './App.css';
//import UserList from './UserList';
import RankList from './RankList';

import SimpleAppBar from './SimpleAppBar';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<header className="App-header">
          {/*<img src={process.env.PUBLIC_URL + '/img/grandstack.png'} className="App-logo" alt="logo" />*/}
          {/*<h1 className="App-title">Curriculum</h1>
        </header>*/}
        
        <SimpleAppBar />

        {/*<UserList />*/}
        <RankList />
      </div>
    );
  }
}

export default App;
