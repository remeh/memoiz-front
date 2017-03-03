import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Search from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

class Searchbar extends Component {
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <TextField
          hintText="Search"
          onChange={this.props.onSearchChange}
          style={{marginRight: '2em'}}
          hintStyle={{color: 'white'}}
        />
        <RaisedButton style={{minWidth: '50px'}} icon={<Search />} onClick={this.props.onSubmit}/>
      </form>
    )
  }
}

export default Searchbar;
