import React, { Component } from 'react';
import Moment from 'react-moment';

import AppBar from 'material-ui/AppBar';

import XHRAccount from './xhr/account.js';
import Menu from './menu.js';

import './settings.css';
import './box.css';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,

      trial: false,
      trialValidUntil: null,

      subscribed: false,
      plan: {},
      planValidUntil: null,
    }

    XHRAccount.infos().then((response) => {
      this.setState({
        firstname: response.firstname,
        email: response.email,
        trial: response.trial,
        trialValidUntil: response.free_trial_valid_until,
        subscribed: response.subscribed,
        plan: response.plan,
        planValidUntil: response.subscription_valid_until,
      });
    }).catch((response) => {
      // XXX(remy): TODO TODO TODO!
    });
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
            <h3>You</h3>
            <h4>{this.state.firstname} - {this.state.email}</h4>
            <h3>Subscription</h3>
            TODO TODO TODO
            <h4>Free trial until <strong>28 May 2017</strong></h4>
            <h3>Delete my account</h3>
          </div>
        </div>
    </div>)
  }
}

export default Settings;

