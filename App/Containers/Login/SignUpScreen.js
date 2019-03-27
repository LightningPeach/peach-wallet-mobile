import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Share, ScrollView, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import { isNil, isEmpty } from 'ramda';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box';
import Menu, {
  MenuProvider,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
} from 'react-native-popup-menu';
import { Events, logEvent } from '../../Services/Analytics';
import AppConfig from '../../Config/AppConfig';
import Text from '../../Components/Text';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import AccountActions from '../../Redux/AccountRedux';
import Types from '../../Config/Types';
import { isReallyEmpty } from '../../Services/Utils';

// Styles
import styles from './Styles/SignUpScreenStyle';
import { Colors, Images } from '../../Themes';
import Metrics from '../../Themes/Metrics';
import { UiSelectors } from '../../Redux/UiRedux';

class SignUpScreen extends Component {
  static navigationOptions = ({
    navigation: {
      state: { params: { firstScreen } = {} },
    },
  }) => ({
    headerTitle: 'CONNECT TO YOUR NODE',
    headerTitleStyle: firstScreen ? styles.headerTitleStyleWithMargin : styles.headerTitleStyle,
  });

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS().isRequired,
    signUp: PropTypes.func.isRequired,
    error: PropTypes.string,
    analyticsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    error: null,
    analyticsEnabled: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...AppConfig.network,
      isAnalyticsChecked: !!props.analyticsEnabled,
    };
  }

  onConnectTapped() {
    this.props.signUp(
      this.state.host,
      this.state.tlcCert,
      this.state.macaroons,
      this.state.isAnalyticsChecked,
    );
  }

  onShare = () => {
    logEvent(Events.DeployLndShare);
    const title = 'HOW TO DEPLOY LND USER GUIDE';
    Share.share(
      { message: AppConfig.guideUrl, title },
      {
        // iOS
        subject: title,
        // Android
        dialogTitle: title,
      },
    );
  };

  onOpen = async () => {
    logEvent(Events.DeployLndOpen);
    const supported = await Linking.canOpenURL(AppConfig.guideUrl);
    if (supported) {
      Linking.openURL(AppConfig.guideUrl);
    }
  };

  handlerScanQrButton = () =>
    this.props.navigation.navigate('SignupQrCode', {
      onScan: (data) => {
        this.setState({ ...data });
      },
    });

  handleOnPolicyAgreed = (agree) => {
    this.setState({
      isPolicyChecked: agree,
    });
  };

  handleOnDataProcessingEnabled = () => {
    this.setState({ isAnalyticsChecked: true });
  };

  handleOnPrivacyPress = () => {
    this.props.navigation.navigate('ProfileLicense', {
      onAgreed: () => this.handleOnPolicyAgreed(true),
      onDataProcessingEnabled: this.handleOnDataProcessingEnabled,
    });
  };

  renderCheckboxTextView = () => (
    <Text style={styles.checkboxText}>
      (Required) I accept the{' '}
      <Text style={styles.linkText} onPress={() => this.handleOnPrivacyPress()}>
        Terms and Privacy Policy (updated on {AppConfig.policyDate})
      </Text>
    </Text>
  );

  renderQrtDescriptionText = () => (
    <Text style={styles.qrDescription}>
      You can generate the auto-fill QR code using the{' '}
      <Text
        style={styles.linkText}
        onPress={async () => {
          try {
            await Linking.openURL(AppConfig.desctopWalletUrl);
          } catch (e) {
            console.log("can't open url", e);
          }
        }}
      >
        desktop Peach wallet
      </Text>{' '}
      or by manually installing a node using a{' '}
      <Text style={styles.linkText} onPress={() => this.googleCloudMenu.open()}>
        Google Cloud setup guide
      </Text>
      .
    </Text>
  );

  render() {
    const {
      isPolicyChecked, host, tlcCert, macaroons, isAnalyticsChecked,
    } = this.state;

    const { error, polycyAgreed, analyticsEnabled } = this.props;
    const showAnalyticsCheckbox = analyticsEnabled === null;
    const showError = !isNil(error) && !isEmpty(error);
    const isConnectButtonDisabled =
      (!polycyAgreed && !isPolicyChecked) ||
      isReallyEmpty(host) ||
      isReallyEmpty(tlcCert) ||
      isReallyEmpty(macaroons);

    return (
      <KeyboardAvoidingView
        style={styles.container}
        {...Platform.select({
          ios: {
            behavior: 'padding',
          },
        })}
        keyboardVerticalOffset={Metrics.navBarHeight}
      >
        <SafeAreaView style={styles.container}>
          <MenuProvider skipInstanceCheck backHandler style={styles.container}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
              <View style={styles.scrollViewContent}>
                <TextInput
                  link={(ref) => {
                    this.hostInput = ref;
                  }}
                  onChangeText={text => this.setState({ host: text.trim() })}
                  onSubmitEditing={() => this.tlcCertInput.focus()}
                  value={host}
                  placeholder="Host"
                  multiline={false}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <TextInput
                  link={(ref) => {
                    this.tlcCertInput = ref;
                  }}
                  extraStyle={styles.multilineTextInput}
                  onChangeText={text => this.setState({ tlcCert: text.trim() })}
                  onEndEditing={() => this.macaroonsInput.focus()}
                  value={tlcCert}
                  placeholder="TLS cert"
                  autoCorrect={false}
                  multiline
                  autoGrow
                  autoCapitalize="none"
                />
                <TextInput
                  link={(ref) => {
                    this.macaroonsInput = ref;
                  }}
                  extraStyle={styles.multilineTextInput}
                  onChangeText={text => this.setState({ macaroons: text.trim() })}
                  value={macaroons}
                  placeholder="Macaroons Hex"
                  autoCorrect={false}
                  multiline
                  autoGrow
                  autoCapitalize="none"
                />
              </View>
            </ScrollView>
            {showError && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.bottomContainer}>
              <Button
                title="SCAN NODE QR TO AUTO-FILL"
                onPress={this.handlerScanQrButton}
                image={Images.buttonQrCode}
                inline
              />
              {this.renderQrtDescriptionText()}
              {!polycyAgreed && (
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    onClick={() => this.handleOnPolicyAgreed(!isPolicyChecked)}
                    isChecked={isPolicyChecked}
                    uncheckedCheckBoxColor={Colors.orange}
                    checkedCheckBoxColor={Colors.orange}
                  />
                  {this.renderCheckboxTextView()}
                </View>
              )}
              {showAnalyticsCheckbox && (
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    onClick={() => this.setState({ isAnalyticsChecked: !isAnalyticsChecked })}
                    isChecked={isAnalyticsChecked}
                    uncheckedCheckBoxColor={Colors.orange}
                    checkedCheckBoxColor={Colors.orange}
                  />
                  <Text style={styles.checkboxText}>
                    (Optional) I agree to anonymized app analytics
                  </Text>
                </View>
              )}
              <Button
                style={styles.connectButton}
                title="CONNECT"
                disabled={isConnectButtonDisabled}
                onPress={() => this.onConnectTapped()}
                inline={false}
              />
              <Menu
                ref={(ref) => {
                  this.googleCloudMenu = ref;
                }}
                renderer={renderers.SlideInMenu}
              >
                <MenuTrigger>
                  <View />
                </MenuTrigger>
                <MenuOptions
                  customStyles={{
                    optionWrapper: styles.popupMenuTextItemWrapper,
                    optionText: styles.popupMenuTextItem,
                  }}
                >
                  <MenuOption onSelect={this.onOpen} text="Open" />
                  <View style={styles.divider} />
                  <MenuOption onSelect={this.onShare} text="Share" />
                </MenuOptions>
              </Menu>
            </View>
          </MenuProvider>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  error: state.account.errorSignUp,
  polycyAgreed: UiSelectors.isPolicyAgreed(state),
  analyticsEnabled: UiSelectors.isAnalyticsEnabled(state),
});

const mapDispatchToProps = dispatch => ({
  signUp: (host, tlcCert, macaroons, isAnalyticsChecked) =>
    dispatch(AccountActions.connectNodeRequest(host, tlcCert, macaroons, isAnalyticsChecked)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpScreen);
