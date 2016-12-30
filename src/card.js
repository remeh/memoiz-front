import React, { Component, PropTypes } from 'react';
import {grey900} from 'material-ui/styles/colors';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';

import './card.css';

let styles = {
  chipStyle: {
    fontSize: '0.6em',
    color: grey900,
  },
  iconStyle: {
    color: 'rgba(75,75,75,1)',
  },
};

class Card extends Component {
  MaximumForLargeText = 80;
  AutoHideSnackBar = 5000; // ms

  // ----------------------

  constructor(props) {
    super(props);
    this.state = {
      dragged: false,
      draggedOver: false,
      category: props.category,
      snackbar: {
        open: false,
        message: '',
      }
    }
  }

  componentDidMount() {};
  componentWillUnmount() {};

  handleClick = () => {
  }

  computeClass = () => {
    var c = "card"; // base class

    if (this.state.draggedOver) {
      c += " dragged-over";
    }

    if (this.state.dragged) {
      c += " dragged";
    }

    if (this.props.text.length < this.MaximumForLargeText) {
      c += " large-text";
    }

    return c
  }

  reset = () => {
    this.setState({dragged: false});
    this.setState({draggedOver: false});
  }

  getText = () => {
    if (this.props.text.length > 140) {
      return this.props.text.slice(0, 140) + '...';
    }
    return this.props.text;
  }

  // Drag'n'drop
  // ----------------------

  onDragStart = (event) => {
    event.dataTransfer.setData("text/plain", this.props.card_id);
    this.setState({dragged: true});
    this.props.onDragStart(event, this.props.card_id);
  }

  onDragOver = (event) => {
    event.preventDefault();
    this.setState({draggedOver: true});
    this.props.onDragOver(event, this.props.card_id);
  }

  onDragLeave = (event) => {
    event.preventDefault();
    this.setState({draggedOver: false});
  }

  onDragExit = (event) => {
    event.preventDefault();
    this.setState({dragged: false});
    this.props.onDragEnd(event, this.props.card_id);
  }

  onDragEnd = (event) => {
    event.preventDefault();
    this.setState({dragged: false});
    this.props.onDragEnd(event, this.props.card_id);
  }

  onDrop = (event) => {
    event.preventDefault();
    this.reset();
    this.props.onDrop(event, this.props.card_id);
  }

  onClick = (event) => {
    event.preventDefault();
    this.props.onClick(event, this.props.card_id, this.props.text);
  }

  onArchive = (event) => {
    event.preventDefault()
    this.openSnackbar('This note has been archived');
    this.props.onArchive(event, this.props.card_id);
  }

  openSnackbar = (message) => {
    this.setState({snackbar: {
      open: true,
      message: message,
    }});
  }

  // ----------------------

  render() {
    return (
      <div
        className={this.computeClass()}
        id={this.props.card_id}
        draggable="true"
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnd={this.onDragEnd}
        onDragExit={this.onDragExit}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        >
        <div className="content" onClick={this.onClick}>
          {this.getText()}
          {this.state.category !== 'Unknown' &&
            <Chip labelStyle={styles.chipStyle}>
              {this.state.category}
            </Chip>
          }
        </div>
        <div className="actions">
          <IconButton onClick={this.onArchive} tooltip="Archive" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>archive</IconButton>
        </div>

        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          action="undo"
          autoHideDuration={this.AutoHideSnackBar}
          //onActionTouchTap={this.handleActionTouchTap}
          //onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

// constructor prototype
// ----------------------

Card.propTypes = {
  card_id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

export default Card;
