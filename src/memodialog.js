import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Moment from 'react-moment';

import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import Toggle from 'material-ui/Toggle';

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
      automaticReminder: true,

      mode: props.mode,

      reminderDate: null,
      reminder: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.memo) {
      let automaticReminder = !!!nextProps.memo.reminder;
      this.setState({
        reminder: nextProps.memo.reminder,
        automaticReminder: automaticReminder,
        memoValue: nextProps.memo.value,
        memoDialogOpen: nextProps.openDialog,
      });
    } else {
      this.setState({
        memoValue: '',
        reminder: null,
        reminderDate: null,
        automaticReminder: true,
        memoDialogOpen: nextProps.openDialog,
      });
    }
  }

  // ----------------------

  submit = (e) => {
    if (e) { e.preventDefault(); }
    this.props.submit(this.state.memoValue, true, this.state.reminder);
    setTimeout(() => {
      this.setState({automaticReminder: true, reminderDate: null, reminder: null})
    }, 300);
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

  onArchive = (event) => {
    if (this.props.memo) {
      this.props.onArchive(event, this.props.memo.id);
    }
    this.setState({memoDialogOpen: false});
  }

  onRestore = (event) => {
    if (this.props.memo) {
      this.props.onRestore(event, this.props.memo.id);
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
      switch (this.props.mode) {
        case MemoDialogModes.Archives:
          actions.push(<IconButton onClick={this.onRestore} tooltip="Restore" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>unarchive</IconButton>);
          break;
        default:
        case MemoDialogModes.Normal:
          actions.push(<IconButton onClick={this.onArchive} tooltip="Archive" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>archive</IconButton>);
          break;
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
      actions.push(<FlatButton className="memoiz-button" onClick={this.submit} primary={true} label="Save"/>);
    }
    return actions;
  }

  onMemoDialogClose = () => {
    this.setState({
      memoDialogOpen: false,
      automaticReminder: true,
      reminderDate: null,
      reminder: null,
    });
    this.props.onDialogClose();
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      this.submit();
    }
  }

  toggleReminder = (event, state) => {
    this.setState({
      automaticReminder: state,
    });
    if (state === false) {
      setTimeout(() => {
        if (this.datepicker) {
          this.datepicker.openDialog();
        }
      }, 150);
    } else {
      this.setState({
        reminder: null,
      });
    }
  }

  onDateChange = (event, date) => {
    setTimeout(() => {
      if (this.timepicker) {
        this.timepicker.openDialog();
      }
    }, 50);
    this.setState({
      reminderDate: date,
    });
  }

  onTimeChange = (event, time) => {
    let rd = this.state.reminderDate;
    rd.setHours(time.getHours())
    rd.setMinutes(time.getMinutes())
    this.setState({
      reminder: rd,
    });
  }

  onCancelReminder = () => {
    this.setState({
      automaticReminder: true,
      reminderDate: null,
      reminder: null,
    });
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

          {this.props.memo && this.props.memo.r_category !== 'Uncategorized' &&
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

          {this.props.memo && this.props.memo.last_update &&
            <div className="memoiz-creation-date">
              <span title={prettyTime}>Last edit <Moment fromNow>{this.props.memo.last_update}</Moment></span>
            </div>
          }
          <br/>
          <Toggle
            label="Automatic reminder"
            labelPosition="right"
            onToggle={this.toggleReminder}
            toggled={this.state.automaticReminder}
          />
          {!this.state.automaticReminder && <div>
            <DatePicker
              style={{display: 'none'}}
              ref={(dp) => { this.datepicker = dp; }}
              onChange={this.onDateChange}
              onDismiss={this.onCancelReminder}
              minDate={new Date()}
              hintText="Choose a day"
              autoOk={true}
            />
            <TimePicker
              style={{display: 'none'}}
              ref={(tp) => { this.timepicker = tp; }}
              onChange={this.onTimeChange}
              onDismiss={this.onCancelReminder}
              open={true}
              format={'24hr'}
              hintText="Choose the time"
              autoOk={true}
            />
          </div>}
          {!this.state.automaticReminder && <span>Reminder set to <Moment format="llll">{this.state.reminder}</Moment></span>}
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
