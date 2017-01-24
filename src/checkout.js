import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class Checkout extends Component {
  constructor(props) {
    super(props);
    window.Stripe.setPublishableKey('pk_test_4Ukbv9lXi2SBW71FbTYsVyiK');

    this.state = {
      disabledSubmit: false,
    }
  }
  
  close = () => {
    this.props.checkoutClose();
  }

  checkout = () => {
    this.setState({
      disabledSubmit: true,
    });

    // TODO(remy): gather data to send it to Stripe
    let c = {
      number: 4242424242424242,
      cvc: 555,
      exp_month: 12,
      exp_year: 19,
      address_zip: 69100,
    };

    window.Stripe.card.createToken(c, this.stripeResponseHandler);
  }

  stripeResponseHandler = (status, response) => {
    // TODO(remy): implement me.
    console.log(status);
    console.log(response);
  }

  render() {
    return <div>
        <form action="/your-charge-code" method="POST" id="payment-form">
          <span className="payment-errors"></span>

          <div className="form-row">
            <label>
              <span>Card Number</span>
              <input type="text" size="20" data-stripe="number" />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>Expiration (MM/YY)</span>
              <input type="text" size="2" data-stripe="exp_month" />
            </label>
            <span> / </span>
            <input type="text" size="2" data-stripe="exp_year" />
          </div>

          <div className="form-row">
            <label>
              <span>CVC</span>
              <input type="text" size="4" data-stripe="cvc" />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>Billing Postal Code</span>
              <input type="text" size="6" data-stripe="address_zip" />
            </label>
          </div>

          <RaisedButton disabled={this.state.disabledSubmit} onClick={this.checkout} label="Submit Payment" fullWidth={true} />
        </form>
      </div>
  }
}

export default Checkout;
