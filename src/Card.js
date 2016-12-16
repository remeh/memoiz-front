import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  MaximumForLargeText = 80;

  // ----------------------

  componentDidMount() {};
  componentWillUnmount() {};

  handleClick = () => {
  }

  computeClass = () => {
    var c = "card"; // base class

    if (this.props.text.length < this.MaximumForLargeText) {
      c += " large-text";
    }

    return c
  }

  // ----------------------

  render() {
    return (
      <div className={this.computeClass()}>
        {this.props.text}
      </div>
    );
  }
}

export default Card;
