import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import './box.css';
import './passwordreset.css';

import XHRAccount from './xhr/account.js';

class PasswordReset extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordBis: '',
      passwordError: '',
      passwordBisError: '',
      disable: false,
      sent: false,
    };
  }

  onPasswordChange = (ev, val) => {
    this.setState({password: val, passwordError: ''});
  }

  onPasswordBisChange = (ev, val) => {
    this.setState({passwordBis: val, passwordBisError: ''});
  }

  submit = (event) => {
    event.preventDefault();

    this.setState({passwordError: '', passwordBisError: ''});

    if (this.state.password !== this.state.passwordBis) {
      this.setState({passwordBisError: 'Passwords don\'t match.'});
      return;
    }

    if (!this.props.location.query.t ||
        this.props.location.query.t.length === 0) {
      this.setState({passwordError: 'Error with the form, please click again in the link in the email.'});
    }

    this.setState({disable: true});

    XHRAccount.passwordReset(this.state.password, this.props.location.query.t).then(() => {
      this.setState({
        sent: true,
        disable: false,
      });
    }).catch((resp) => {
      resp.json().then((j) => {
        if (j.param === 'token') {
          this.setState({
            passwordError: 'Wrong token.',
          });
        }
      }).catch(() => {
        this.setState({
          passwordError: 'An error occurred, please retry.',
        });
      });

      this.setState({
        disable: false,
      });
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title={<span className="app-bar-title">Memoiz</span>}
          iconElementLeft={<span />}
        />
        <div className="forgot-page">
          <div className="box">
            {!this.state.sent && <form onSubmit={this.submit}>
              <h1>Password reset</h1>
              <p>
                Fill here the new password you want for you account
              </p>
              <TextField
                hintText="New password"
                type="password"
                onChange={this.onPasswordChange}
                errorText={this.state.passwordError}
              /><br />
              <TextField
                hintText="Repeat your new password"
                type="password"
                onChange={this.onPasswordBisChange}
                errorText={this.state.passwordBisError}
              /><br />
              <br />
              <RaisedButton type="submit" disabled={this.state.disable} label="Reset my password" fullWidth={true} primary={true} onClick={this.submit}/>
            </form>}
            {this.state.sent && <span>Your password has been changed. <a href='/login' alt='Click here to login.'>Click here to go to the login page</a>.</span>}
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordReset;
