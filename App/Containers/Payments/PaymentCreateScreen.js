import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { isEmpty, replace, isNil } from 'ramda';
import Text from '../../Components/Text';
import { checkAmount, checkTimeField } from '../../Services/Check';
import { LightningSelectors } from '../../Redux/LightningRedux';
import PaymentScreenActions, { PaymentCreateScreenSelectors } from '../../Redux/PaymentCreateScreenRedux';

import {
  getPaymentType,
  getPaymentSubtype,
  isStreamPayment,
  getPaymentAddress,
  getPaymentAmount,
  getPaymentName,
  getPaymentToName,
  getPaymentData,
  getTypeDisplayName,
} from '../../Services/Payment';
import { capitalizeFirstLetter } from '../../Transforms/capitalizeFirstLetter';
import {
  satoshiToUsd,
  satoshiToBtcFraction,
  convertToSatochiByType,
} from '../../Transforms/currencies';

import Types from '../../Config/Types';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import HeaderButton from '../../Components/HeaderButton';
import { Colors, Metrics, Images } from '../../Themes';
import NfcActions, { NfcSelectors } from '../../Redux/NfcRedux';

// Styles
import styles from './Styles/PaymentCreateScreenStyle';
import { AccountSelectors } from '../../Redux/AccountRedux';
import AmountUsdText from '../../Components/AmountUsdText';

class PaymentCreateScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Create payment',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
    headerRight: PaymentCreateScreen.renderHeaderActions(navigation),
  });

  static propTypes = {
    lightningBalance: Types.FLOAT_NUMBER_PROPS,
    bitcoinBalance: Types.FLOAT_NUMBER_PROPS,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    navigation: Types.NAVIGATION_PROPS(PropTypes.shape({
      type: PropTypes.string,
      subType: PropTypes.string,
    }).isRequired).isRequired,
    usdPerBtc: Types.FLOAT_NUMBER_PROPS.isRequired,
    maximumPayment: Types.FLOAT_NUMBER_PROPS.isRequired,
    toField: Types.PAYMENT_SCREEN_TO_FIELD_PROPS,
    onToFieldValueChanged: PropTypes.func.isRequired,
    resetToField: PropTypes.func.isRequired,
    nfcScanSuccess: Types.NFC_SCAN_SUCCESS_PROPS,
    nfcPaymentRequest: PropTypes.func.isRequired,
    isNfcSupported: PropTypes.bool,
    privacyMode: Types.MODE_PROPS,
  };

  static defaultProps = {
    bitcoinBalance: '0',
    lightningBalance: '0',
    toField: undefined,
    nfcScanSuccess: undefined,
    isNfcSupported: false,
    privacyMode: null,
  };

  static renderHeaderActions(navigation) {
    const { isNfcSupported, onPressNfc, onPressQrCode } = navigation.state.params || {};
    return (
      <View style={styles.headerContainer}>
        {isNfcSupported && <HeaderButton icon={Images.buttonNfc} onPress={() => onPressNfc()} />}
        <HeaderButton icon={Images.buttonQrCode} onPress={() => onPressQrCode()} />
      </View>
    );
  }

  constructor(props) {
    super(props);

    const { btcFraction } = this.props;

    const { params } = props.navigation.state;
    const type = getPaymentType(params);
    const subType = getPaymentSubtype(params);
    const isStream = isStreamPayment(type, subType);
    const name = getPaymentName(params);
    const toName = getPaymentToName(params);
    const address = getPaymentAddress(params);
    const amount = getPaymentAmount(params);
    const paymentData = getPaymentData(params);
    const canValidateToField = !isEmpty(address);

    this.state = {
      type,
      subType,
      isStream,
      name,
      to: {
        name: toName || address,
        address,
      },
      amount,
      totalAmount: amount,
      amountInputValue: amount ? satoshiToBtcFraction(amount, btcFraction) : '',
      totalTimeInputValue: '',
      error: amount ? this.checkAllAmount(amount, type) : '',
      paymentData,
      canValidateToField,
    };

    if (address && !paymentData) {
      this.props.onToFieldValueChanged(address, type, subType);
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onPressQrCode: this.handlePressQrCode,
      onPressNfc: this.handlePressNfc,
      isNfcSupported: this.props.isNfcSupported,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      nfcScanSuccess: prevNfcScanSuccess,
      toField: { decodedPaymentRequest: prevDecodedPaymentRequest } = {},
    } = prevProps;

    const {
      nfcScanSuccess,
      toField: { value: toFieldValue, decodedPaymentRequest } = {},
      btcFraction,
    } = this.props;

    if (decodedPaymentRequest !== prevDecodedPaymentRequest) {
      if (decodedPaymentRequest) {
        const { type } = this.state;
        const amount = parseInt(decodedPaymentRequest.num_satoshis, 10);
        const { num_satoshis: numSatoshis } = decodedPaymentRequest;
        this.setState({
          type: Types.LIGHTNING,
          subType: Types.REGULAR,
          isStream: false,
          name: decodedPaymentRequest.description,
          to: {
            name: toFieldValue,
            address: decodedPaymentRequest.destination,
          },
          amount,
          totalAmount: amount,
          amountInputValue: String(satoshiToBtcFraction(numSatoshis, btcFraction)),
          paymentData: toFieldValue,
          canValidateToField: true,
          error: this.checkAllAmount(decodedPaymentRequest.num_satoshis, type),
        });
      } else {
        this.setState({ paymentData: undefined });
      }
    }

    if (!prevNfcScanSuccess && nfcScanSuccess) {
      const {
        type, data, amount, name,
      } = nfcScanSuccess;

      this.setState(
        {
          type,
          subType: Types.REGULAR,
          isStream: false,
          name,
          amount,
          totalAmount: amount,
          amountInputValue: String(satoshiToBtcFraction(amount, btcFraction)),
        },
        () => {
          this.props.onToFieldValueChanged(data, Types.LIGHTNING, Types.REGULAR);
        },
      );
    }
  }

  componentWillUnmount() {
    this.props.resetToField();
  }

  onEndEditAmount = () => {
    const { subType } = this.state;
    if (subType === Types.STREAM) {
      this.totalTimeInput.focus();
    }
  };

  getBalance = () => {
    const { type } = this.state;
    const { lightningBalance, bitcoinBalance, btcFraction } = this.props;
    let amount;
    switch (type) {
      case Types.ONCHAIN:
        amount = satoshiToBtcFraction(bitcoinBalance, btcFraction);
        break;
      case Types.LIGHTNING:
        amount = satoshiToBtcFraction(lightningBalance, btcFraction);
        break;
      default:
        amount = 0;
        break;
    }
    return amount;
  };

  checkAllAmount = (amount, type, btcFraction = Types.Satoshi, fieldName = undefined) => {
    const { lightningBalance, bitcoinBalance, maximumPayment } = this.props;
    return checkAmount(
      amount,
      btcFraction,
      false,
      lightningBalance,
      bitcoinBalance,
      maximumPayment,
      type,
      fieldName,
    );
  };

  isDisabledButton = () => {
    const {
      to, amount, isStream, error, totalTime,
    } = this.state;

    const { toField: { error: toFieldError } = {} } = this.props;

    let disabled =
      isNil(to.address) ||
      isEmpty(to.address) ||
      isNil(amount) ||
      isEmpty(amount) ||
      (!isNil(error) && !isEmpty(error)) ||
      (!isNil(toFieldError) && !isEmpty(toFieldError));

    if (isStream) {
      disabled = disabled || !totalTime;
    }

    return disabled;
  };

  handlePressNfc = () => {
    this.props.nfcPaymentRequest();
  };
  handlePressQrCode = () => {
    const { btcFraction } = this.props;
    this.props.navigation.push('PaymentQrCode', {
      onScann: (data, type) => {
        const {
          amount, paymentData, address, name,
        } = data;

        this.props.resetToField();

        const amountInputValue = amount ? String(satoshiToBtcFraction(amount, btcFraction)) : '';
        const error = this.checkAllAmount(amount, type);
        const amountValue = error
          ? '0'
          : convertToSatochiByType(amountInputValue, btcFraction) || '0';
        this.setState({
          type,
          name,
          to: {
            name: address,
            address,
          },
          amount: amountValue,
          totalAmount: amountValue,
          amountInputValue,
          paymentData: paymentData || this.state.paymentData,
          canValidateToField: true,
          error,
        });
      },
    });
  };

  handleChangeAmount = (val) => {
    const { btcFraction } = this.props;

    const { type, isStream, totalTime = 1 } = this.state;
    const amountInputValue = replace(',', '.', val);
    const totalAmount = amountInputValue * totalTime;
    const error = this.checkAllAmount(
      totalAmount,
      type,
      btcFraction,
      isStream ? 'Price per second' : 'Amount',
    );

    const amount = error ? '0' : convertToSatochiByType(amountInputValue, btcFraction) || '0';
    this.setState({
      amountInputValue,
      amount,
      totalAmount: amount * totalTime,
      error,
    });
  };

  handleTotalTime = (val) => {
    const { btcFraction } = this.props;
    const { type, isStream, amountInputValue = '' } = this.state;
    const newAmountInputValue = replace(',', '.', amountInputValue);
    let totalTime;
    let totalAmount;
    let error = checkTimeField(val, 'Time limit');
    if (!error) {
      totalTime = parseInt(val, 10);
      totalAmount = newAmountInputValue * totalTime;
      error = this.checkAllAmount(
        totalAmount,
        type,
        btcFraction,
        isStream ? 'Price per second' : 'Amount',
      );
    }
    this.setState({
      totalTimeInputValue: val,
      totalTime,
      error,
      totalAmount: error ? '0' : convertToSatochiByType(totalAmount, btcFraction) || '0',
    });
  };

  handlePay = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('PaymentData', {
      ...this.state,
    });
  };

  handleType = () => {
    const { navigation } = this.props;
    const {
      type, to, subType, canValidateToField,
    } = this.state;
    navigation.navigate('ItemSelect', {
      title: 'Payment method',
      items: [
        {
          name: getTypeDisplayName(Types.ONCHAIN),
          isSelected: type === Types.ONCHAIN,
          onPress: () => {
            if (canValidateToField) {
              this.props.onToFieldValueChanged(to.address, Types.ONCHAIN, subType);
            }
            this.setState({
              type: Types.ONCHAIN,
              subType: Types.REGULAR,
              isStream: false,
            });
          },
        },
        {
          name: getTypeDisplayName(Types.LIGHTNING),
          isSelected: type === Types.LIGHTNING,
          onPress: () => {
            if (canValidateToField) {
              this.props.onToFieldValueChanged(to.address, Types.LIGHTNING, subType);
            }
            this.setState({
              type: Types.LIGHTNING,
              subType: Types.REGULAR,
              isStream: false,
            });
          },
        },
      ],
    });
  };

  handleSubType = () => {
    const { navigation } = this.props;
    const {
      type, subType, to, canValidateToField,
    } = this.state;
    const toValue = to.address;
    navigation.navigate('ItemSelect', {
      title: 'Payment method',
      items: [
        {
          name: capitalizeFirstLetter(Types.REGULAR),
          isSelected: subType === Types.REGULAR,
          onPress: () => {
            if (canValidateToField) {
              this.props.onToFieldValueChanged(toValue, type, Types.REGULAR);
            }
            this.setState({
              type: Types.LIGHTNING,
              subType: Types.REGULAR,
              isStream: false,
            });
          },
        },
        {
          name: capitalizeFirstLetter(Types.STREAM),
          isSelected: subType === Types.STREAM,
          isLockable: true,
          lockDescription: 'Stream payments are only available in the Extended Mode',
          onPress: () => {
            if (canValidateToField) {
              this.props.onToFieldValueChanged(toValue, type, Types.STREAM);
            }
            this.setState({
              type: Types.LIGHTNING,
              subType: Types.STREAM,
              isStream: true,
            });
          },
        },
      ],
    });
  };

  handleTo = () => {
    const { navigation } = this.props;
    const { subType } = this.state;

    navigation.push('Contacts', {
      onPress: (to) => {
        this.props.onToFieldValueChanged(to.address, Types.LIGHTNING, subType);

        this.setState({ type: Types.LIGHTNING, to });
      },
    });
  };

  handleChangeTo = (name) => {
    const { type, subType } = this.state;

    this.props.onToFieldValueChanged(name, type, subType);
    this.setState({
      to: {
        name,
        address: name,
      },
    });
  };

  render() {
    const {
      btcFraction,
      toField: { error: toFieldError, processing } = {
        processing: false,
      },
      privacyMode,
    } = this.props;

    const {
      type,
      subType,
      isStream,
      canValidateToField,
      totalAmount,
      totalTimeInputValue,
      error,
      amountInputValue,
      name,
      to: { name: toName } = {},
    } = this.state;

    const disabled = this.isDisabledButton();

    const enableFields = !processing;

    let nameInputPlaceholder;
    if (type === Types.LIGHTNING) {
      if (privacyMode === Types.MODE_STANDARD) {
        nameInputPlaceholder = 'Payment request';
      } else if (subType === Types.REGULAR) {
        nameInputPlaceholder = 'Lightning ID / Payment request';
      } else {
        nameInputPlaceholder = 'Lightning ID';
      }
    } else {
      nameInputPlaceholder = 'BTC Address';
    }

    const errorToShow = toFieldError || error;
    const canShowError = (canValidateToField && !isEmpty(toFieldError)) || !isEmpty(error);

    return (
      <KeyboardAvoidingView
        style={styles.screenContainer}
        {...Platform.select({
          ios: {
            behavior: 'padding',
          },
        })}
        keyboardVerticalOffset={Metrics.navBarHeight}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              activeOpacity={Metrics.activeOpacity}
              style={styles.row}
              onPress={this.handleType}
            >
              <Text style={styles.selectize}>{getTypeDisplayName(type)}</Text>
              <View style={styles.balanceContainer}>
                <Text style={[styles.selectize, styles.balanceText]}>
                  {`${this.getBalance()} ${btcFraction}`}
                </Text>
                <Icon name="ios-arrow-forward" size={Metrics.images.small} color={Colors.orange} />
              </View>
            </TouchableOpacity>
            {type === Types.LIGHTNING && (
              <TouchableOpacity
                activeOpacity={Metrics.activeOpacity}
                style={styles.row}
                onPress={this.handleSubType}
              >
                <Text style={styles.selectize}>{capitalizeFirstLetter(subType)}</Text>
                <Icon name="ios-arrow-forward" size={Metrics.images.small} color={Colors.orange} />
              </TouchableOpacity>
            )}
            <TextInput
              onChangeText={txt => this.setState({ name: txt })}
              value={name}
              placeholder="Description"
              autoCorrect={false}
              onSubmitEditing={() => this.nameInput.focus()}
              returnKeyType="next"
            />
            <View style={styles.row}>
              <TextInput
                link={(ref) => {
                  this.nameInput = ref;
                }}
                style={styles.textInput}
                onChangeText={this.handleChangeTo}
                value={toName}
                onSubmitEditing={() => this.amountInput.focus()}
                onBlur={() => this.setState({ canValidateToField: true })}
                placeholder={nameInputPlaceholder}
                autoCorrect={false}
                returnKeyType="next"
              />
              {!processing && type === Types.LIGHTNING && (
                <TouchableOpacity
                  style={styles.addContact}
                  activeOpacity={Metrics.activeOpacity}
                  onPress={this.handleTo}
                >
                  <Image source={Images.addContact} style={styles.addContactImage} />
                </TouchableOpacity>
              )}
              {processing && <ActivityIndicator color={Colors.orange} size="small" />}
            </View>
            <View style={styles.row}>
              <TextInput
                link={(ref) => {
                  this.amountInput = ref;
                }}
                style={styles.textInput}
                onChangeText={this.handleChangeAmount}
                onSubmitEditing={this.onEndEditAmount}
                value={`${amountInputValue}`}
                placeholder={`${isStream ? 'Price per second' : 'Amount'} in ${btcFraction}`}
                autoCorrect={false}
                editable={enableFields}
                keyboardType="numeric"
                returnKeyType={isStream ? 'next' : 'done'}
                disabled={enableFields}
              />
              <AmountUsdText>
                {`$ ${satoshiToUsd(totalAmount, this.props.usdPerBtc)}`}
              </AmountUsdText>
            </View>
            {isStream && (
              <TextInput
                link={(ref) => {
                  this.totalTimeInput = ref;
                }}
                onChangeText={this.handleTotalTime}
                value={totalTimeInputValue}
                placeholder="Time limit in seconds"
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="done"
              />
            )}
          </ScrollView>
          {canShowError && <Text style={styles.errorText}>{errorToShow}</Text>}
          <Button
            disabled={disabled}
            style={styles.button}
            title="PAY"
            onPress={this.handlePay}
            inline={false}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  lightningBalance: state.lightning.balance,
  bitcoinBalance: state.onchain.balance,
  usdPerBtc: state.currencies.usdPerBtc,
  btcFraction: state.ui.btcFraction,
  maximumPayment: LightningSelectors.getMaxPaymentSize(state),
  toField: PaymentCreateScreenSelectors.getToField(state),
  nfcScanSuccess: NfcSelectors.getData(state),
  isNfcSupported: NfcSelectors.isNfcSupported(state),
  privacyMode: AccountSelectors.getPrivacyMode(state),
});

const mapDispatchToProps = dispatch => ({
  onToFieldValueChanged: (value, type, subType) =>
    dispatch(PaymentScreenActions.handleToFieldValueChange(value, type, subType)),
  resetToField: () => dispatch(PaymentScreenActions.resetToField()),
  nfcPaymentRequest: () => dispatch(NfcActions.nfcRequest(false)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentCreateScreen);
