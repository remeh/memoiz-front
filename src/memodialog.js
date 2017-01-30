import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Moment from 'react-moment';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
//import Toggle from 'material-ui/Toggle';

import Chip from './chip.js'

import './memodialog.css';

let styles = {
  iconStyle: {
    top: '8px',
    color: 'rgba(75,75,75,1)',
  },
  menuIconStyle: {
    top: '8px',
    marginRight: '5px',
    color: 'rgba(75,75,75,1)',
  },
};

class MemoDialogModes {
  static Normal = 'normal';
  static Archives = 'archives';
}

class MemoDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      memoDialogOpen: this.props.openDialog,
      enrich: true,

      mode: props.mode,
    }
  }

  componentWillReceiveProps(nextProps) {
    let val = '';
    if (nextProps.memo) {
      val = nextProps.memo.value;
    }
    this.setState({
      memoValue: val,
      memoDialogOpen: nextProps.openDialog,
    })
  }

  // ----------------------

  submit = (e) => {
    if (e) { e.preventDefault(); }
    this.props.submit(this.state.memoValue, this.state.enrich);
  }

  // onChange is called when the value in the
  // text field is changing.
  onChange = (event, value) => {
    if (this.props.mode === MemoDialogModes.Archives) {
      return;
    }

    this.setState({
      memoValue: value,
    });
  }

  toggleEnrich = (event, state) => {
    this.setState({
      enrich: state,
    });
  }

  onArchive = (event) => {
    if (this.props.memo) {
      this.props.onArchive(event, this.props.memo.id);
    }
    this.setState({memoDialogOpen: false});
  } 

  openWikipedia = (event) => {
    var txt = this.state.memoValue.replace(' ', '_');
    window.open('https://en.wikipedia.org/wiki/' + encodeURIComponent(txt));
  }

  openGoogle = (event) => {
    window.open('https://google.com/search?q=' + encodeURIComponent(this.state.memoValue));
  }

  dialogActions = () => {
    var actions = [];

    if (this.props.memo && this.props.memo.id) {
      if (this.props.mode !== MemoDialogModes.Archives) {
        // Archive
        actions.push(<IconButton onClick={this.onArchive} tooltip="Archive" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>archive</IconButton>);
      }
      // Menu
      actions.push(<IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          style={styles.menuIconStyle}
        >
          {/* TODO(remy): delete action */}
          <MenuItem onClick={this.openWikipedia} primaryText="Open on Wikipedia" />
          <MenuItem onClick={this.openGoogle} primaryText="Search on Google" />
        </IconMenu>
      );
    }

    if (this.props.mode === MemoDialogModes.Archives) {
      actions.push(<FlatButton className="memoiz-button" style={styles.cancelButton} onClick={this.onMemoDialogClose} label="Close" />);
    } else {
      actions.push(<FlatButton className="memoiz-button" style={styles.cancelButton} onClick={this.onMemoDialogClose} label="Cancel" />);
      actions.push(<FlatButton className="memoiz-button" onClick={this.submit} primary={true} label="Save"/>);
    }
    return actions;
  }

  onMemoDialogClose = () => {
    this.setState({
      memoDialogOpen: false,
      enrich: true, // force enrichment on next opening
    });
    this.props.onDialogClose();
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      this.submit();
    }
  }

  // ----------------------

  render() {
    if (this.props.memo && this.props.memo.last_update) {
      var prettyTime = moment(this.props.memo.last_update).format('LLL');
    }
    return <div>
        <Dialog
          className="dialog"
          modal={false}
          open={this.state.memoDialogOpen}
          autoScrollBodyContent={true}
          onRequestClose={this.onMemoDialogClose}
          actions={this.dialogActions()}
        >

          <TextField onKeyPress={this.onKeyPress} className="memoiz-input" id="memoiz-input-modal" value={this.state.memoValue} onChange={this.onChange} onClick={this.onMemoDialogOpen} fullWidth={true} multiLine={true} placeholder="Write your memo here" />

          {this.props.memo && this.props.memo.r_category !== 'Unknown' &&
            <Chip text={this.props.memo.r_category} />
          }

          {this.props.memo && this.props.memo.r_image &&
            <div className="rich">
              <div className="img">
                <a href={this.props.memo.r_url} target="_blank" alt="Go to link">
                  <img src={this.props.memo.r_image} role="presentation" />
                </a>
              </div>
              <div className="desc">
                <p className="title">{this.props.memo.r_title}</p>
                <p className="url">{this.props.memo.r_url}</p>
              </div>
            </div>
          }

          {/*<br />
          <Toggle
          label="Automatically enrich memo information"
          labelPosition="right"
          onToggle={this.toggleEnrich}
          toggled={this.state.enrich}
          />*/}

          {this.props.memo && this.props.memo.last_update &&
            <div className="memoiz-creation-date">
              <span title={prettyTime}>Last edit <Moment fromNow>{this.props.memo.last_update}</Moment></span>
            </div>
          }
        </Dialog>

    </div>
  }
}

// constructor prototype
// ----------------------

MemoDialog.propTypes = {
  submit: PropTypes.func.isRequired,
  openDialog: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
}

export { MemoDialog, MemoDialogModes };
