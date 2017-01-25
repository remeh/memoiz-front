import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import XHRCheckout from './xhr/checkout.js';

import './box.css';
import './checkout.css';

class Checkout extends Component {
  constructor(props) {
    super(props);
    window.Stripe.setPublishableKey('pk_test_4Ukbv9lXi2SBW71FbTYsVyiK');

    this.state = {
      disabledSubmit: false,
      month: '01',
      year: '2017',
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

    // add the plan
    response.plan = '1';

    XHRCheckout.checkout(response);
  }

  monthChange = (ev, idx, val) => {
    this.setState({
      month: val,
    });
  }

  yearChange = (ev, idx, val) => {
    this.setState({
      year: val,
    });
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
          
          <span className="payment-errors"></span>
          <h3>Plan</h3>
          <RadioButtonGroup name="plan" defaultSelected="2">
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
              <TextField className="card-num" floatingLabelFixed={true} floatingLabelText="Card Number" />
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
              <TextField className="cvc" floatingLabelFixed={true} floatingLabelText="CVC" />
            </div>

            <div>
              <TextField className="postal-code" floatingLabelFixed={true} floatingLabelText="Postal Code" />
            </div>
          </div>

          <RaisedButton className="checkout-button" disabled={this.state.disabledSubmit} onClick={this.checkout} label="Submit Payment" fullWidth={true} />
        </form>
      </div>
  }
}

export default Checkout;
