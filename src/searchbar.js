import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Search from 'material-ui/svg-icons/action/search';
import AutoComplete from 'material-ui/AutoComplete';

class Searchbar extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      categories: this.props.categories,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      categories: nextProps.categories,
    })
  }

  render() {
    return (
      <div>
        <AutoComplete
          hintText="Search"
          dataSource={this.state.categories}
          onNewRequest={this.props.onSubmit}
          onUpdateInput={this.props.onSearchChange}
          style={{marginRight: '2em'}}
          hintStyle={{color: 'white'}}
        />
        <RaisedButton style={{minWidth: '50px'}} icon={<Search />} onClick={this.props.onSubmit}/>
      </div>
    )
  }
}

export default Searchbar;
