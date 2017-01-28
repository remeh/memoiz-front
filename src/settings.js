import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';

import Menu from './menu.js';

import './settings.css';
import './box.css';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
    }
  }

  toggleMenu = () => {
    let s = this.state;
    s.menu = !s.menu;
    this.setState(s);
  }

  render() {
    return (<div>
        <AppBar
          onLeftIconButtonTouchTap={this.toggleMenu}
          title={<span className="app-bar-title">Memoiz</span>}
        />
        <Menu
          open={this.state.menu}
          mode={'settings'}
          toggleMenu={this.toggleMenu}
        />
        <div className="settings-page">
          <div className="settings box">
            <h1>Settings</h1>
            <h3>Email</h3>
            <h4>me@remy.io</h4>
            <h3>Subscription</h3>
            <h4>Free trial until <strong>28 May 2017</strong></h4>
            <h3>Delete my account</h3>
          </div>
        </div>
    </div>)
  }
}

export default Settings;

