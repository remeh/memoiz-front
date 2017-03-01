import React, { Component } from 'react';

import grey500 from 'material-ui/styles/colors';
import Alarm from 'material-ui/svg-icons/action/alarm';

import './chip.css';

class Chip extends Component {

  render() {
    if (!this.props.text) {
      return null
    }

    return <div className="chip-container">
      <div className="chip">
        {this.props.text}
      </div>
        {this.props.reminder > 0 && <Alarm style={{marginLeft: '4px', width: '18px', height: '18px'}} color={grey500} />}
    </div>
  }
}

export default Chip;
