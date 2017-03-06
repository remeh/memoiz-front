import XHR from './xhr.js';

class XHRMemo {
  static archiveMemo(memoUid) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/'+memoUid+'/archive',
    );
  }

  static restoreMemo(memoUid) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/'+memoUid+'/restore',
    );
  }

  static getMemos(state, search) {
    let q = "";
    if (state || search) {
      q = "?"
      if (state) {
        q += "s="+state+"&";
      }
      if (search) {
        q += "se="+search+"&";
      }
    }
    return XHR.getJson(
      XHR.domain + '/api/1.0/memos'+q,
    );
  }

  static enrichMemo(memoUid) {
    return XHR.getJson(
      XHR.domain + '/api/1.0/memos/'+memoUid+'/rich',
    );
  }

  static postMemo(text, enrich, reminder) {
    enrich = !!enrich; // force boolean
    if (reminder) {
      reminder = reminder.getTime();
    }
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos',
      null,
      {text: text, enrich: enrich, reminder: reminder},
    );
  }

  static putMemo(memoUid, text, enrich, reminder) {
    enrich = !!enrich; // force boolean
    if (reminder) {
      reminder = new Date(reminder).getTime();
    }
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos',
      null,
      {memo_uid: memoUid, text: text, enrich: enrich, reminder: reminder},
    );
  }

  static switchMemo(left, right) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/switch/' + left + '/' + right,
    );
  }

  static unrichMemo(memoUid) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/' + memoUid + '/unrich',
    );
  };

  static removeCat(memoUid) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/' + memoUid + '/unsetcat',
    );
  };
}

export default XHRMemo;
