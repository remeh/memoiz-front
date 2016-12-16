import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Cards from './Cards.js';
import randomUuid from './Uuid.js';

class Scratch extends Component {
  constructor(props) {
    super(props);

    var id1 = 'aaa';
    var id2 = 'bbb';

    this.state = {
      scratchValue: "",
      cards: [
        {
          id: id1,
          text: 'Hello',
        },
        {
          id: id2,
          text: 'World',
        },
      ],
      idx: {
        aaa: 0,
        bbb: 1,
      }
    };
  }

  scratch = () => {
    var d = this.state.scratchValue;

    if (!d.length) {
      return;
    }

    this.setState({
      scratchValue: '',
    });
    this.state.cards.push(this.newCard(d));
  }

  newCard(text) {
    return {
      id: randomUuid(),
      text: text,
    }
  }

  scratchChange = (e) => {
    this.setState({
      scratchValue: e.target.value
    });
  }

  render() {
    return (
      <div>
        <TextField id="scratchInput" onChange={this.scratchChange} value={this.state.scratchValue} fullWidth={true} multiLine={true} placeholder="Scratch here" />
        <RaisedButton id="scratchButton" onClick={this.scratch} label="Store" fullWidth={true} />
        <hr />
        <div>
          <Cards cards={this.state.cards} idx={this.state.idx} />
        </div>
      </div>
    )
  }
}

export default Scratch;
