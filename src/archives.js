import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Helpers from './helpers.js';
import Memo from './memo.js';
import { Menu, MenuModes } from './menu.js';
import { MemoDialog, MemoDialogModes } from './memodialog.js';
import XHRMemo from './xhr/memo.js';

import './memos.css';

class Archives extends Component {
  constructor(props) {
    super(props);
    this.openedMemo = undefined; // id of the currently opened memo
    this.state =  {
      memos: [], // list of displayed memos
      memoDialogOpen: false,

      alert: false,
    }

    this.fetchMemos();
  }

  fetchMemos = (search) => {
    XHRMemo.getMemos('archived', search).then((json) => {
      let memos = [];

      for (let i = 0; i < json.length; i++) {
        memos.push(json[i]);
      }

      this.setState({
        memos: memos,
      });
    }).catch((response) => Helpers.toLoginOrAlert(this, response));
  }

  restoreMemo = (event, memoUid) => {
    XHRMemo.restoreMemo(memoUid).then((json) => {
        // edit the memo
        // ----------------------

        var memos = this.state.memos.slice();

        for (let i = 0; i < memos.length; i++) {
          if (memos[i].uid === memoUid) {
            // remove this entry
            memos.splice(i, 1);
            break;
          }
        }

        this.setState({
          memos: memos,
          memoDialogOpen: false,
        });
    }).catch((response) => Helpers.toLoginOrAlert(this, response));
  }

  toggleMenu = () => {
    let s = this.state;
    s.menu = !s.menu;
    this.setState(s);
  }

  memoClick = (event, openedMemo) => {
    this.openDialog(event, null, openedMemo, true);
  }

  openDialog = (event, rEvent, openedMemo, edit) => {
    this.openedMemo = openedMemo;
    this.setState({
      memoDialogOpen: true,
    });
  }


  closeAlert = () => {
    this.setState({alert: false});
  }

  onSubmit = () => {
  }

  onSearchChange = (evt, val) => {
    this.setState({
      search: val,
    });

    if (!val || val.length === 0) {
      this.fetchMemos();
    }
  }

  search = (event) => {
    event.preventDefault();

    this.fetchMemos(this.state.search);
  }

  // ----------------------

  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.toggleMenu}
          title={<span className="app-bar-title">Memoiz</span>}
          iconElementRight={
            <form onSubmit={this.search}>
            <TextField
              hintText="Search"
              onChange={this.onSearchChange}
              style={{marginRight: '2em'}}
              hintStyle={{color: 'white'}}
            /></form>}
        />
        <Dialog
          actions={<FlatButton
                    label="OK"
                    primary={true}
                    onTouchTap={this.closeAlert}
                  />}
          modal={false}
          open={this.state.alert}
          onRequestClose={this.closeAlert}
        >
          An error occured on our server, sorry for that. Please try refreshing the page.
        </Dialog>
        <Menu
          open={this.state.menu}
          mode={MenuModes.Settings}
          toggleMenu={this.toggleMenu}
        />
        <MemoDialog
          openDialog={this.state.memoDialogOpen}
          onDialogClose={() => { this.setState({memoDialogOpen: false}); }}
          onRestore={this.restoreMemo}
          submit={this.onSubmit}
          memo={this.openedMemo}
          mode={MemoDialogModes.Archives}
        />
        <div>
          <div className="memo-container" onClick={this.handleClick}>
            {this.state.memos.length === 0 && <h1>No archived memos</h1>}
            {this.state.memos.map(
              (memo) => <Memo
                  key={memo.uid}
                  memo={{
                    id: memo.uid,
                    value: memo.text,
                    last_update: memo.last_update,
                    r_category: memo.r_category,
                    r_url: memo.r_url,
                    r_title: memo.r_title,
                    r_image: memo.r_img,
                  }}
                  onClick={this.memoClick}
                />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Archives;
