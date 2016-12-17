import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Cards from './Cards.js';
import Card from './Card.js';
import randomUuid from './Uuid.js';

class Scratch extends Component {
  constructor(props) {
    super(props);

    var cards = [];
    var idx = {};

    cards.push(this.newCard('Hello'));
    cards.push(this.newCard('World'));
    cards.push(this.newCard('!'));
    cards.push(this.newCard('A'));
    cards.push(this.newCard('B'));
    cards.push(this.newCard('C'));

    for (var i = 0; i < cards.length; i++) {
      idx[cards[i].id] = i;
    }

    this.state = {
      scratchValue: "",
      cards: cards,
      idx: idx,
    };
  }

  // scratch adds a new card entry in the cards.
  scratch = () => {
    var d = this.state.scratchValue;

    if (!d.length) {
      return;
    }

    var card = this.newCard(d);

    // add the scratch
    // ----------------------

    var cards = this.state.cards.slice();
    var l = cards.push(card) - 1;

    var idx = Object.assign({}, this.state.idx);
    idx[card.id] = l;

    this.setState({
      scratchValue: "",
      cards: cards,
      idx: idx,
    });
  }

  // newCard generates a card object.
  newCard(text) {
    return {
      id: randomUuid(),
      text: text,
    }
  }

  // onScratchChange is called when the value in the
  // text field is changing.
  onScratchChange = (event) => {
    this.setState({
      scratchValue: event.target.value
    });
  }

  cardDragStart = (event) => {};
  cardDragOver = (event) => {};
  cardDragEnd = (event) => {};
  cardDragLeave = (event) => {};
  cardDrop = (event, id) => {
    var src_id = event.dataTransfer.getData("text/plain");
    var dst_id = id;

    var left_idx = this.state.idx[src_id];
    var right_idx = this.state.idx[dst_id];

    var left = this.state.cards[left_idx];
    var right = this.state.cards[right_idx];

    if (!left || !right) {
      console.warn('undefined left or right.');
      return;
    }

    var idx = Object.assign({}, this.state.idx);
    var cards = this.state.cards.slice();

    cards[left_idx] = right;
    cards[right_idx] = left;

    idx[src_id] = right_idx;
    idx[dst_id] = left_idx;

    this.setState({
      idx: idx,
      cards: cards,
    });
  };

  render() {
    return (
      <div>
        <TextField id="scratchInput" onChange={this.onScratchChange} value={this.state.scratchValue} fullWidth={true} multiLine={true} placeholder="Scratch here" />
        <RaisedButton id="scratchButton" onClick={this.scratch} label="Store" fullWidth={true} />
        <hr />
        <div>
          <Cards>
            {this.state.cards.map(
              (card) => <Card
                  key={card.id}
                  card_id={card.id}
                  text={card.text}
                  onDragStart={this.cardDragStart}
                  onDragOver={this.cardDragOver}
                  onDragEnd={this.cardDragEnd}
                  onDragLeave={this.cardDragLeave}
                  onDrop={this.cardDrop}
                />
            )}
          </Cards>
        </div>
      </div>
    )
  }
}

export default Scratch;
