import React, { Component } from 'react';

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
    </div>
  }
}

export default Chip;
