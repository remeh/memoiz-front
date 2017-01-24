import XHR from './xhr.js';

class XHRCheckout {
  static checkout(data) {
    return XHR.postJson(
      XHR.domain + '/api/1.0/accounts/checkout',
      null,
      data
    );
  }
}

export default XHRCheckout;
