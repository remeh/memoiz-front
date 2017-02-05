import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import Helpers from './helpers.js';
import Memo from './memo.js';
import { Menu, MenuModes } from './menu.js';
import { MemoDialog, MemoDialogModes } from './memodialog.js';
import XHRMemo from './xhr/memo.js';
import randomUuid from './uuid.js';

import './memos.css';

let styles = {
  title: {
    fontSize: '1.4em',
  },
  fab: {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 5,
  }
}

class Memos extends Component {
  constructor(props) {
    super(props);

    this.openedMemo = undefined; // id of the currently opened memo
    this.memoValue = ''; // sent to the dialog when opening a memo

    this.state =  {
      memos: [], // list of displayed memos
      memoDialogOpen: false,

      alert: false,

      menu: false,
    }

    this.fetchMemos();
  }

  putChanges = (id, text, enrich) => {
    XHRMemo.putMemo(id, text, enrich)
      .then((memo) => {
        // edit the memo
        // ----------------------

        var memos = this.state.memos.slice();

        for (let i = 0; i < memos.length; i++) {
          if (memos[i].uid === id) {
            memos[i].text = text;
            break;
          }
        }

        this.setState({
          memos: memos,
          memoDialogOpen: false,
        });

        // TODO(remy): loader in the memo?

        // in 2s, fetch for some rich infos
        // about this memos.
        // ----------------------
        if (enrich) {
          setTimeout(() => { this.enrich(memo) }, 2000);
        }
    }).catch((response) => Helpers.toLoginOrAlert(this, response));
  }

  postNewMemo = (text, enrich) => {
    XHRMemo.postMemo(text, enrich)
      .then((memo) => {
      // add the memo
      // ----------------------

      var memos = this.state.memos.slice();
      memos.unshift(memo);

      // re-render the view with the new memo
      // ----------------------

      this.setState({
        memos: memos,
        memoDialogOpen: false,
      });

      // in 2s, fetch for some rich infos
      // about this memos.
      // ----------------------
      if (enrich) {
        setTimeout(() => { this.enrich(memo) }, 2000);
      }
    }).catch((response) => Helpers.toLoginOrAlert(this, response));
  }

  enrich = (memo) => {
    XHRMemo.enrichMemo(memo.uid)
      .then((rich) => {
        // edit the memo
        // ----------------------

        var memos = this.state.memos.slice();

        for (let i = 0; i < memos.length; i++) {
          if (memos[i].uid === memo.uid) {
            // found! edit it.
            let memo = memos[i];
            if (rich.r_category !== 'Unknown') {
              memo.r_category = rich.r_category;
            }
            if (rich.r_img) {
              memo.r_img = rich.r_img;
            }
            if (rich.r_title) {
              memo.r_title = rich.r_title;
            }
            if (rich.r_url) {
              memo.r_url = rich.r_url;
            }
            if (rich.last_update) {
              memo.last_update = rich.last_update;
            }
            break;
          }
        }

        this.setState({
          memos: memos,
        });
    });
  }

  // newMemo generates a memo object.
  newMemo(text) {
    return {
      uid: randomUuid(),
      text: text,
    }
  }

  // XHR
  // ----------------------

  fetchMemos = () => {
    XHRMemo.getMemos().then((json) => {
      let memos = [];

      for (let i = 0; i < json.length; i++) {
        memos.push(json[i]);
      }

      this.setState({
        memos: memos,
      });
    }).catch((response) => Helpers.toLoginOrAlert(this, response));
  }

  // Memo actions
  // ----------------------

  memoClick = (event, openedMemo) => {
    this.openDialog(event, null, openedMemo, true);
  }

  memoDragStart = (event) => {};
  memoDragOver = (event) => {};
  memoDragEnd = (event) => {};
  memoDragLeave = (event) => {};
  memoDrop = (event, id) => {
    var src_id = event.dataTransfer.getData("application/id");
    var dst_id = id;

    let left_idx = -1;
    let right_idx = -1;

    for (let i = 0; i < this.state.memos.length; i++) {
      if (src_id === this.state.memos[i].uid) {
        left_idx = i;
        break;
      }
    }

    for (let i = 0; i < this.state.memos.length; i++) {
      if (dst_id === this.state.memos[i].uid) {
        right_idx = i;
        break;
      }
    }

    var left = this.state.memos[left_idx];
    var right = this.state.memos[right_idx];

    if (!left || !right) {
      console.warn('undefined left or right.');
      console.warn('left:', left);
      console.warn('right:', right);
      return;
    }

    // backend call

    // TODO(remy): handle error
    XHRMemo.switchMemo(src_id, dst_id);

    // visually move the memo

    var memos = this.state.memos.slice();

    memos[left_idx] = right;
    memos[right_idx] = left;

    this.setState({
      memos: memos,
    });
  };

  // memos actions
  // ----------------------

  archiveMemo = (event, memoUid) => {
    XHRMemo.archiveMemo(memoUid).then((json) => {
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

  // Memoiz dialog
  // ----------------------

  openDialog = (event, rEvent, openedMemo, edit) => {
    this.openedMemo = openedMemo;
    this.setState({
      memoDialogOpen: true,
    });

    edit = !!edit;
    if (!edit) { // do not focus on the textfield in edit mode
      setTimeout(() => {
        var el = document.querySelector('#memoiz-input-modal');
        if (el) { el.focus(); }
      }, 100);
    }
  }

  // memo adds a new memo entry in the memos
  // or sends modification of the current one.
  onSubmit = (text, enrich) => {
    if (!text.length) {
      return;
    }

    // TODO(remy): add a loader here.

    // backend hit to add the memo
    // ----------------------

    if (this.openedMemo) {
      this.putChanges(this.openedMemo.id, text, enrich);
    } else {
      this.postNewMemo(text, enrich);
    }
    this.openedMemo = undefined;
  }

  toggleMenu = () => {
    let s = this.state;
    s.menu = !s.menu;
    this.setState(s);
  }

  closeAlert = () => {
    this.setState({alert: false});
  }

  // ----------------------

  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.toggleMenu}
          title={<span className="app-bar-title">Memoiz</span>}
          titleStyle={styles.title}
          /*iconElementRight={
            <TextField
              hintText="Search"
              style={{marginRight: '2em'}}
              hintStyle={{color: 'white'}}
            />}*/
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
        <FloatingActionButton style={styles.fab} onClick={this.openDialog}>
          <ContentAdd />
        </FloatingActionButton>
        <Menu
          open={this.state.menu}
          mode={MenuModes.Memos}
          toggleMenu={this.toggleMenu}
          onMemo={this.openDialog}
        />
        <MemoDialog 
          openDialog={this.state.memoDialogOpen}
          onDialogClose={() => { this.setState({memoDialogOpen: false}); }}
          submit={this.onSubmit}
          memo={this.openedMemo}
          mode={MemoDialogModes.Normal}
          onArchive={this.archiveMemo}
        />
        <Paper zDepth={2} className="memoiz-container">
          <div className="memoiz">
            <TextField className="memoiz-input" id="memoiz-input-page" value="" onChange={this.openDialog} onClick={this.openDialog} fullWidth={true} multiLine={true} placeholder="Write down a memo here" />
            <RaisedButton className="memoiz-button" onClick={this.submit} label="Save" fullWidth={true} />
          </div>
        </Paper>
        <div>
          <div className="memo-container" onClick={this.handleClick}>
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
                  onDragStart={this.memoDragStart}
                  onDragOver={this.memoDragOver}
                  onDragEnd={this.memoDragEnd}
                  onDragLeave={this.memoDragLeave}
                  onDrop={this.memoDrop}
                  onClick={this.memoClick}
                  onArchive={this.archiveMemo}
                />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Memos;