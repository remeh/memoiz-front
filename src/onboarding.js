import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Step, Stepper, StepButton, StepContent } from 'material-ui/Stepper';

import { Menu, MenuModes } from './menu.js';
import XHRMemo from './xhr/memo.js';

import './box.css';
import './onboarding.css';

class Onboarding extends Component {

  constructor(props) {
    super(props);

    this.state = {
      menu: false,
      stepIndex: 0,
      memo: '',
      backLabel: 'Back',
    }
  }

  toggleMenu = () => {
    let s = this.state;
    s.menu = !s.menu;
    this.setState(s);
  }

  handleNext = () => {
    const {stepIndex} = this.state;

    if (stepIndex === 1 && this.state.memo.length > 0) {
      const val = this.state.memo;
      XHRMemo.postMemo(val, true);
      this.setState({
        memo: '',
      });
    }

    if (stepIndex === 1) {
      this.setState({ backLabel: 'Another memo' });
    }

    if (stepIndex < 2) {
      this.setState({ stepIndex: stepIndex + 1 });
    } else {
      // end of the onboarding
      document.location = '/memos';
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    this.setState({ backLabel: 'Back' });
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  renderStepActions(step) {
    return (
    <div style={{margin: '12px 0'}}>
      <RaisedButton
        label="Next"
        disableTouchRipple={true}
        disableFocusRipple={true}
        primary={true}
        onTouchTap={this.handleNext}
        style={{marginRight: 12}}
      />
      {step > 0 && (
      <FlatButton
        label={this.state.backLabel}
        disableTouchRipple={true}
        disableFocusRipple={true}
        onTouchTap={this.handlePrev}
        />
      )}
    </div>
    );
  }

  memoChange = (event, val) => {
    this.setState({memo: val});
  }
 
  render() {
    const {stepIndex} = this.state;

    return (
      <div>
        <AppBar
          title={<span className="app-bar-title">Memoiz</span>}
          onLeftIconButtonTouchTap={this.toggleMenu}
        />
        <Menu
          open={this.state.menu}
          mode={MenuModes.Settings}
          toggleMenu={this.toggleMenu}
        />
        <div>
          <div className="onboarding box">
            <h1>Welcome to Memoiz</h1>
            <Stepper
              activeStep={stepIndex}
              linear={false}
              orientation="vertical"
            >
              <Step>
                <StepButton onTouchTap={() => this.setState({stepIndex: 0})}>
                  Welcome
              </StepButton>
                <StepContent>
                  <h3>You are now ready to start adding your memos.</h3>
                  <Paper className="img-paper" circle={true}>
                    <img className="img" src="/onboarding1.png" role="presentation" />
                  </Paper>
                  {this.renderStepActions(0)}
              </StepContent>
              </Step>
              <Step>
                <StepButton onTouchTap={() => this.setState({stepIndex: 1})}>
                First memo
              </StepButton>
                <StepContent>
                  <p>Write here your favorite movie, artist or video game or whatever is on your mind.</p>
                  <TextField hintText="e.g. John Butler Trio" onChange={this.memoChange} value={this.state.memo}/>
                  {this.renderStepActions(1)}
              </StepContent>
              </Step>
              <Step>
                <StepButton onTouchTap={() => this.setState({stepIndex: 2})}>
                  Ready 
              </StepButton>
                <StepContent>
                  <p>
                    We've added it to your memos list and you'll be reminded about it!
                    <br />
                    You are now ready to start using Memoiz. If you got any question or feedback, don't hesitate to contact us at <a href="mailto:contact@memoiz.com">contact@memoiz.com</a>!
                  </p>
                  {this.renderStepActions(2)}
              </StepContent>
              </Step>
            </Stepper>
          </div>
        </div>
      </div>
    );
  }
}

export default Onboarding;
