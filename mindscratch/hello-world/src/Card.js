import React, { Component } from 'react';

class Card extends Component {
  componentDidMount() {};
  componentWillUnmount() {};

  handleClick = () => {
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        Content of the card {this.props.text}
      </div>
    );
  }
}

export default Card;
