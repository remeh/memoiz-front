export default class Strings {
  static cut(str, count) {
    if (!str.length || str.length <= count) {
      return str;
    }

    if (!str) {
      return '';
    }
    if (!count) {
      count = 10E10;
    }
    return str.substring(0, count) + '...';
  }
}
