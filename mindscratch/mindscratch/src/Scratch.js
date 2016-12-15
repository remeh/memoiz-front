import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class Scratch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scratchValue: "",
    };
  }

  scratch = () => {
    console.log(this.state.scratchValue);
  }


  scratchChange = (e) => {
    this.setState({
      scratchValue: e.target.value
    });
  }

  render() {
    return (
      <div>
        <TextField id="scratchInput" onChange={this.scratchChange} fullWidth={true} multiLine={true} placeholder="Scratch here" />
        <RaisedButton id="scratchButton" onClick={this.scratch} label="Store" fullWidth={true} />
        <hr />
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Scratch;
