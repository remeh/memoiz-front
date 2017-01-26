import React, { Component } from 'react';
import Lock from 'material-ui/svg-icons/action/lock';
import {red400, green400} from 'material-ui/styles/colors';

import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
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
      month: '01',
      year: '2017',
      cvc: '',
      postal_code: '',

      error: '',
      success: '',
    }
  }

  close = () => {
    this.props.checkoutClose();
  }

  // checkout calls stripe for payment.
  checkout = () => {
    this.setState({
      disabledSubmit: true,
      error: '',
    });

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

  monthChange = (ev, idx, val) => {
    this.setState({ month: val, });
  }

  yearChange = (ev, idx, val) => {
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

  generateMonths = () => {
    var rows = [];
    for (let i = 1; i <= 12; i++) {
          rows.push(<MenuItem key={i} value={i} label={i} primaryText={i} />);
    }
    return rows;
  }

  generateYears = () => {
    var rows = [];
    for (let i = 2017; i <= 2030; i++) {
          rows.push(<MenuItem key={i} value={i} label={i} primaryText={i} />);
    }
    return rows;
  }

  render() {
    return <div className="checkout box">
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
              <TextField className="card-num" value={this.state.card_number} onChange={this.cardNumberChange} floatingLabelFixed={true} floatingLabelText="Card Number" />
            </div>

            <div style={{display: 'flex'}}>
              <SelectField className="month" floatingLabelText={<span>Expiration</span>} value={this.state.month} onChange={this.monthChange}>
                {this.generateMonths()}
              </SelectField>
              <SelectField className="year" floatingLabelText={<span></span>} value={this.state.year} onChange={this.yearChange}>
                {this.generateYears()}
              </SelectField>
            </div>

            <div>
              <TextField className="cvc" value={this.state.cvc} onChange={this.cvcChange} floatingLabelFixed={true} floatingLabelText="CVC" />
            </div>

            <div>
              <TextField className="postal-code" value={this.state.postal_code} onChange={this.postalChange} floatingLabelFixed={true} floatingLabelText="Postal Code" />
            </div>
          </div>

          <div className="errors" style={styles.errors}>{this.state.error}</div>
          <div className="success" style={styles.success}>{this.state.success}</div>

          <RaisedButton className="checkout-button" disabled={this.state.disabledSubmit} onClick={this.checkout} label="Submit Payment" fullWidth={true} />
        </form>
      </div>
  }
}

export default Checkout;
