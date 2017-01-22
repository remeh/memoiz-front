import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import Card from './card.js';
import Menu from './menu.js';
import MemoDialog from './memodialog.js';
import XHRMemo from './xhr/memo.js';
import randomUuid from './uuid.js';

import './memo.css';

class Memo extends Component {
  constructor(props) {
    super(props);

    this.openedCard = undefined; // id of the currently opened card
    this.memoValue = ''; // sent to the dialog when opening a card

    this.state =  {
      cards: [], // list of displayed cards
      memoDialogOpen: false,
      menu: false,
    }

    this.fetchCards();
  }

  putChanges = (id, text, enrich) => {
    XHRMemo.putCard('12341234-1234-1234-1234-123412341234', id, text, enrich)
      .then((card) => {
        // edit the memo
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
          memoDialogOpen: false,
        });

        // TODO(remy): loader in the card?

        // in 2s, fetch for some rich infos
        // about this cards.
        // ----------------------
        if (enrich) {
          setTimeout(() => { this.enrich(card) }, 2000);
        }
    });

    // TODO(remy): manage error
  }

  postNewCard = (text, enrich) => {
    XHRMemo.postCard('12341234-1234-1234-1234-123412341234', text, enrich)
      .then((card) => {
      // add the memo
      // ----------------------

      var cards = this.state.cards.slice();
      cards.unshift(card);

      // re-render the view with the new card
      // ----------------------

      this.setState({
        cards: cards,
        memoDialogOpen: false,
      });

      // in 2s, fetch for some rich infos
      // about this cards.
      // ----------------------
      if (enrich) {
        setTimeout(() => { this.enrich(card) }, 2000);
      }
    });

    // TODO(remy): manage error
  }

  enrich = (card) => {
    XHRMemo.enrichCard('12341234-1234-1234-1234-123412341234', card.uid)
      .then((rich) => {
        // edit the memo
        // ----------------------

        var cards = this.state.cards.slice();

        for (let i = 0; i < cards.length; i++) {
          if (cards[i].uid === card.uid) {
            // found! edit it.
            let card = cards[i];
            if (rich.r_category !== 'Unknown') {
              card.r_category = rich.r_category;
            }
            if (rich.r_img) {
              card.r_img = rich.r_img;
            }
            if (rich.r_title) {
              card.r_title = rich.r_title;
            }
            if (rich.r_url) {
              card.r_url = rich.r_url;
            }
            if (rich.last_update) {
              card.last_update = rich.last_update;
            }
            break;
          }
        }

        this.setState({
          cards: cards,
        });
    });
  }

  // newCard generates a card object.
  newCard(text) {
    return {
      uid: randomUuid(),
      text: text,
    }
  }

  // XHR
  // ----------------------

  fetchCards = () => {
    XHRMemo.getCards('12341234-1234-1234-1234-123412341234').then((json) => {
      let cards = [];

      for (let i = 0; i < json.length; i++) {
        cards.push(json[i]);
      }

      this.setState({
        cards: cards,
      });
    });
  }

  // Card actions
  // ----------------------

  cardClick = (event, openedCard) => {
    this.openDialog(event, null, openedCard);
  }

  cardDragStart = (event) => {};
  cardDragOver = (event) => {};
  cardDragEnd = (event) => {};
  cardDragLeave = (event) => {};
  cardDrop = (event, id) => {
    var src_id = event.dataTransfer.getData("application/id");
    var dst_id = id;

    let left_idx = -1;
    let right_idx = -1;

    for (let i = 0; i < this.state.cards.length; i++) {
      if (src_id === this.state.cards[i].uid) {
        left_idx = i;
        break;
      }
    }

    for (let i = 0; i < this.state.cards.length; i++) {
      if (dst_id === this.state.cards[i].uid) {
        right_idx = i;
        break;
      }
    }

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
    XHRMemo.switchCard('12341234-1234-1234-1234-123412341234', src_id, dst_id);

    // visually move the card

    var cards = this.state.cards.slice();

    cards[left_idx] = right;
    cards[right_idx] = left;

    this.setState({
      cards: cards,
    });
  };

  // cards actions
  // ----------------------

  archiveCard = (event, cardUid) => {
    XHRMemo.archiveCard('12341234-1234-1234-1234-123412341234', cardUid).then((json) => {
        // edit the memo
        // ----------------------

        var cards = this.state.cards.slice();

        for (let i = 0; i < cards.length; i++) {
          if (cards[i].uid === cardUid) {
            // remove this entry
            cards.splice(i, 1);
            break;
          }
        }

        this.setState({
          cards: cards,
          memoDialogOpen: false,
        });
    });
  }

  // Memoiz dialog
  // ----------------------

  openDialog = (event, rEvent, openedCard) => {
    this.openedCard = openedCard;
    this.setState({
      memoDialogOpen: true,
    });
    setTimeout(() => {
      var el = document.querySelector('#memoiz-input-modal');
      if (el) { el.focus(); }
    }, 100);
  }

  // memo adds a new card entry in the cards
  // or sends modification of the current one.
  onSubmit = (text, enrich) => {
    if (!text.length) {
      return;
    }

    // TODO(remy): add a loader here.

    // backend hit to add the card
    // ----------------------

    if (this.openedCard) {
      this.putChanges(this.openedCard.id, text, enrich);
    } else {
      this.postNewCard(text, enrich);
    }
    this.openedCard = undefined;
  }

  toggleMenu = () => {
    let s = this.state;
    s.menu = !s.menu;
    this.setState(s);
  }

  // ----------------------

  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.toggleMenu}
         />
        <Menu
          open={this.state.menu}
          toggleMenu={this.toggleMenu}
          onMemo={this.openDialog}
        />
        <MemoDialog 
          openDialog={this.state.memoDialogOpen}
          onDialogClose={() => { this.setState({memoDialogOpen: false}); }}
          submit={this.onSubmit}
          card={this.openedCard}
          onArchive={this.archiveCard}
        />
        <div className="memoiz-container">
          <div className="memoiz">
            <TextField className="memoiz-input" id="memoiz-input-page" onClick={this.openDialog} fullWidth={true} multiLine={true} placeholder="Memo here" />
            <RaisedButton className="memoiz-button" onClick={this.submit} label="Save" fullWidth={true} />
          </div>
        </div>
        <div>
          <div className="card-container" onClick={this.handleClick}>
            {this.state.cards.map(
              (card) => <Card
                  key={card.uid}
                  card={{
                    id: card.uid,
                    value: card.text,
                    last_update: card.last_update,
                    r_category: card.r_category,
                    r_url: card.r_url,
                    r_title: card.r_title,
                    r_image: card.r_img,
                  }}
                  onDragStart={this.cardDragStart}
                  onDragOver={this.cardDragOver}
                  onDragEnd={this.cardDragEnd}
                  onDragLeave={this.cardDragLeave}
                  onDrop={this.cardDrop}
                  onClick={this.cardClick}
                  onArchive={this.archiveCard}
                />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Memo;
