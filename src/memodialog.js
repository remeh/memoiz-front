import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Moment from 'react-moment';

import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';

import Chip from './chip.js'
import Strings from './strings.js'

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

class MemoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memoDialogOpen: this.props.openDialog,
      enrich: true,
    }
  }

  componentWillReceiveProps(nextProps) {
    let val = '';
    if (nextProps.card) {
      val = nextProps.card.value;
    }
    this.setState({
      memoValue: val,
      memoDialogOpen: nextProps.openDialog,
    })
  }

  // ----------------------

  submit = () => {
    this.props.submit(this.state.memoValue, this.state.enrich);
  }

  // onChange is called when the value in the
  // text field is changing.
  onChange = (event, value) => {
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
    if (this.props.card) {
      this.props.onArchive(event, this.props.card.id);
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

    if (this.props.card && this.props.card.id) {
      // Delete
      actions.push(<IconButton onClick={this.onDelete} tooltip="Delete" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>delete</IconButton>);
      // Archive
      actions.push(<IconButton onClick={this.onArchive} tooltip="Archive" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>archive</IconButton>);
      // Menu
      actions.push(<IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          style={styles.menuIconStyle}
        >
          <MenuItem onClick={this.openWikipedia} primaryText="Open on Wikipedia" />
          <MenuItem onClick={this.openGoogle} primaryText="Search on Google" />
        </IconMenu>
      );
    }

    actions.push(<FlatButton className="memoiz-button" style={styles.cancelButton} onClick={this.onMemoDialogClose} label="Cancel" />);
    actions.push(<FlatButton className="memoiz-button" onClick={this.submit} primary={true} label="Save"/>);
    return actions;
  }

  onMemoDialogClose = () => {
    this.setState({
      memoDialogOpen: false,
      enrich: true, // force enrichment on next opening
    });
    this.props.onDialogClose();
  }

  // ----------------------

  render() {
    if (this.props.card && this.props.card.last_update) {
      var prettyTime = moment(this.props.card.last_update).format('LLL');
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
          <TextField className="memoiz-input" id="memoiz-input-modal" value={this.state.memoValue} onChange={this.onChange} onClick={this.onMemoDialogOpen} fullWidth={true} multiLine={true} placeholder="Memo here" />

          {this.props.card && this.props.card.r_category !== 'Unknown' &&
            <Chip text={this.props.card.r_category} />
          }

          {this.props.card && this.props.card.r_image &&
            <div className="rich">
              <div>
                <a href={this.props.card.r_url} target="_blank" alt="Go to link">
                  <img src={this.props.card.r_image} role="presentation" />
                </a>
              </div>
              <span className="title">{Strings.cut(this.props.card.r_title, 80)}</span>
              <br />
              <span className="url">{Strings.cut(this.props.card.r_url, 90)}</span>
            </div>
          }

          <br />
          <Checkbox onCheck={this.toggleEnrich} checked={this.state.enrich} label="Automatically enrich memo information" style={styles.checkbox} />
          {this.props.card && this.props.card.last_update &&
            <div className="memoiz-creation-date">
              <span title={prettyTime}>Last edit <Moment fromNow>{this.props.card.last_update}</Moment></span>
            </div>
          }
        </Dialog>

    </div>
  }
}
//
// constructor prototype
// ----------------------

MemoDialog.propTypes = {
  submit: PropTypes.func.isRequired,
  openDialog: PropTypes.bool.isRequired,
  onArchive: PropTypes.func.isRequired,
  onDialogClose: PropTypes.func.isRequired,
}

export default MemoDialog;