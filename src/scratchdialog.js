import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class ScratchDialog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scratchValue: '',
    }
  }

  submit = () => {
    this.props.submit(this.state.scratchValue);
  }

  // onChange is called when the value in the
  // text field is changing.
  onChange = (event) => {
    this.setState({
      scratchValue: event.target.value
    });
  }

  render() {
    return <div>
      <TextField className="scratcher-input" id="scratcher-input-modal" value={this.state.scratchValue} onChange={this.onChange} onClick={this.onScratchDialogOpen} fullWidth={true} multiLine={true} placeholder="Scratch here" />
      <RaisedButton className="scratcher-button" onClick={this.submit} label="Save" fullWidth={true} />
    </div>
  }
}
//
// constructor prototype
// ----------------------

ScratchDialog.propTypes = {
  submit: PropTypes.func.isRequired,
}

export default ScratchDialog;
