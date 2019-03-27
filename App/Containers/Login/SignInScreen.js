import React, { Component } from 'react';
import { isNil, isEmpty } from 'ramda';
import { ScrollView, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box';

import Text from '../../Components/Text';
import TextInput from '../../Components/TextInput';
import PasswordTextInput from '../../Components/PasswordTextInput';
import Button from '../../Components/Button';

import AccountActions, { AccountSelectors } from '../../Redux/AccountRedux';

// Styles
import { Metrics, Colors } from '../../Themes';
import styles from './Styles/SignInScreenStyle';
import { UiSelectors } from '../../Redux/UiRedux';
import { isReallyEmpty } from '../../Services/Utils';
import AppConfig from '../../Config/AppConfig';

class SignInScreen extends Component {
  static navigationOptions = {
    headerTitle: 'SIGN IN',
    headerTitleStyle: styles.headerTitleStyleWithMargin,
    headerBackTitle: null,
  };

  static propTypes = {
    error: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    userName: PropTypes.string,
    signIn: PropTypes.func.isRequired,
    isPolicyAgreed: PropTypes.bool,
    analyticsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    error: null,
    userName: null,
    isPolicyAgreed: false,
    analyticsEnabled: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      showPolicyCheckBox: !props.isPolicyAgreed,
      isPolicyChecked: false,
      isAnalyticsChecked: !!props.analyticsEnabled,
    };
  }

  onSignInTapped() {
    this.props.signIn(this.state.password, this.state.isAnalyticsChecked);
  }

  handlerSignUpButton = () => {
    this.props.navigation.navigate('SignUp');
  };

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

  render() {
    const {
      password, isPolicyChecked, showPolicyCheckBox, isAnalyticsChecked,
    } = this.state;
    const { userName, error, analyticsEnabled } = this.props;
    const showError = !isNil(error) && !isEmpty(error);

    const signInDisabled = (showPolicyCheckBox && !isPolicyChecked) || isReallyEmpty(password);

    const showAnalyticsCheckbox = analyticsEnabled === null;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.section}>
              <TextInput
                value={userName}
                placeholder="Username"
                autoCorrect={false}
                editable={false}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <PasswordTextInput
                link={(ref) => {
                  this.passwordInput = ref;
                }}
                onChangeText={txt => this.setState({ password: txt })}
                value={password}
                placeholder="Password"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
              />
              {showError && <Text style={styles.errorText}>{error}</Text>}
            </View>
            {showPolicyCheckBox && (
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
              disabled={signInDisabled}
              style={styles.section}
              title="SIGN IN"
              onPress={() => this.onSignInTapped()}
              inline={false}
            />
            <TouchableOpacity
              activeOpacity={Metrics.activeOpacity}
              onPress={this.handlerSignUpButton}
            >
              <Text style={styles.signUpText}>Connect to your node</Text>
            </TouchableOpacity>
            <Text style={styles.infoText}>
              To change credentials of your lightning node, click the button `Connect to your node`
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  error: state.account.errorSignIn,
  userName: AccountSelectors.getUserName(state),
  isPolicyAgreed: UiSelectors.isPolicyAgreed(state),
  analyticsEnabled: UiSelectors.isAnalyticsEnabled(state),
});

const mapDispatchToProps = dispatch => ({
  signIn: (password, isAnalyticsEnabled) =>
    dispatch(AccountActions.signInRequest(password, isAnalyticsEnabled)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInScreen);
