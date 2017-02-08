import React, { Component } from 'react';
import Moment from 'react-moment';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Helpers from './helpers.js';
import { Menu, MenuModes } from './menu.js';
import XHRAccount from './xhr/account.js';

import './settings.css';
import './box.css';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,

      alert: false,

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
    }).catch((response) => Helpers.toLoginOrAlert(this, response));
}

  toggleMenu = () => {
    let s = this.state;
    s.menu = !s.menu;
    this.setState(s);
  }

  closeAlert = () => {
    this.setState({alert: false});
  }

  render() {
    return (<div>
        <AppBar
          onLeftIconButtonTouchTap={this.toggleMenu}
          title={<span className="app-bar-title">Memoiz</span>}
        />
        <Menu
          open={this.state.menu}
          mode={MenuModes.Settings}
          toggleMenu={this.toggleMenu}
        />
        <Dialog
          actions={<FlatButton
                    label="OK"
                    primary={true}
                    onTouchTap={this.closeAlert}
                  />}
          modal={false}
          open={this.state.alert}
          onRequestClose={this.closeAlert}
        >
          An error occured on our server, sorry for that. Please try refreshing the page.
        </Dialog>
        <div className="settings-page">
          <div className="settings box">
            <h1>Settings</h1>
            <h3>You</h3>
            <h4>{this.state.firstname} - {this.state.email}</h4>
            <h3>Subscription</h3>
            {this.state.subscribed && <h4><em>{this.state.plan.name} plan</em> valid until <strong><Moment format='LLL'>{this.state.planValidUntil}</Moment></strong></h4>}
            {!this.state.subscribed && this.state.trial && <h4>Free trial until <strong><Moment format='LLL'>{this.state.trialValidUntil}</Moment></strong></h4>}
            {!this.state.subscribed && !this.state.trial && <div><h4>Your free trial is over.</h4>
            <RaisedButton primary={true} onClick={this.gotoCheckout} label="discover our plans"></RaisedButton>
            </div>}
            <h3>Delete my account</h3>
            <h4>Contact us at <a href='mailto:support@memoiz.com'>contact@memoiz.com</a> to delete your account.</h4>
          </div>
        </div>
    </div>)
  }
}

export default Settings;
