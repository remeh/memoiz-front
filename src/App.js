import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import Cards from './Cards.js';
import Scratch from './Scratch.js';

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="app">
          <div className="app-container">
            <h1>MindScratch</h1>
            <Scratch>
              <Cards />
            </Scratch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
