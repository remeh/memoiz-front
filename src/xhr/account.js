import XHR from './xhr.js';

class XHRAccount {
  static isAuth() {
    return XHR.getJson(
      XHR.domain + '/api/1.0/accounts',
    );
  }

  static infos() {
    return XHR.getJson(
      XHR.domain + '/api/1.0/accounts/infos',
    );
  }

  static logout() {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/logout',
    );
  }

  static login(email, password, timezone) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/login',
      null,
      {email: email, password: password, timezone: timezone}
    );
  }

  static signup(email, password, firstname) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts',
      null,
      {email: email, password: password, firstname: firstname}
    );
  }

  static forgotPassword(email) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/forgotpwd',
      null,
      {email: email}
    );
  }

  static passwordReset(pwd, token) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/pwdreset',
      null,
      {pwd: pwd, token: token},
    );
  }
}

export default XHRAccount;

