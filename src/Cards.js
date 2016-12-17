import React, { Component } from 'react';
import './Cards.css';

class Cards extends Component {
  render() {
    return (
      <div className="card-container" onClick={this.handleClick}>
        {this.props.children}
      </div>
    )
  }
}

export default Cards;
