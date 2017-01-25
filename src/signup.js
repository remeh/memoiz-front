import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import XHRAccount from './xhr/account.js';

import './box.css';

class Signup extends Component {

  constructor(props) {
    super(props);

    // TODO(remy): send a request to check if the cookie
    // is still up. If so -> /app

    this.state = {
      account: {
        email: '',
        password: '',
        passwordbis: '',
        firstname: '',
        lastname: '',
        gender: '',
        phone: '',
        address: '',
      },
      
      error: {
        email: '',
        password: '',
        passwordbis: '',
        firstname: '',
        lastname: '',
        gender: '',
        phone: '',
        address: '',
      },
    };
  }

  onEmailChange = (ev, val) => {
    let a = this.state.account;
    a.email = val;
    this.setState({account: a});
  }

  onPasswordChange = (ev, val) => {
    let a = this.state.account;
    a.password = val;
    this.setState({account: a});
  }

  onPasswordBisChange = (ev, val) => {
    let a = this.state.account;
    a.passwordbis = val;
    this.setState({account: a});
  }

  onFirstnameChange = (ev, val) => {
    let a = this.state.account;
    a.firstname = val;
    this.setState({account: a});
  }

  submit = (e) => {
    if (e) { e.preventDefault(); }

    if (!this.validateFields()) {
      return;
    }

    XHRAccount.signup(this.state.account.email, this.state.account.password, this.state.account.firstname).then((resp) => {
      browserHistory.push('/login');
    }).catch((resp) => {
      if (!resp) {
        // TODO(remy): deal with th error!
        this.setState({passwordError: 'Error. Please try again.', password: ''});
      } else if (resp.status === 403) {
        // TODO(remy): the password is not strong enough
      }
    });
  }

  // test for errors in the form
  validateFields = () => {
    let ok = true;
    let error = {};

    if (!this.state.account.email || this.state.account.email.indexOf('@') === -1) {
      error.email = 'Please enter a valid email.';
      ok = false;
    }

    if (!this.state.account.password) {
      error.password = 'Please enter a valid password.';
      ok = false;
    }

    if (!this.state.account.passwordbis) {
      error.passwordbis = 'Please enter a valid password.';
      ok = false;
    }

    if (this.state.account.passwordbis !== this.state.account.password) {
      error.password = 'Passwords are not matching.';
      error.passwordbis = 'Passwords are not matching.';
      ok = false;
    }

    if (!this.state.account.firstname) {
      error.firstname = 'Please enter a valid firstname.';
      ok = false;
    }

    this.setState({error: error});

    return ok;
  }

  // ----------------------
 
  render() {
    return (
      <div className="login-page">
        <div className="box">
          <form onSubmit={this.submit}>
          <h1>Sign up</h1>
          <TextField
            hintText="Email"
            onChange={this.onEmailChange}
            errorText={this.state.error.email}
          /><br />
          <TextField
            hintText="Password"
            type="password"
            onChange={this.onPasswordChange}
            errorText={this.state.error.password}
          /><br />
          <TextField
            hintText="Verify password"
            type="password"
            onChange={this.onPasswordBisChange}
            errorText={this.state.error.passwordbis}
          /><br />
          <TextField
            hintText="Firstname"
            onChange={this.onFirstnameChange}
            errorText={this.state.error.firstname}
          /><br />
          <br />
          <RaisedButton label="Sign up" fullWidth={true} primary={true} onClick={this.submit}/>
          </form>
          <br />
          <a href="/login">You already have an account ? Click here to login.</a>
        </div>
      </div>
    );
  }
}

export default Signup;
