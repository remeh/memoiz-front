class XHRScratche {
  fetchCards = () => {
    // TODO(remy): backend call

    let v = [];

    v.push('Hello');
    v.push('world');
    v.push('!');

    for (let i = 0; i < 15; i++) {
      v.push('Card ' + i);
    }

    return v;
  }
}

export default XHRScratche;
