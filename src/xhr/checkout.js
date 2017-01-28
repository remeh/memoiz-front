import XHR from './xhr.js';

class XHRCheckout {
  static plans() {
    return XHR.getJson(
      XHR.domain + '/api/1.0/plans',
    );
  }
  static checkout(data) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/checkout',
      null,
      data
    );
  }
}

export default XHRCheckout;
