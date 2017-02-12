import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import './box.css';
import './forgotpassword.css';

import XHRAccount from './xhr/account.js';

class ForgotPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: '',
      disable: false,
      sent: false,
    };
  }

  onEmailChange = (ev, val) => {
    this.setState({email: val, emailError: ''});
  }

  submit = (event) => {
    event.preventDefault();

    this.setState({emailError: ''});

    if (!this.state.email.includes('@') 
        || !this.state.email.includes('.')) {
      this.setState({emailError: 'Please enter a valid email address.'});
      return;
    }

    this.setState({disable: true});

    XHRAccount.forgotPassword(this.state.email).then(() => {
      this.setState({
        sent: true,
        disable: false,
      });
    }).catch(() => {
      this.setState({
        emailError: 'An error occurred, please retry.',
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
              <p>Fill here the email used to sign in to Memoiz. We will send you instructions to reset your password.</p>
              <TextField
                hintText="Your email"
                onChange={this.onEmailChange}
                errorText={this.state.emailError}
              /><br />
              <br />
              <RaisedButton type="submit" disabled={this.state.disable} label="Reset my password" fullWidth={true} primary={true} onClick={this.submit}/>
            </form>}
            {this.state.sent && <span>Instructions have been sent to your email to reset your password.</span>}
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
