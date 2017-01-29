class Helpers {
  static toLoginOrAlert(instance, response) {
    if (response && response.status === 403) {
      document.location = '/login';
      return;
    }

    if (instance && instance.setState) {
      instance.setState({alert: true});
    }
  }
}

export default Helpers;
