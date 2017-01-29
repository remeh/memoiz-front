import XHR from './xhr.js';

class XHRMemo {
  static archiveMemo(memoUid) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/'+memoUid+'/archive',
    );
  }

  static getMemos() {
    return XHR.getJson(
      XHR.domain + '/api/1.0/memos',
    );
  }

  static enrichMemo(memoUid) {
    return XHR.getJson(
      XHR.domain + '/api/1.0/memos/'+memoUid+'/rich',
    );
  }

  static postMemo(text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos',
      null,
      {text: text, enrich: enrich},
    );
  }

  static putMemo(memoUid, text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos',
      null,
      {memo_uid: memoUid, text: text, enrich: enrich},
    );
  }

  static switchMemo(left, right) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/memos/switch/' + left + '/' + right,
    );
  }
}

export default XHRMemo;
