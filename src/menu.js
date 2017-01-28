import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import Create from 'material-ui/svg-icons/content/create';
import CreditCard from 'material-ui/svg-icons/action/credit-card';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Forum from 'material-ui/svg-icons/communication/forum';
import MenuItem from 'material-ui/MenuItem';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Subheader from 'material-ui/Subheader';

import XHRAccount from './xhr/account.js';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: props.mode,
      open: props.open,
      checkout: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
    })

    if (nextProps.mode) {
      this.setState({
        mode: nextProps.mode,
      });
    }
  }

  logout = () => {
    XHRAccount.logout().then((resp) => {
      if (resp.ok) {
        browserHistory.push('/');
      }
    })
  }

  support = () => {
    document.location = 'mailto:support@memoiz.com';
  }

  requestChange = () => {
    this.props.toggleMenu();
  }

  memo = () => {
    this.props.toggleMenu();
    this.props.onMemo();
  }

  goToCheckout = () => {
    this.props.toggleMenu();
    browserHistory.push('/checkout');
  }

  goToMemoiz = () => {
    this.props.toggleMenu();
    browserHistory.push('/app');
  }

  // ----------------------

  render() {
    return <Drawer
        docked={false}
        open={this.state.open}
        onRequestChange={this.requestChange}>
          <Subheader><strong>Memoiz</strong></Subheader>
          {this.props.mode === 'memoiz' && (<div><Divider />
            <MenuItem primaryText="Write a memo" onClick={this.memo} leftIcon={<Create />} />
            <Divider />
            <MenuItem primaryText="Checkout" onClick={this.goToCheckout} leftIcon={<CreditCard />} />
              </div>
          )}
          {this.props.mode === 'checkout' && (<div>
            <MenuItem primaryText="Back to application" onClick={this.goToMemoiz} leftIcon={<ArrowBack />} />
            <Divider />
            </div>
          )}
          <MenuItem primaryText="Support" onClick={this.support} leftIcon={<Forum />} />
          <MenuItem primaryText="Logout" onClick={this.logout} leftIcon={<PowerSettingsNew />} />
      </Drawer>
  }
}

export default Menu;
