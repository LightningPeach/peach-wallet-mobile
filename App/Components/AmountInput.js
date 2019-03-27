import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import TextInput from '../Components/TextInput';
import Types from '../Config/Types';

export default class AmountInput extends Component {
  static propTypes = {
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    onBlur: null,
    onChangeText: null,
    onFocus: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountFormatted: '',
    };
  }

  handleBlur = (onBlur) => {
    if (onBlur) {
      onBlur();
    }
    let amountFormatted;
    if (isEmpty(this.state.amount)) {
      amountFormatted = '';
    } else {
      amountFormatted = `${this.state.amount} ${this.props.btcFraction}`;
    }
    this.setState({ amountFormatted });
  };

  handleFocus = (onFocus) => {
    if (onFocus) {
      onFocus();
    }
    this.setState({ amountFormatted: this.state.amount });
  };

  handleInput = (onChangeText, amount) => {
    if (onChangeText) {
      onChangeText(amount);
    }
    this.setState({ amount, amountFormatted: amount });
  };

  render() {
    const {
      onChangeText, onBlur, onFocus, ...rest
    } = this.props;
    return (
      <TextInput
        {...rest}
        onChangeText={amount => this.handleInput(onChangeText, amount)}
        value={this.state.amountFormatted}
        onBlur={() => this.handleBlur(onBlur)}
        onFocus={() => this.handleFocus(onFocus)}
        placeholder={`Amount in ${this.props.btcFraction}`}
        keyboardType="numeric"
      />
    );
  }
}
