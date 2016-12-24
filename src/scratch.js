import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Card from './card.js';
import XHRScratch from './xhr/scratch.js';
import randomUuid from './uuid.js';

import './scratch.css';

class Scratch extends Component {
  constructor(props) {
    super(props);

    this.state =  {
      scratchValue: "",
      cards: [],
      idx: {},
    }

    this.fetchCards();
  }

  // onReceiveCards is called
  onReceiveCards = (texts) => {
  }

  // scratch adds a new card entry in the cards.
  addCard = () => {
    var d = this.state.scratchValue;

    if (!d.length) {
      return;
    }

    var card = this.newCard(d);

    // add the scratch
    // ----------------------

    var cards = this.state.cards.slice();
    cards.unshift(card);

    var idx = Object.assign({}, this.state.idx);
    for (var k in idx) { // offset every existing indexes.
      if (idx[k] !== undefined) {
        idx[k] += 1;
      }
    }

    idx[card.uid] = 0; // new entry at first position

    // backend hit to add the card
    // ----------------------

    XHRScratch.postCard('12341234-1234-1234-1234-123412341234', d)
      .then((json) => {
        console.log(json);
    });

    // re-render the view
    // ----------------------

    this.setState({
      scratchValue: "",
      cards: cards,
      idx: idx,
    });
  }

  // newCard generates a card object.
  newCard(text) {
    return {
      uid: randomUuid(),
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

  // XHR
  // ----------------------

  fetchCards = () => {
    XHRScratch.getCards('12341234-1234-1234-1234-123412341234').then((json) => {
      let cards = [];
      let idx = {};

      for (let i = 0; i < json.length; i++) {
        cards.push(json[i]);
      }

      for (let i = 0; i < cards.length; i++) {
        idx[cards[i].uid] = i;
      }

      console.log(cards);

      this.setState({
        scratchValue: "",
        cards: cards,
        idx: idx,
      });
    });
  }

  // Drag'n'drop.
  // ----------------------

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

    // backend call

    // TODO(remy): handle error
    XHRScratch.switchCard('12341234-1234-1234-1234-123412341234', src_id, dst_id);

    // visually move the card

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

  // ----------------------

  render() {
    return (
      <div>
        <div className="scratcher-container">
          <div className="scratcher">
            <TextField id="scratcher-input" onChange={this.onScratchChange} value={this.state.scratchValue} fullWidth={true} multiLine={true} placeholder="Scratch here" />
            <RaisedButton id="scratcher-button" onClick={this.addCard} label="Store" fullWidth={true} />
          </div>
        </div>
        <div>
          <div className="card-container" onClick={this.handleClick}>
            {this.state.cards.map(
              (card) => <Card
                  key={card.uid}
                  card_id={card.uid}
                  text={card.text}
                  onDragStart={this.cardDragStart}
                  onDragOver={this.cardDragOver}
                  onDragEnd={this.cardDragEnd}
                  onDragLeave={this.cardDragLeave}
                  onDrop={this.cardDrop}
                />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Scratch;
