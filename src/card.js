import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';

import Chip from './chip.js';
import Strings from './strings.js';
import './card.css';

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
      r_category: this.props.card.r_category,
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
      r_category: nextProps.card.r_category,
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
          {this.state.r_category !== 'Unknown' &&
            <Chip text={this.state.r_category} />
          }
        </div>
        { this.props.card.r_image &&
          <div className="rich">
            <div>
              <a href={this.props.card.r_url} target="_blank" alt="Go to link">
                <img src={this.props.card.r_image} role="presentation" />
              </a>
            </div>
            <span className="title">{Strings.cut(this.props.card.r_title, 22)}</span>
            <br />
            <span className="url">{Strings.cut(this.props.card.r_url, 22)}</span>
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
