import React, { Component } from 'react';
import { Linking, Image, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';

import Types from '../../Config/Types';
import { version } from '../../../package.json';
import Text from '../../Components/Text';
import Button from '../../Components/Button';
import ProfileAddress from '../../Components/ProfileAddress';
import ProfileButton from '../../Components/ProfileButton';
import OnchainActions from '../../Redux/OnchainRedux';
import Clipboard from '../../Services/Clipboard';
import AccountActions, { AccountSelectors } from '../../Redux/AccountRedux';
import UiActions, { UiSelectors } from '../../Redux/UiRedux';
import AppConfig from '../../Config/AppConfig';
import { showError } from '../../Services/InformBox';
import Errors from '../../Config/Errors';
import { Events, logEvent } from '../../Services/Analytics';

// Styles
import { isIOS, Images, Metrics } from '../../Themes';
import styles from './Styles/ProfileScreenStyle';

class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'PROFILE',
    headerBackTitle: null,
    headerRight: <View />,
  };

  static propTypes = {
    btcAddress: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    lightningAddress: PropTypes.string,
    newBtcAddress: PropTypes.func.isRequired,
    isEnableBackgroundService: PropTypes.bool.isRequired,
    enableBackgroundService: PropTypes.func.isRequired,
    privacyMode: Types.MODE_PROPS,
    analyticsEnabled: PropTypes.bool,
    enableAnalytics: PropTypes.func.isRequired,
  };

  static defaultProps = {
    btcAddress: null,
    lightningAddress: null,
    privacyMode: null,
    analyticsEnabled: false,
  };

  onConnectNode = () => {
    this.props.navigation.navigate('SignUp');
  };

  onAppAnalyticsChange = () => {
    const { analyticsEnabled, enableAnalytics } = this.props;
    this.props.navigation.navigate('ItemSelect', {
      title: 'App Analytics',
      description:
        'We use Firebase Analytics to optionally collect anonymized data on how people use the wallet. ' +
        'This data helps us improve the user experience of the app. By default, this setting is disabled.',
      radioButton: true,
      items: [
        {
          name: 'Enable',
          isSelected: analyticsEnabled,
          onPress: () => {
            enableAnalytics(true);
          },
        },
        {
          name: 'Disable',
          isSelected: !analyticsEnabled,
          onPress: () => {
            enableAnalytics(false);
          },
        },
      ],
    });
  };

  onBackgroundModeChange = () => {
    const { isEnableBackgroundService, enableBackgroundService } = this.props;
    this.props.navigation.navigate('ItemSelect', {
      title: 'Background mode',
      description:
        'You may receive payments and continue sending stream payments when the background mode is enabled.',
      radioButton: true,
      items: [
        {
          name: 'Enable',
          isSelected: isEnableBackgroundService,
          onPress: () => {
            enableBackgroundService(true);
          },
        },
        {
          name: 'Disable',
          isSelected: !isEnableBackgroundService,
          onPress: () => {
            enableBackgroundService(false);
          },
        },
      ],
    });
  };

  render() {
    const {
      btcAddress,
      lightningAddress,
      newBtcAddress,
      navigation,
      isEnableBackgroundService,
      privacyMode,
      analyticsEnabled,
    } = this.props;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.addressSection}>
            <ProfileAddress
              type={Types.ONCHAIN}
              token={btcAddress}
              actions={[
                <ProfileButton
                  onPress={newBtcAddress}
                  icon={Images.newIcon}
                  text="new address"
                  key="newId"
                />,
                <ProfileButton
                  onPress={() => {
                    logEvent(Events.ProfileBtcAddressCopy);
                    Clipboard.set('BTC Address', btcAddress);
                  }}
                  icon={Images.copyIcon}
                  text="copy"
                  key="copy"
                />,
              ]}
            />
            {isIOS && <View style={styles.addressSeparator} />}
            <ProfileAddress
              type={Types.LIGHTNING}
              token={lightningAddress}
              actions={
                <ProfileButton
                  onPress={() => {
                    logEvent(Events.ProfileLightningIdCopy);
                    Clipboard.set('Lightning id', lightningAddress);
                  }}
                  icon={Images.copyIcon}
                  text="copy"
                />
              }
            />
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionsRowBase, styles.actionsRowBorderBottom]}
              activeOpacity={Metrics.activeOpacity}
              onPress={() => navigation.navigate('PaymentRequest')}
            >
              <Text style={styles.normal}>Payment request</Text>
              <Image source={Images.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionsRowBase, styles.actionsRowBorderBottom]}
              activeOpacity={Metrics.activeOpacity}
              onPress={() => navigation.navigate('ProfileCurrency')}
            >
              <Text style={styles.normal}>Change unit</Text>
              <Image source={Images.arrowIcon} />
            </TouchableOpacity>
            {privacyMode !== Types.MODE_STANDARD && Platform.OS === 'android' && (
              <TouchableOpacity
                style={[styles.actionsRowWithValueBase, styles.actionsRowBorderBottom]}
                activeOpacity={Metrics.activeOpacity}
                onPress={this.onBackgroundModeChange}
              >
                <Text style={styles.normal}>Background mode</Text>
                <View style={styles.flexSpace} />
                <Text style={styles.actionValue}>
                  {isEnableBackgroundService ? 'Enabled' : 'Disabled'}
                </Text>
                <Image source={Images.arrowIcon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionsRowBase, styles.actionsRowBorderBottom]}
              activeOpacity={Metrics.activeOpacity}
              onPress={() => navigation.navigate('ChangePinScreen')}
            >
              <Text style={styles.normal}>Change PIN</Text>
              <Image source={Images.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionsRowWithValueBase, styles.actionsRowBorderBottom]}
              activeOpacity={Metrics.activeOpacity}
              onPress={() => navigation.navigate('PrivacyModeSelectScreen')}
            >
              <Text style={styles.normal}>Privacy Mode</Text>
              <View style={styles.flexSpace} />
              <Text style={styles.actionValue}>
                {privacyMode === Types.MODE_EXTENDED ? 'Extended' : 'Standard'}
              </Text>
              <Image source={Images.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionsRowWithValueBase, styles.actionsRowBorderBottom]}
              activeOpacity={Metrics.activeOpacity}
              onPress={this.onAppAnalyticsChange}
            >
              <Text style={styles.normal}>App Analytics</Text>
              <View style={styles.flexSpace} />
              <Text style={styles.actionValue}>{analyticsEnabled ? 'Enabled' : 'Disabled'}</Text>
              <Image source={Images.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionsRowBase, styles.actionsRowBorderBottom]}
              activeOpacity={Metrics.activeOpacity}
              onPress={() => navigation.navigate('ProfileLicense')}
            >
              <Text style={styles.normal}>Terms and Privacy Policy</Text>
              <Image source={Images.arrowIcon} />
            </TouchableOpacity>
          </View>
          <Button
            title="SWITCH TO ANOTHER NODE"
            style={styles.connectButtonStyle}
            onPress={this.onConnectNode}
          />

          <View style={styles.footerSection}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await Linking.openURL(`mailto:${AppConfig.supportEmail}`);
                } catch (error) {
                  showError(Errors.EXCEPTION_CANT_SEND_EMAIL);
                }
              }}
            >
              <Text style={styles.contactText}>{AppConfig.supportEmail}</Text>
            </TouchableOpacity>
            <Text style={styles.base}>v {version}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcAddress: state.onchain.address,
  lightningAddress: state.lightning.pubkeyId,
  isEnableBackgroundService: UiSelectors.isEnableBackgroundService(state),
  privacyMode: AccountSelectors.getPrivacyMode(state),
  analyticsEnabled: UiSelectors.isAnalyticsEnabled(state),
});

const mapDispatchToProps = dispatch => ({
  newBtcAddress: () => {
    logEvent(Events.ProfileBtcAddressRenew);
    dispatch(OnchainActions.newAddressRequest());
  },
  logout: () => {
    logEvent(Events.ProfileSignout);
    dispatch(AccountActions.signOutRequest());
  },
  enableBackgroundService: (enable) => {
    logEvent(Events.ProfileEnableBackgroundService, { enable });
    dispatch(UiActions.enableBackgroundService(enable));
  },
  enableAnalytics: enable => dispatch(UiActions.enableAnalytics(enable)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
