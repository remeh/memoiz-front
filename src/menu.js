import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import Subheader from 'material-ui/Subheader';

import XHRAccount from './xhr/account.js';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
    })
  }

  logout = () => {
    XHRAccount.logout().then((resp) => {
      if (resp.ok) {
        browserHistory.push('/');
      }
    })
  }

  // ----------------------

  // NOTE(remy): I've disabled swipe to open because
  // it seems like having trouble with the 
  // cards drag'n'drop.

  render() {
    return <Drawer
        docked={false}
        open={this.state.open}
        disableSwipeToOpen={true}
        onRequestChange={(open) => this.setState({open})}>
          <Subheader>Firstname</Subheader>
          <Divider />
          <MenuItem primaryText="Logout" onClick={this.logout} leftIcon={<PowerSettingsNew />} />
      </Drawer>
  }
}

export default Menu;
