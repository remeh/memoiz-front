import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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
      }
      
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
    this.setState({account: {email: val}});
  }

  onPasswordChange = (ev, val) => {
    this.setState({account: {password: val}});
  }

  onPasswordBisChange = (ev, val) => {
    this.setState({account: {passwordbis: val}});
  }

  onFirstnameChange = (ev, val) => {
    this.setState({account: {firstname: val}});
  }

  submit = () => {
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

    XHRLogin.sendLogin(this.state.email, this.state.password).then((resp) => {
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
        <div className="login">
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
          /><br />
          <TextField
            hintText="Verify password"
            type="password"
            onChange={this.onPasswordBisChange}
            errorText={this.state.passwordBisError}
          /><br />
          <TextField
            hintText="Firstname"
            onChange={this.onFirstnameChange}
            errorText={this.state.firstnameBisError}
          /><br />
          <br />
          <RaisedButton label="Login" fullWidth={true} primary={true} onClick={this.submit}/>
        </div>
      </div>
    );
  }
}

export default Login;
