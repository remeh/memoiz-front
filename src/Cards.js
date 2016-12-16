import React, { Component } from 'react';
import Card from './Card.js';
import './Cards.css';
import randomUuid from './Uuid.js';

class Cards extends Component {
  render() {
    return (
      <div className="card-container" onClick={this.handleClick}>
        {this.props.cards.map(
          (card) => <Card key={randomUuid()} text={card.text}></Card>
        )}
      </div>
    )
  }
}

export default Cards;
