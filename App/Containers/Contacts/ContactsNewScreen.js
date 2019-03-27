import React, { Component } from 'react';
import { Keyboard, View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';

import ContactsActions from '../../Redux/ContactsRedux';
import { validateContactName, validateLightningId } from '../../Services/Check';

// Styles
import styles from './Styles/ContactsNewScreenStyle';

class ContactsNewScreen extends Component {
  static navigationOptions = {
    headerTitle: 'New contact',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    addContacts: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      lightningAddress: '',
      addSuccess: false,
      canShowNameError: false,
      canShowAddressError: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.addSuccess && this.state.addSuccess) {
      this.setState({ addSuccess: false }, () => {
        this.props.navigation.dispatch(NavigationActions.back());
      });
    }
  }

  handleAddContacts = () => {
    const { name, lightningAddress } = this.state;

    const nameError = validateContactName(name);
    const lightningAddressError = validateLightningId(lightningAddress);

    if (nameError || lightningAddressError) {
      this.setState({
        canShowNameError: true,
        canShowAddressError: true,
      });
      return;
    }

    Keyboard.dismiss();
    this.setState({ addSuccess: true }, () => {
      this.props.addContacts(name, lightningAddress);
    });
  };

  render() {
    const {
      name, lightningAddress, canShowNameError, canShowAddressError,
    } = this.state;

    const nameError = validateContactName(name);
    const addressError = validateLightningId(lightningAddress);
    const showNameError = !isNil(nameError) && canShowNameError;
    const showAddressError = !isNil(addressError) && canShowAddressError;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.section}>
            <TextInput
              onChangeText={value => this.setState({ name: value })}
              onSubmitEditing={() => this.lightningAddressInput.focus()}
              value={name}
              placeholder="Name"
              autoCorrect={false}
              onBlur={() => this.setState({ canShowNameError: true })}
              returnKeyType="next"
            />
            {showNameError && <Text style={styles.errorText}>{nameError}</Text>}
            <TextInput
              link={(ref) => {
                this.lightningAddressInput = ref;
              }}
              onChangeText={value => this.setState({ lightningAddress: value })}
              onBlur={() => this.setState({ canShowAddressError: true })}
              value={lightningAddress}
              placeholder="Lightning Address"
              autoCorrect={false}
              multiline
              blurOnSubmit
              autoCapitalize="none"
              returnKeyType="done"
            />
            {showAddressError && <Text style={styles.errorText}>{addressError}</Text>}
            <Button
              style={styles.createButton}
              disabled={!!nameError}
              title="CREATE"
              onPress={this.handleAddContacts}
              inline={false}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  addContacts: (name, address) => dispatch(ContactsActions.contactsAddRequest(name, address)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactsNewScreen);
