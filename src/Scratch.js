import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Cards from './Cards.js';

class Scratch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scratchValue: "",
      cards: [ {
          text: 'Hello',
       }],
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
          <Cards cards={this.state.cards} />
        </div>
      </div>
    )
  }
}

export default Scratch;
