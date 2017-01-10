import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';

import Chip from './chip.js';
import './card.css';

let styles = {
  chipStyle: {
    fontSize: '0.7em',
    fontWeight: 'bold',
  },
  iconStyle: {
    color: 'rgba(75,75,75,1)',
  },
};

class Card extends Component {
  MaximumForLargeText = 80;
  AutoHideSnackBar = 5000; // ms

  // Lifecycle
  // ----------------------

  constructor(props) {
    super(props);
    this.state = {
      dragged: false,
      draggedOver: false,
      category: this.props.card.category,
      snackbar: {
        open: false,
        message: '',
      }
    }
  }

  componentDidMount() {};
  componentWillUnmount() {};
  componentWillReceiveProps(nextProps) {
    this.setState({
      category: nextProps.card.category,
    })
  }

  // ----------------------

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

    if (this.props.card.value.length < this.MaximumForLargeText) {
      c += " large-text";
    }

    return c
  }

  reset = () => {
    this.setState({dragged: false});
    this.setState({draggedOver: false});
  }

  getText = () => {
    if (this.props.card.value.length > 140) {
      return this.props.card.value.slice(0, 140) + '...';
    }
    return this.props.card.value;
  }

  // Drag'n'drop
  // ----------------------

  onDragStart = (event) => {
    event.dataTransfer.setData("text", this.props.card.value);
    event.dataTransfer.setData("application/id", this.props.card.id);
    event.dataTransfer.dropEffect = "move";

    // create a copy rendered hidden
    // ----------------------

    var img = document.createElement('div');
    var end = '';
    if (this.props.card.valuelength >= 139) { end = '...'; }
    img.innerHTML = this.props.card.value.slice(0, 140) + end;
    img.className = 'card';
    img.style.cssText = 'background-color: white; top: -250px; position: absolute; max-height: 200px';
    img.id = 'drop-mirror';
    document.querySelector('body').appendChild(img);
    event.dataTransfer.setDragImage(img, -5, -5);
    setTimeout(() => { // automatically destroy this copy
      let element = document.querySelector('#drop-mirror');
      if (element && element.parentNode) { element.parentNode.removeChild(element); }
    }, 150);

    // ----------------------

    this.setState({dragged: true});
    this.props.onDragStart(event, this.props.card_id);
  }

  onDragOver = (event) => {
    if (!event.dataTransfer || event.dataTransfer.getData("application/id") === this.props.card.id) {
      return;
    }
    event.preventDefault();
    this.setState({draggedOver: true});
    this.props.onDragOver(event, this.props.card.id);
  }

  onDragLeave = (event) => {
    if (!event.dataTransfer || event.dataTransfer.getData("application/id") === this.props.card.id) {
      return;
    }
    event.preventDefault();
    this.setState({draggedOver: false});
  }

  onDragExit = (event) => {
    if (!event.dataTransfer || event.dataTransfer.getData("application/id") === this.props.card.id) {
      return;
    }
    event.preventDefault();
    this.setState({dragged: false});
    this.props.onDragEnd(event, this.props.card.id);
  }

  onDragEnd = (event) => {
    event.preventDefault();
    this.setState({dragged: false});
    this.props.onDragEnd(event, this.props.card.id);
  }

  onDrop = (event) => {
    event.preventDefault();
    this.reset();
    this.props.onDrop(event, this.props.card.id);
  }

  onClick = (event) => {
    event.preventDefault();
    this.props.onClick(event, this.props.card);
  }

  onArchive = (event) => {
    event.preventDefault()
    this.openSnackbar('This note has been archived');
    this.props.onArchive(event, this.props.card.id);
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
        id={this.props.card.id}
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
            <Chip text={this.state.category} />
          }
        </div>
        <div className="actions">
          <IconButton onClick={this.onArchive} tooltip="Archive" touch={true} tooltipPosition="bottom-center" iconClassName="material-icons" iconStyle={styles.iconStyle}>archive</IconButton>
        </div>
        { this.props.card.image &&
          <div className="image">
            <a href={this.props.card.url} target="_blank" alt="Go to link">
              <img src={this.props.card.image} role="presentation" />
            </a>
          </div>
        }
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

export default Card;
