import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import XHRAccount from './xhr/account.js';
import './login.css';
import './box.css';

class Login extends Component {

  constructor(props) {
    super(props);

    // TODO(remy): send a request to check if the cookie
    // is still up. If so -> /app

    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
    };
  }

  onEmailChange = (ev, val) => {
    this.setState({email: val});
  }

  onPasswordChange = (ev, val) => {
    this.setState({password: val});
  }

  submit = (e) => {
    if (e) { e.preventDefault(); }

    let error = false;

    if (!this.state.email || this.state.email.indexOf('@') === -1) {
      this.setState({
        emailError: 'Please enter a valid email.',
      });
      error = true;
    } else { this.setState({emailError: ''}) }
    
    if (!this.state.password) {
      this.setState({
        passwordError: 'Please enter your password.',
      });
      error = true;
    } else { this.setState({passwordError: ''}) }

    if (error) {
      return;
    }

    XHRAccount.login(this.state.email, this.state.password).then((resp) => {
      // redirect to the app on success
      browserHistory.push('/app');
    }).catch((resp) => {
      if (!resp) {
        this.setState({passwordError: 'Error. Please try again.', password: ''});
      } else if (resp.status === 403) {
        this.setState({passwordError: 'Invalid password', password: ''});
      }
    });
  }

  // ----------------------
 
  render() {
    return (
      <div className="login-page">
        <div className="box">
          <form onSubmit={this.submit}>
          <h1>Login</h1>
          <TextField
            hintText="Email"
            onChange={this.onEmailChange}
            errorText={this.state.emailError}
          /><br />
          <TextField
            hintText="Password"
            type="password"
            onChange={this.onPasswordChange}
            errorText={this.state.passwordError}
            onSubmit={this.submit}
          /><br />
          <br />
          <RaisedButton type="submit" label="Login" fullWidth={true} primary={true} onClick={this.submit}/>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
