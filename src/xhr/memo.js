import XHR from './xhr.js';

class XHRMemo {
  static archiveMemo(uid, memoUid) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/'+memoUid+'/archive',
    );
  }

  static getMemos(uid) {
    return XHR.getJson(
      XHR.domain + '/api/1.0/memos',
    );
  }

  static enrichMemo(uid, memoUid) {
    return XHR.getJson(
      XHR.domain + '/api/1.0/memos/'+memoUid+'/rich',
    );
  }

  static postMemo(uid, text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos',
      null,
      {text: text, enrich: enrich},
    );
  }

  static putMemo(uid, memoUid, text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos',
      null,
      {memo_uid: memoUid, text: text, enrich: enrich},
    );
  }

  static switchMemo(uid, left, right) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/switch/' + left + '/' + right,
    );
  }
}

export default XHRMemo;
