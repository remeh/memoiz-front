import React, { Component } from 'react';
import Card from './Card.js';
import './Cards.css';

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: props.cards,
      idx: props.idx,
    }
  }

  cardDragStart = (event, id) => {
  }

  cardDragOver = (event, id) => {
  }

  cardDragEnd = (event, id) => {
  }

  cardDragLeave = (event, id) => {
  }

  cardDrop = (event, id) => {
    var src = this.state.idx[event.dataTransfer.getData('text/plain')];
    var dst = this.state.idx[id];

    var left = this.state.cards[dst];
    var right = this.state.cards[src];

    this.setState({
      cards: [left, right],
    })
  }

  render() {
    return (
      <div className="card-container" onClick={this.handleClick}>
        {this.state.cards.map(
          (card) => <Card
              key={card.id}
              card_id={card.id}
              text={card.text}
              cardDragStart={this.cardDragStart}
              cardDragOver={this.cardDragOver}
              cardDragEnd={this.cardDragEnd}
              cardDragLeave={this.cardDragLeave}
              cardDrop={this.cardDrop}
            >
            </Card>
        )}
      </div>
    )
  }
}

export default Cards;
