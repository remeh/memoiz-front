import React, { Component } from 'react';
import { Router, IndexRoute, Route, browserHistory } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightBlue900,
        lightBlue700,
        grey400,
        lightBlue500,
        grey100,
        grey300,
        grey500,
        grey600,
        grey900,
        white,
        fullBlack,
        cyan500} from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Login from './login.js';

import Scratch from './scratch.js';
import './app.css';

injectTapEventPlugin();

let scratcheTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
  palette: {
    primary1Color: lightBlue700,
    primary2Color: lightBlue900,
    primary3Color: grey400,
    accent1Color: lightBlue500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: grey900,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: grey600,
    pickerHeaderColor: cyan500,
    clockCircleColor: grey600,
    shadowColor: fullBlack,
  },
});

const Webapp = React.createClass({
  render() {
      return <MuiThemeProvider muiTheme={scratcheTheme}>
        {this.props.children}
      </MuiThemeProvider>
  }
});

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Webapp}>
          <IndexRoute component={Login} />
          <Route path="app" component={Scratch} />
          <Route path="login" component={Login} />
          <Route path="*" component={Login}/>
        </Route>
      </Router>
    );
  }
}

export default App;
