import XHR from './xhr.js';

class XHRMemo {
  static archiveCard(uid, cardUid) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/cards/'+cardUid+'/archive',
      {u: uid}
    );
  }

  static getCards(uid) {
    return XHR.getJson(
      XHR.domain + '/api/1.0/cards',
      {u: uid}
    );
  }

  static enrichCard(uid, cardUid) {
    return XHR.getJson(
      XHR.domain + '/api/1.0/cards/'+cardUid+'/rich',
      {u: uid}
    );
  }

  static postCard(uid, text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      XHR.domain + '/api/1.0/cards',
      {u: uid},
      {text: text, enrich: enrich},
    );
  }

  static putCard(uid, cardUid, text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      XHR.domain + '/api/1.0/cards',
      {u: uid},
      {card_uid: cardUid, text: text, enrich: enrich},
    );
  }

  static switchCard(uid, left, right) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/cards/switch/' + left + '/' + right,
      {u: uid}
    );
  }
}

export default XHRMemo;
