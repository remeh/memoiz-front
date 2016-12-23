import XHR from './xhr.js';

class XHRScratch {
  static getCards(uid) {
    return XHR.getJson(
      'http://localhost:8080/api/1.0/cards', // XXX(remy): fix url
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
}

export default XHRScratch;
