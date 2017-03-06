import React, { Component } from 'react';

import grey500 from 'material-ui/styles/colors';
import Alarm from 'material-ui/svg-icons/action/alarm';
import Close from 'material-ui/svg-icons/navigation/close';

import './chip.css';

class Chip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      readyToClose: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      text: nextProps.text,
    })
  }

  className = () => {
    let c = 'chip';
    if (this.props.editMode) {
      c += ' editmode';
    }
    if (this.state.readyToClose) {
      c += ' ready-to-close';
    }
    return c;
  }

  toggle = () => {
    if (!this.props.editMode) {
      return;
    }

    if (!this.state.readyToClose) {
      this.setState({
        text: 'Click again to delete',
        readyToClose: true,
      });
    } else {
      if (this.props.removeCat) {
        this.props.removeCat();
      }
    }
  }

  render() {
    if (!this.props.text && !(this.props.reminder > 0)) {
      return null
    }

    return <div className="chip-container">
      {this.props.text &&
        <div onClick={this.toggle} className={this.className()}>
          {this.state.text}
          {this.props.editMode && <Close viewBox='-5 -5 24 24' style={{color: 'white', width: '14px', height: '14px', margin: '0px', padding: '0px'}} />}
        </div>
      }
      {this.props.reminder > 0 && <Alarm style={{marginLeft: '4px', width: '18px', height: '18px'}} color={grey500} />}
    </div>
  }
}

export default Chip;
