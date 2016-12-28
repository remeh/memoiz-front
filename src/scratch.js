import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import Card from './card.js';
import XHRScratch from './xhr/scratch.js';
import randomUuid from './uuid.js';

import './scratch.css';

class Scratch extends Component {
  constructor(props) {
    super(props);

    this.openedCardId = null; // id of the currently opened card

    this.state =  {
      scratchValue: "",
      cards: [],
      idx: {},
      scratchDialogOpen: false,
    }

    this.fetchCards();
  }

  putChanges = (id, text) => {
    XHRScratch.putCard('12341234-1234-1234-1234-123412341234', id, text)
      .then((card) => {
        // TODO(remy): loader in the card?

        // edit the scratch
        // ----------------------

        var cards = this.state.cards.slice();

        for (let i = 0; i < cards.length; i++) {
          if (cards[i].uid === id) {
            cards[i].text = text;
            break;
          }
        }

        this.setState({
          cards: cards,
          scratchValue: '',
        });

        this.onScratchDialogClose();
    });
  }

  postNewCard = (text) => {
    XHRScratch.postCard('12341234-1234-1234-1234-123412341234', text)
      .then((card) => {
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

      // re-render the view with the new card
      // ----------------------

      this.setState({
        scratchValue: "",
        cards: cards,
        idx: idx,
        scratchDialogOpen: false,
      });
    });
  }

  // scratch adds a new card entry in the cards
  // or sends modification of the current one.
  submit = () => {
    var d = this.state.scratchValue;

    if (!d.length) {
      return;
    }

    // TODO(remy): add a loader here.

    // backend hit to add the card
    // ----------------------

    if (this.openedCardId) {
      this.putChanges(this.openedCardId, d);
    } else {
      this.postNewCard(d);
    }
    this.openedCardId = null;
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

      this.setState({
        scratchValue: "",
        cards: cards,
        idx: idx,
      });
    });
  }

  // Card actions
  // ----------------------

  cardClick = (event, id, text) => {
    this.onScratchDialogOpen();
    this.openedCardId = id;
    this.setState({scratchValue: text});
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
      console.warn('left:', left);
      console.warn('right:', right);
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

  // Scratche dialog
  // ----------------------

  onScratchDialogClose = () => {
    if (this.openedCardId) {
      this.openedCardId = null;
      this.setState({
        scratchValue: '',
      });
    }

    this.setState({scratchDialogOpen: false});
  }

  onScratchDialogOpen = () => {
    this.setState({scratchDialogOpen: true});
    setTimeout(() => {
      document.querySelector("#scratcher-input-modal").focus();
    }, 50);
  }

  // ----------------------

  render() {
    return (
      <div>
        <Dialog
          title="Scratch something"
          modal={false}
          open={this.state.scratchDialogOpen}
          autoScrollBodyContent={true}
          onRequestClose={this.onScratchDialogClose}
        >
          <TextField className="scratcher-input" id="scratcher-input-modal" onClick={this.onScratchDialogOpen} onChange={this.onScratchChange} value={this.state.scratchValue} fullWidth={true} multiLine={true} placeholder="Scratch here" />
          <RaisedButton className="scratcher-button" onClick={this.submit} label="Store" fullWidth={true} />
        </Dialog>
        <div className="scratcher-container">
          <div className="scratcher">
            <TextField className="scratcher-input" id="scratcher-input-page" onClick={this.onScratchDialogOpen} onChange={this.onScratchChange} value={this.state.scratchValue} fullWidth={true} multiLine={true} placeholder="Scratch here" />
            <RaisedButton className="scratcher-button" onClick={this.submit} label="Store" fullWidth={true} />
          </div>
        </div>
        <div>
          <div className="card-container" onClick={this.handleClick}>
            {this.state.cards.map(
              (card) => <Card
                  key={card.uid}
                  card_id={card.uid}
                  text={card.text}
                  category={card.category}
                  onDragStart={this.cardDragStart}
                  onDragOver={this.cardDragOver}
                  onDragEnd={this.cardDragEnd}
                  onDragLeave={this.cardDragLeave}
                  onDrop={this.cardDrop}
                  onClick={this.cardClick}
                />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Scratch;
