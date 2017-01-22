import XHR from './xhr.js';

class XHRAccount {
  static logout() {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/logout',
    );
  }

  static login(email, password) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/login',
      null,
      {email: email, password: password}
    );
  }

  static signup(email, password, firstname) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts',
      null,
      {email: email, password: password, firstname: firstname}
    );
  }
}

export default XHRAccount;

