import React, { Component } from 'react';

import Chip from './chip.js';
//import Strings from './strings.js';
import './memo.css';

class Memo extends Component {
  MaximumForVeryLargeText = 25;
  MaximumForLargeText = 40;


  // Lifecycle
  // ----------------------

  constructor(props) {
    super(props);
    this.state = {
      dragged: false,
      draggedOver: false,
      r_category: this.props.memo.r_category,
    }
  }

  componentDidMount() {};
  componentWillUnmount() {};
  componentWillReceiveProps(nextProps) {
    this.setState({
      r_category: nextProps.memo.r_category,
    })
  }

  // ----------------------

  handleClick = () => {
  }

  computeClass = () => {
    var c = "memo"; // base class

    if (this.state.draggedOver) {
      c += " dragged-over";
    }

    if (this.state.dragged) {
      c += " dragged";
    }

    if (this.props.memo.value.length < this.MaximumForVeryLargeText) {
      c += " very-large-text";
    } else if (this.props.memo.value.length < this.MaximumForLargeText) {
      c += " large-text";
    }

    return c
  }

  computeContentClass = () => {
    if (this.props.memo.r_image) {
      return "content part-memo";
    }
    return "content full-memo";
  }

  reset = () => {
    this.setState({dragged: false});
    this.setState({draggedOver: false});
  }

  getText = () => {
    //if (this.props.memo.value.length > 140) {
    //  return this.props.memo.value.slice(0, 140) + '...';
    //}
    return this.props.memo.value;
  }

  // Drag'n'drop
  // ----------------------

  onDragStart = (event) => {
    event.dataTransfer.setData("text", this.props.memo.value);
    event.dataTransfer.setData("application/id", this.props.memo.id);
    event.dataTransfer.dropEffect = "move";

    // create a copy rendered hidden
    // ----------------------

    var img = document.createElement('div');
    var end = '';
    //if (this.props.memo.valuelength >= 139) { end = '...'; }
    img.innerHTML = this.props.memo.value.slice(0, 140) + end;
    img.className = 'memo';
    img.style.cssText = 'background-color: white; top: -250px; padding: 0.5em; position: absolute; max-height: 200px';
    img.id = 'drop-mirror';
    document.querySelector('body').appendChild(img);
    event.dataTransfer.setDragImage(img, -5, -5);
    setTimeout(() => { // automatically destroy this copy
      let element = document.querySelector('#drop-mirror');
      if (element && element.parentNode) { element.parentNode.removeChild(element); }
    }, 150);

    // ----------------------

    this.setState({dragged: true});
    this.props.onDragStart(event, this.props.memo_id);
  }

  onDragOver = (event) => {
    if (!event.dataTransfer || event.dataTransfer.getData("application/id") === this.props.memo.id) {
      return;
    }
    event.preventDefault();
    this.setState({draggedOver: true});
    this.props.onDragOver(event, this.props.memo.id);
  }

  onDragLeave = (event) => {
    if (!event.dataTransfer || event.dataTransfer.getData("application/id") === this.props.memo.id) {
      return;
    }
    event.preventDefault();
    this.setState({draggedOver: false});
  }

  onDragExit = (event) => {
    if (!event.dataTransfer || event.dataTransfer.getData("application/id") === this.props.memo.id) {
      return;
    }
    event.preventDefault();
    this.setState({dragged: false});
    this.props.onDragEnd(event, this.props.memo.id);
  }

  onDragEnd = (event) => {
    event.preventDefault();
    this.setState({dragged: false});
    this.props.onDragEnd(event, this.props.memo.id);
  }

  onDrop = (event) => {
    event.preventDefault();
    this.reset();
    this.props.onDrop(event, this.props.memo.id);
  }

  onClick = (event) => {
    event.preventDefault();
    this.props.onClick(event, this.props.memo);
  }

  onArchive = (event) => {
    event.preventDefault()
    this.props.onArchive(event, this.props.memo.id);
  }

  // ----------------------

  render() {
    return (
      <div
        className={this.computeClass()}
        id={this.props.memo.id}
        draggable="true"
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnd={this.onDragEnd}
        onDragExit={this.onDragExit}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        >
        <div onClick={this.onClick} className={this.computeContentClass()}>
          <div>

            <p>{this.getText()}</p>
            {this.state.r_category !== 'Uncategorized' &&
              <Chip text={this.state.r_category} />
            }
          </div>
        </div>
          { this.props.memo.r_image &&
            <div className="rich">
              <a href={this.props.memo.r_url} target="_blank" alt="Go to link">
              <div className="desc">
                <p className="title">{this.props.memo.r_title}</p>
                <p className="url">{this.props.memo.r_url}</p>
              </div>
              <div>
                  <img src={this.props.memo.r_image} role="presentation" />
              </div>
              </a>
            </div>
          }
      </div>
    );
  }
}

// constructor prototype
// ----------------------

export default Memo;
