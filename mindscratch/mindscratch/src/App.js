import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import Card from './Card.js';
import Cards from './Cards.js';
import Scratch from './Scratch.js';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="app">
          <div className="app-container">
            <h1>MindScratch</h1>
            <Scratch />
            <Cards>
              <Card text='Coucou' />
              <Card text='Pensez à nettoyer LE CHAT' />
              <Card text='Prout pouet prout prout. Jamais !' />
            </Cards>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
