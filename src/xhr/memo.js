import XHR from './xhr.js';

class XHRMemo {
  static archiveCard(uid, cardUid) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/cards/'+cardUid+'/archive', // XXX(remy): fix url
      {u: uid}
    );
  }

  static getCards(uid) {
    return XHR.getJson(
      'http://localhost:8080/api/1.0/cards', // XXX(remy): fix url
      {u: uid}
    );
  }

  static enrichCard(uid, cardUid) {
    return XHR.getJson(
      'http://localhost:8080/api/1.0/cards/'+cardUid+'/rich', // XXX(remy): fix url
      {u: uid}
    );
  }

  static postCard(uid, text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      'http://localhost:8080/api/1.0/cards', // XXX(remy): fix url
      {u: uid},
      {text: text, enrich: enrich},
    );
  }

  static putCard(uid, cardUid, text, enrich) {
    enrich = !!enrich; // force boolean
    return XHR.postJson(
      'http://localhost:8080/api/1.0/cards', // XXX(remy): fix url
      {u: uid},
      {card_uid: cardUid, text: text, enrich: enrich},
    );
  }

  static switchCard(uid, left, right) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/cards/switch/' + left + '/' + right, // XXX(remy): fix url
      {u: uid}
    );
  }
}

export default XHRMemo;
