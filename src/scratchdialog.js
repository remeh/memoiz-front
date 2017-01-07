import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

let styles = {
  iconStyle: {
    top: '5px',
    color: 'rgba(75,75,75,1)',
  },
  menuIconStyle: {
    top: '5px',
    marginRight: '5px',
    color: 'rgba(75,75,75,1)',
  },
};

class ScratchDialog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scratchDialogOpen: this.props.openDialog,
      scratchValue: this.props.initialValue,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      scratchValue: nextProps.initialValue,
      scratchDialogOpen: nextProps.openDialog,
    })
  }

  // ----------------------

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

  onArchive = (event) => {
    this.props.onArchive(event, this.props.cardId);
    this.setState({scratchDialogOpen: false});
  } 

  openWikipedia = (event) => {
    var txt = this.state.scratchValue.replace(' ', '_');
    window.open('https://en.wikipedia.org/wiki/' + txt);
  }

  dialogActions = () => {
    if (!this.props.cardId) {
      return <div>
        <RaisedButton className="scratcher-button" onClick={this.submit} label="Save" fullWidth={false} />
      </div>
    }

    return <div>
      <IconButton onClick={this.onArchive} tooltip="Archive" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>archive</IconButton>
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        style={styles.menuIconStyle}
      >
        <MenuItem onClick={this.openWikipedia} primaryText="Open on Wikipedia" />
      </IconMenu>
      <RaisedButton className="scratcher-button" onClick={this.submit} label="Save" fullWidth={false} />
    </div>
  }

  onScratchDialogClose = () => {
    if (this.openedCardId) {
      this.openedCardId = null;
    }

    this.setState({scratchDialogOpen: false});
  }

  // ----------------------

  render() {
    return <div>
        <Dialog
          title="Scratch something"
          modal={false}
          open={this.state.scratchDialogOpen}
          autoScrollBodyContent={true}
          onRequestClose={this.onScratchDialogClose}
          actions={this.dialogActions()}
        >
          <TextField className="scratcher-input" id="scratcher-input-modal" value={this.state.scratchValue} onChange={this.onChange} onClick={this.onScratchDialogOpen} fullWidth={true} multiLine={true} placeholder="Scratch here" />
        </Dialog>

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
