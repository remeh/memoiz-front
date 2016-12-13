import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const inputStyle = {
  width: '100% !important',
  'max-width': '100% !important',
}

class Scratch extends Component {
  render() {
    return (
      <div>
        <TextField fullWidth={true} multiLine={true} placeholder="Scratch here" />
        <RaisedButton label="Store" fullWidth={true} />
      </div>
    )
  }
}

export default Scratch;
