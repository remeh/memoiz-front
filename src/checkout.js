import React, { Component } from 'react';
import Link from 'react-router'
import Lock from 'material-ui/svg-icons/action/lock';
import Mood from 'material-ui/svg-icons/social/mood';
import {red400, green400, lightGreen900} from 'material-ui/styles/colors';

import AppBar from 'material-ui/AppBar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import XHRAccount from './xhr/account.js';
import XHRCheckout from './xhr/checkout.js';
import Menu from './menu.js';

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

    XHRAccount.infos().then((response) => {
      if (response.subscribed) {
        this.setState({
          subscribed: response.subscribed,
        });
      }
    });

    XHRCheckout.plans().then((response) => {
      var plans = [];
      for (let i = 0; i < response.order.length; i++) {
        plans.push(response.plans[response.order[i]]);
      }

      this.setState({
        plans: plans,
        plan: plans[1],
      });

    }).catch((response) => {
      // XXX(remy): TODO TODO !!!!!!!!!!!!!!!!
    });

    this.state = {
      disabledSubmit: false,

      menu: false,

      subscribed: false,

      plan: {},
      plans: [],

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
    req.plan = this.state.plan.id;

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
      plan: this.state.plans[val],
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

  toggleMenu = () => {
    let s = this.state;
    s.menu = !s.menu;
    this.setState(s);
  }

  render() {
    return <div className="checkout-page">
        <AppBar
          onLeftIconButtonTouchTap={this.toggleMenu}
          title={<span className="app-bar-title">Memoiz</span>}
          titleStyle={styles.title}
        />
        <Menu
          open={this.state.menu}
          mode={'checkout'}
          toggleMenu={this.toggleMenu}
        />

        {this.state.subscribed && <div className="checkout">
          <div className="box">
            <h1>Subscription</h1>
            <h3>You are already subscribed! <Mood /></h3>
            <h4>
              Go to <a href="/settings">settings</a> to see your current subscription.
            </h4>
          </div>
         </div>}
        {!this.state.subscribed && <div className="checkout">
          <div className="checkout-form box">
            <form method="POST" id="payment-form">
              <div className="lock">
                <Lock color={lightGreen900} className="lock" />
              </div>
              <h3>Plan</h3>
              <div className="container-plan">
                <div className="plans">
                  <RadioButtonGroup name="plan" onChange={this.planChange} defaultSelected={1}>
                    {this.state.plans.map((val, idx) => <RadioButton
                        key={idx}
                        value={idx}
                        label={'' + val.name + ' - ' + val.duration}
                      />
                    )}
                  </RadioButtonGroup>
                </div>
                <div className="price">
                  <h1>{this.state.plan.price}</h1>
                </div>
              </div>

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

              <RaisedButton className="checkout-button" secondary={true} disabled={this.state.disabledSubmit} onClick={this.checkout} label="Submit Payment" fullWidth={true} />
            </form>
          </div>
          <div className="checkout-information">
            <h2>Starter Plan</h2>
            <h3>The <em>{this.state.plan.name} Plan</em> is <strong>{this.state.plan.price}</strong> for a <strong>{this.state.plan.duration}</strong> subscription.</h3>
            <hr />
            <h3>Each plan contains all features</h3>
            <h4>Every features is important in Memoiz, that's why we've decided to include all features, in all plans.</h4>
            <h3>We won't automatically charge your card!</h3>
            <h4>At the end of your subscription, we'll just ask you if you want to continue your subscription.</h4>
          </div>
        </div>
        }
      </div>
  }
}

export default Checkout;
