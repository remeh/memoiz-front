import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Scratch from './scratch.js';
import './app.css';

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="app">
          <AppBar
            title="Scratche"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <div className="app-container">
            <Scratch />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
