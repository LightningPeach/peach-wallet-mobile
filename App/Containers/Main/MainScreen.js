import React, { Component } from 'react';
import { isNil } from 'ramda';
import { Image, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';

import Text from '../../Components/Text';
import Types from '../../Config/Types';
import Wallet from '../../Components/Wallet';
import Widget from '../../Components/Widget';

import NfcActions, { NfcSelectors } from '../../Redux/NfcRedux';
import { AccountSelectors } from '../../Redux/AccountRedux';
import { fromScreen } from '../../Navigation/Utils';
import { satoshiToUsd } from '../../Transforms/currencies';

// Styles
import { Images, Metrics } from '../../Themes';
import styles from './Styles/MainScreenStyle';

class MainScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const mode = navigation.getParam('privacyMode');
    return {
      headerTitle: (
        <View style={styles.header}>
          <Image source={Images.peachLogoSmall} style={Metrics.icons.logo} />
          <Text style={styles.headerText}>WALLET</Text>
          {mode && (
            <Image
              source={mode === Types.MODE_EXTENDED ? Images.extendedMain : Images.standardMain}
              style={styles.modeIcon}
            />
          )}
        </View>
      ),
    };
  };

  static propTypes = {
    usdPerBtc: Types.FLOAT_NUMBER_PROPS,

    lightningId: PropTypes.string,
    lightningBalance: Types.FLOAT_NUMBER_PROPS,

    bitcoinId: PropTypes.string,
    bitcoinBalance: Types.FLOAT_NUMBER_PROPS,
    unconfirmedBitcoinBalance: Types.FLOAT_NUMBER_PROPS,

    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,

    navigation: PropTypes.object.isRequired,

    isNfcSupported: PropTypes.bool,
    nfcPaymentRequest: PropTypes.func.isRequired,
    isSynced: PropTypes.bool,
    syncProgress: Types.FLOAT_NUMBER_PROPS,
    privacyMode: Types.MODE_PROPS,
  };

  static defaultProps = {
    usdPerBtc: '0',
    lightningBalance: '0',
    bitcoinBalance: '0',
    unconfirmedBitcoinBalance: '0',
    lightningId: null,
    bitcoinId: null,
    isNfcSupported: null,
    isSynced: false,
    syncProgress: '0',
    privacyMode: null,
  };

  constructor(props) {
    super(props);

    this.balanceInterval = 0;
    const { privacyMode } = this.props;
    this.props.navigation.setParams({
      privacyMode,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.privacyMode !== this.props.privacyMode) {
      this.props.navigation.setParams({ privacyMode: this.props.privacyMode });
    }
  }

  render() {
    const {
      usdPerBtc,
      lightningId,
      bitcoinId,
      lightningBalance,
      bitcoinBalance,
      unconfirmedBitcoinBalance,
      btcFraction,
      navigation,
      isNfcSupported,
      nfcPaymentRequest,
      isSynced,
      syncProgress,
    } = this.props;

    const syncPercents = `${(syncProgress * 100).toFixed(0)}%`;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <View style={[styles.horizontalContainer, styles.contentMargins]}>
              {!isSynced && (
                <View style={styles.percentContainer}>
                  <Image source={Images.synchronization} />
                  <Text style={styles.percentText}>{syncPercents}</Text>
                </View>
              )}
              <Text style={styles.btcCurrentText}>1BTC ~ ${usdPerBtc}</Text>
            </View>
            <Wallet
              name="LIGHTNING"
              style={styles.contentMargins}
              icon={Images.lightningIcon}
              id={lightningId}
              balanceSatoshi={lightningBalance}
              usdPerBtc={usdPerBtc}
              onPress={() =>
                navigation.navigate(fromScreen('Main', 'PaymentHistory', {
                    name: 'LIGHTNING',
                    id: lightningId,
                    balanceSatoshi: lightningBalance,
                    balanceUSD: satoshiToUsd(lightningBalance, usdPerBtc),
                    type: Types.LIGHTNING,
                  }))
              }
              btcFraction={btcFraction}
            />
            <Wallet
              name="ON-CHAIN"
              icon={Images.bitcoinIcon}
              id={bitcoinId}
              style={styles.contentMargins}
              balanceSatoshi={bitcoinBalance}
              unconfirmedBalanceSatoshi={unconfirmedBitcoinBalance}
              usdPerBtc={usdPerBtc}
              onPress={() =>
                navigation.navigate(fromScreen('Main', 'PaymentHistory', {
                    name: 'ON-CHAIN',
                    id: bitcoinId,
                    balanceSatoshi: bitcoinBalance,
                    balanceUSD: satoshiToUsd(bitcoinBalance, usdPerBtc),
                    type: Types.ONCHAIN,
                  }))
              }
              btcFraction={btcFraction}
            />
            <View style={styles.widgetsSection}>
              <Widget
                name="Pay"
                icon={Images.walletIcon}
                iconStyle={styles.walletIcon}
                onPress={() =>
                  navigation.navigate(fromScreen('Main', 'PaymentCreate', {
                      type: Types.LIGHTNING,
                      subType: Types.REGULAR,
                    }))
                }
              />
              {!isNil(isNfcSupported) && isNfcSupported && (
                <Widget
                  name="NFC"
                  icon={Images.nfcPayment}
                  iconStyle={styles.nfcPaymentIcon}
                  onPress={nfcPaymentRequest}
                />
              )}
              <Widget
                name="QR"
                icon={Images.qrIcon}
                iconStyle={styles.qrIcon}
                onPress={() => navigation.navigate(fromScreen('Main', 'PaymentQrCode'))}
              />
              <Widget
                name="Open Channel"
                icon={Images.createChannelIcon}
                iconStyle={styles.createChanelIcon}
                onPress={() => navigation.navigate(fromScreen('Main', 'ChannelsNew'))}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  usdPerBtc: state.currencies.usdPerBtc,
  lightningId: state.lightning.pubkeyId,
  lightningBalance: state.lightning.balance,
  bitcoinId: state.onchain.address,
  bitcoinBalance: state.onchain.balance,
  unconfirmedBitcoinBalance: state.onchain.unconfirmedBalance,
  btcFraction: state.ui.btcFraction,
  isConnected: state.network.isConnected,
  isNfcSupported: NfcSelectors.isNfcSupported(state),
  isTestnet: AccountSelectors.isTestnet(state),
  isSynced: AccountSelectors.isSynced(state),
  syncProgress: AccountSelectors.getSyncProgress(state),
  privacyMode: AccountSelectors.getPrivacyMode(state),
});

const mapDispatchToProps = dispatch => ({
  nfcPaymentRequest: () => dispatch(NfcActions.nfcRequest(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
