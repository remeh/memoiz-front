import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  componentDidMount() {};
  componentWillUnmount() {};

  handleClick = () => {
  }

  render() {
    return (
      <div className="card">
        {this.props.text}
      </div>
    );
  }
}

export default Card;
