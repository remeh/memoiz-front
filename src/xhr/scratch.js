import XHR from './xhr.js';

class XHRScratch {
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

  static postCard(uid, text) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/cards', // XXX(remy): fix url
      {u: uid},
      {text: text},
    );
  }

  static putCard(uid, cardUid, text) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/cards', // XXX(remy): fix url
      {u: uid},
      {card_uid: cardUid, text: text},
    );
  }

  static switchCard(uid, left, right) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/cards/switch', // XXX(remy): fix url
      {u: uid},
      {l: left, r: right},
    );
  }
}

export default XHRScratch;
