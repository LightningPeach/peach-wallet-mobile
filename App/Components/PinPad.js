import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import PinIndicator from './PinIndicator';

// Styles
import styles from './Styles/PinPadStyle';
import Text from './Text';
import { Images, Metrics } from '../Themes';
import AppConfig from '../Config/AppConfig';

export default class PinPad extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onPinEntered: PropTypes.func.isRequired,
    onCancelTapped: PropTypes.func,
  };

  static defaultProps = {
    onCancelTapped: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      pin: '',
    };
  }

  onNumberTapped = (num) => {
    this.setState(
      (oldState) => {
        const { pin } = oldState;
        const newPin = pin + num.toString();
        if (newPin.length <= AppConfig.pinLength) {
          return {
            pin: newPin,
            error: null,
          };
        }

        return null;
      },
      () => {
        const { onPinEntered } = this.props;
        if (this.state.pin.length === AppConfig.pinLength) {
          onPinEntered(this.state.pin);
        }
      },
    );
  };

  onDeleteButtonTapped = () => {
    this.setState((oldState) => {
      const { pin } = oldState;
      if (pin.length > 0) {
        const newPin = pin.slice(0, -1);
        return {
          pin: newPin,
        };
      }

      return null;
    });
  };

  showError = (error) => {
    this.setState({ pin: '', error }, () => {
      this.indicatorContainer.shake(800);
    });
  };

  reset = () => {
    this.setState({ pin: '', error: null });
  };

  renderNumberButton = (num, style) => (
    <TouchableOpacity
      activeOpacity={Metrics.activeOpacity}
      delayIn={0}
      onPress={() => this.onNumberTapped(num)}
      style={[styles.numberButton, style]}
    >
      <Text style={styles.numberButtonText}>{num}</Text>
    </TouchableOpacity>
  );

  render() {
    const { pin, error } = this.state;
    const { title, onCancelTapped, ...rest } = this.props;

    const disableDeleteButton = pin.length === 0;
    const showCancelButton = !!onCancelTapped;
    const activeIndicatorNumber = pin.length;

    return (
      <View {...rest}>
        <Text style={styles.title}>{title}</Text>
        <Animatable.View
          ref={(ref) => {
            this.indicatorContainer = ref;
          }}
        >
          <PinIndicator
            style={styles.indicatorContainer}
            activeIndicatorNumber={activeIndicatorNumber}
            indicatorNumber={AppConfig.pinLength}
          />
        </Animatable.View>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.flexSpace} />
        <View style={styles.numbersContainer}>
          <View style={styles.rowContainer}>
            {this.renderNumberButton(1)}
            {this.renderNumberButton(2)}
            {this.renderNumberButton(3, styles.lastColumn)}
          </View>
          <View style={styles.rowContainer}>
            {this.renderNumberButton(4)}
            {this.renderNumberButton(5)}
            {this.renderNumberButton(6, styles.lastColumn)}
          </View>
          <View style={styles.rowContainer}>
            {this.renderNumberButton(7)}
            {this.renderNumberButton(8)}
            {this.renderNumberButton(9, styles.lastColumn)}
          </View>
          <View style={styles.rowContainer}>
            {showCancelButton ? (
              <TouchableOpacity
                activeOpacity={Metrics.activeOpacity}
                onPress={() => onCancelTapped()}
                style={styles.numberButton}
              >
                <Text style={styles.cancel}>CANCEL</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.numberButton} />
            )}
            {this.renderNumberButton(0)}
            <TouchableOpacity
              disabled={disableDeleteButton}
              activeOpacity={Metrics.activeOpacity}
              onPress={() => this.onDeleteButtonTapped()}
              style={[styles.numberButton, styles.lastColumn]}
            >
              <Image source={Images.back} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
