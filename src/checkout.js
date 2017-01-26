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

      plan: '2',

      card_number: '',
      month: '01',
      year: '2017',
      cvc: '',
      postal_code: '',
    }
  }
  
  close = () => {
    this.props.checkoutClose();
  }

  checkout = () => {
    this.setState({
      disabledSubmit: true,
    });

    console.log(this.state.card_number);
    console.log(this.state.cvc);
    console.log(this.state.postal_code);
    console.log(this.state.month);
    console.log(this.state.year);

    // TODO(remy): gather data to send it to Stripe
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
    // TODO(remy): implement me.
    console.log(status);
    console.log(response);

    // add the plan to the request.
    response.plan = this.state.plan;

    XHRCheckout.checkout(response);
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
          
          <span className="payment-errors"></span>
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

          <RaisedButton className="checkout-button" disabled={this.state.disabledSubmit} onClick={this.checkout} label="Submit Payment" fullWidth={true} />
        </form>
      </div>
  }
}

export default Checkout;
