import XHR from './xhr.js';

class XHRAccount {
  static logout() {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/accounts/logout', // XXX(remy): fix url
    );
  }

  static login(email, password) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/accounts/login', // XXX(remy): fix url
      null,
      {email: email, password: password}
    );
  }

  static signup(email, password, firstname) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/accounts', // XXX(remy): fix url
      null,
      {email: email, password: password, firstname: firstname}
    );
  }
}

export default XHRAccount;

