import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './Card.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>MindScratch</h2>
        </div>
        <form className="App-form">
          <input type="text"></input>
        </form>
        <Card text='Coucou' />
      </div>
    );
  }
}

export default App;
