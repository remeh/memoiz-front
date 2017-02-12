import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import XHRAccount from './xhr/account.js';
import './login.css';
import './box.css';

class Login extends Component {

  constructor(props) {
    super(props);

    // TODO(remy): check if the router wouldn't allow to do this ?
    XHRAccount.isAuth().then(() => {
      document.location = '/memos';
    });

    // TODO(remy): send a request to check if the cookie
    // is still up. If so -> /memos

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

    let p = this.state.password;
    this.setState({password: ''});

    XHRAccount.login(this.state.email, p).then((resp) => {
      // redirect to the app on success
      browserHistory.push('/memos');
    }).catch((resp) => {
      if (resp && resp.status === 403) {
        this.setState({passwordError: 'Invalid password'});
        return;
      }
      this.setState({passwordError: 'Error. Please try again.'});
    });
  }

  // ----------------------
 
  render() {
    return (
      <div>
        <AppBar
          title={<span className="app-bar-title">Memoiz</span>}
          iconElementLeft={<span />}
        />
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
              value={this.state.password}
              onChange={this.onPasswordChange}
              errorText={this.state.passwordError}
              onSubmit={this.submit}
            /><br />
            <br />
            <RaisedButton type="submit" label="Login" primary={true} onClick={this.submit} /><a className="link-forgot" alt="Click here if you've forgot your password" href="/forgotpassword">Forgot your password?</a><br/>
            </form>
            <br />
            <p>
              Not registered ? <a href="/signup">Click here to create an account.</a><br/>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
