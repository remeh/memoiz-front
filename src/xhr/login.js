import XHR from './xhr.js';

class XHRLogin {
  static sendLogin(email, password) {
    return XHR.postJson(
      'http://localhost:8080/api/1.0/accounts/login', // XXX(remy): fix url
      null,
      {email: email, password: password}
    );
  }
}

export default XHRLogin;

