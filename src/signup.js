import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import XHRAccount from './xhr/account.js';

import './box.css';
import './signup.css';

class Signup extends Component {

  constructor(props) {
    super(props);

    // TODO(remy): send a request to check if the cookie
    // is still up. If so -> /memos


    this.state = {
      disableSubmit: false,

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

    this.setState({
      disableSubmit: true,
    });

    if (!this.validateFields()) {
      this.setState({
        disableSubmit: false,
      });
      return;
    }

    XHRAccount.signup(this.state.account.email, this.state.account.password, this.state.account.firstname).then((resp) => {
      setTimeout(() => {
        XHRAccount.login(this.state.account.email, this.state.account.password).then((resp) => {
          // first login, go to the onboarding
          browserHistory.push('/onboarding');
        }).catch((resp) => {
          // an error occurred during login, go to the login page.
          browserHistory.push('/login');
        });
      }, 500);
    }).catch((resp) => {
      this.setState({
        disableSubmit: false,
      });

      if (resp.status === 403) {
        let error = this.state.error;
        error.password = 'Password not strong enough.';
        this.setState({error: error});
        return;
      } else if (resp.status === 409) {
        let error = this.state.error;
        error.email = 'Email already used.';
        this.setState({error: error});
        return;
      }

      this.setState({passwordError: 'Error. Please try again.', password: ''});
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
      <div>
        <AppBar
          title={<span className="app-bar-title">Memoiz</span>}
          iconElementLeft={<span />}
        />
        <div className="signup">
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
            <RaisedButton type="submit" disabled={this.state.disableSubmit} label="Sign up" fullWidth={true} primary={true} onClick={this.submit}/>
            </form>
            <br />
            <a href="/login">You already have an account ? Click here to login.</a>
          </div>
          <div className="signup-information">
            <h2>Signing up to Memoiz is free for <em>7 days</em>.</h2>
            <hr />
            <h3>No payment info required</h3>
            <h4>For you to start using Memoiz, you do not need to provide any payment info.</h4>
            <h3>You will have access to every features</h3>
            <h4>Even during the free period, we want you to have access to every features of Memoiz, because they're all important.</h4>
            <h3>Any questions?</h3>
            <h4>We're reachable at <a href="mailto:contact@memoiz.com">contact@memoiz.com</a>, don't hesitate to contact us!</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
