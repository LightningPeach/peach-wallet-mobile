import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView, View } from 'react-native';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AccountActions from '../../Redux/AccountRedux';

import Button from '../../Components/Button';
import PasswordTextInput from '../../Components/PasswordTextInput';

// Styles
import styles from './Styles/ProfileChangePassScreenStyle';

class ProfileChangePassScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Change password',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    error: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    reqInProgress: PropTypes.bool,
    changePass: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
    reqInProgress: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { reqInProgress, error } = this.props;

    if (prevProps.reqInProgress && !reqInProgress) {
      if (error) {
        this.setState({ error });
      } else {
        this.props.navigation.dispatch(NavigationActions.back());
      }
    }
  }

  onChangeTapped = () => {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    this.props.changePass(oldPassword, newPassword, confirmPassword);
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <View style={styles.section}>
              <PasswordTextInput
                link={(ref) => {
                  this.passwordInput = ref;
                }}
                onChangeText={oldPassword => this.setState({ oldPassword })}
                value={this.state.oldPassword}
                placeholder="Old Password"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <PasswordTextInput
                link={(ref) => {
                  this.newPasswordInput = ref;
                }}
                onChangeText={newPassword => this.setState({ newPassword })}
                value={this.state.newPassword}
                placeholder="New password"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <PasswordTextInput
                link={(ref) => {
                  this.confirmPasswordInput = ref;
                }}
                onChangeText={confirmPassword => this.setState({ confirmPassword })}
                value={this.state.confirmPassword}
                placeholder="Confirm password"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
              />
              {this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
            </View>
            <Button
              style={styles.section}
              title="CHANGE PASSWORD"
              onPress={() => this.onChangeTapped()}
              inline={false}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  error: state.account.changePasswordError,
  reqInProgress: state.account.changePasswordRequest,
});

const mapDispatchToProps = dispatch => ({
  changePass: (oldPassword, newPassword, confirmPassword) => (
    dispatch(AccountActions.changePasswordRequest(oldPassword, newPassword, confirmPassword))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileChangePassScreen);
