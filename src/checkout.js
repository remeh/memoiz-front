import React, { Component } from 'react';
import Lock from 'material-ui/svg-icons/action/lock';
import {red400, green400} from 'material-ui/styles/colors';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import XHRCheckout from './xhr/checkout.js';

import './box.css';
import './checkout.css';

let styles = {
  errors: {
    color: red400,
  },
  success: {
    color: green400,
  },
}

class Checkout extends Component {
  constructor(props) {
    super(props);
    window.Stripe.setPublishableKey('pk_test_4Ukbv9lXi2SBW71FbTYsVyiK');

    this.state = {
      disabledSubmit: false,

      plan: '2',

      card_number: '',
      month: '',
      year: '',
      cvc: '',
      postal_code: '',

      errors: {
        card_number: '',
        month: '',
        year: '',
        cvc: '',
        postal_code: '',
      },

      error: '',
      success: '',
    }
  }

  close = () => {
    this.props.checkoutClose();
  }

  // checkout calls stripe for payment.
  checkout = () => {
    let errors = {
        card_number: '',
        month: '',
        year: '',
        cvc: '',
        postal_code: '',
    };

    this.setState({
      disabledSubmit: true,
      error: '',
      errors: errors,
    });

    let error = false;

    if (this.state.card_number.length !== 16) {
      errors.card_number = 'Please enter a valid card number.';
      error = true;
    }

    if (this.state.month < 1 || this.state.month > 12) {
      errors.month = ' ';
      error = true;
    }

    if (this.state.year < 2017) {
      errors.year = ' ';
      error = true;
    }

    if (this.state.cvc.length < 1) {
      errors.cvc = ' ';
      error = true;
    }

    if (this.state.postal_code.length < 1) {
      errors.postal_code = ' ';
      error = true;
    }

    if (error) {
      this.setState({
        errors: errors,
        disabledSubmit: false,
      });
      return;
    }

    let c = {
      number: this.state.card_number,
      cvc: this.state.cvc,
      exp_month: this.state.month,
      exp_year: this.state.year,
      address_zip: this.state.postal_code,
    };

    window.Stripe.card.createToken(c, this.stripeResponseHandler);
  }

  stripeResponseHandler = (status, response) => {
    if (status !== 200) {
      if (status === 402) {
        this.setState({
          error: 'Please check your card information.',
          disabledSubmit: false,
        });
      }
      return;
    }

    // add the plan to the request.
    var req = response;
    req.plan = this.state.plan;

    XHRCheckout.checkout(req).then((resp) => {
      // success
      // ----------------------
      this.setState({
        success: "Subscription correctly done. You'll be redirected in a few seconds.",
      });
      setTimeout(() => {
        document.location = '/app';
      }, 3000);
    }).catch((resp) => {
      // error
      // ----------------------
      this.setState({
        error: "An error occurred, please contact us at contact@memoiz.com.",
      });
    });
  }

  planChange = (ev, val) => {
    this.setState({
      plan: ''+val,
    });
  }

  monthChange = (ev, val) => {
    this.setState({ month: val, });
  }

  yearChange = (ev, val) => {
    this.setState({ year: val, });
  }

  cvcChange = (ev, val) => {
    this.setState({ cvc: val, });
  }

  cardNumberChange = (ev, val) => {
    this.setState({ card_number: val, });
  }

  postalChange = (ev, val) => {
    this.setState({ postal_code: val, });
  }

  render() {
    return <div className="checkout">
        <div className="checkout-form box">
          <form method="POST" id="payment-form">
            <Lock className="lock" />
            <h3>Plan</h3>
            <RadioButtonGroup name="plan" onChange={this.planChange} defaultSelected="2">
              <RadioButton
              value="1"
                label="Basic - 3 months"
              />
              <RadioButton
                value="2"
                label="Starter - 6 months"
              />
              <RadioButton
                value="3"
                label="Year - 12 months"
              />
            </RadioButtonGroup>

            <div className="card">
              <h3>Credit Card</h3>
              <div>
                <TextField className="card-num" errorText={this.state.errors.card_number} value={this.state.card_number} onChange={this.cardNumberChange} floatingLabelFixed={true} floatingLabelText="Card Number" />
              </div>

              <div style={{display: 'flex'}}>
                <TextField className="month" errorText={this.state.errors.month} floatingLabelFixed={true} floatingLabelText={<span>Expiration</span>} value={this.state.month} onChange={this.monthChange} />
                <TextField className="year" errorText={this.state.errors.year} floatingLabelText={<span></span>} value={this.state.year} onChange={this.yearChange} />
              </div>

              <div>
                <TextField className="cvc" errorText={this.state.errors.cvc} value={this.state.cvc} onChange={this.cvcChange} floatingLabelFixed={true} floatingLabelText="CVC" />
              </div>

              <div>
                <TextField className="postal-code" errorText={this.state.errors.postal_code} value={this.state.postal_code} onChange={this.postalChange} floatingLabelFixed={true} floatingLabelText="Postal Code" />
              </div>
            </div>

            <div className="errors" style={styles.errors}>{this.state.error}</div>
            <div className="success" style={styles.success}>{this.state.success}</div>

            <RaisedButton className="checkout-button" disabled={this.state.disabledSubmit} onClick={this.checkout} label="Submit Payment" fullWidth={true} />
          </form>
        </div>
        <div className="checkout-information">
          <h2>Starter Plan</h2>
          <h3>The <em>Starter Plan</em> is <strong>5$</strong> for a <strong>3 months</strong> subscriptions.</h3>
          <hr />
          <h3>Each plan contains all features</h3>
          <h4>Every features is important in Memoiz, that's why we've decided to include all features, in all plans.</h4>
          <h3>We won't automatically charge your card!</h3>
          <h4>At the end of your subscription, we'll just ask you if you want to continue your subscription.</h4>
        </div>
      </div>
  }
}

export default Checkout;
