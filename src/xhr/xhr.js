class XHR {
  static getJson(url, params) {
    return XHR.requestJson(url, 'GET', params);
  }

  static postJson(url, params, body) {
    return XHR.requestJson(url, 'POST', params, body);
  }

  static deleteJson(url, params, body) {
    return XHR.requestJson(url, 'DELETE', params, body);
  }

  static requestJson(url, method, params, body) {
    var req = {
      method: method,
      mode: 'cors',
      //credentials: 'include',
      cache: 'default',
    };

    if (body) {
      req.body = JSON.stringify(body);
    }

    let finalUrl = url + '?' + XHR.encodeQueryData(params);

    let q = new Promise(
      (resolve, reject) => {
        fetch(finalUrl, req).then((response) => {
          if (response.ok) {
            response.json().then(resolve);
          } else {
            reject();
          }
      }, reject);
    });
    return q;
  }

  static encodeQueryData(data) {
       let ret = [];
       for (let d in data) {
         if (data.hasOwnProperty(d)) {
           ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
         }
       }
       return ret.join('&');
  }
}

export default XHR;
