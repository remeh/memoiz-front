class XHRScratch {
  static getCards(uid) {
    let q = new Promise(
      (resolve, reject) => {
        fetch('http://localhost:8080/api/1.0/cards?u='+uid).then((response) => {
          if (response.ok) {
            response.json().then(resolve);
          } else {
            reject();
          }
      }, reject);
    });
    return q;
  } 
}

export default XHRScratch;
