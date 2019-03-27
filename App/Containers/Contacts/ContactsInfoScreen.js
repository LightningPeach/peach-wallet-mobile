import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { isEmpty } from 'ramda';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Text from '../../Components/Text';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';

import Types from '../../Config/Types';

import ContactsActions from '../../Redux/ContactsRedux';
import { showConfirm } from '../../Services/Alert';
import Clipboard from '../../Services/Clipboard';
import { validateContactName, validateLightningId } from '../../Services/Check';

// Styles
import { Images, Metrics } from '../../Themes';
import styles from './Styles/ContactsInfoScreenStyle';

class ContactsInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const nav = {};
    if (navigation.getParam('canUpdate')) {
      nav.headerRight = (
        <TouchableOpacity activeOpacity={Metrics.activeOpacity}>
          <Text style={styles.buttonText} onPress={navigation.getParam('updateContact')}>
            Done
          </Text>
        </TouchableOpacity>
      );
    }
    return nav;
  };

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(Types.CONTACTS_PROPS.isRequired).isRequired,
    removeContact: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      item: this.props.navigation.state.params,
      name: this.props.navigation.state.params.name,
      lightningAddress: this.props.navigation.state.params.address,
      requestSuccess: false,
      nameError: '',
      lightningAddressError: '',
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ updateContact: this.handleUpdateContact });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.requestSuccess && this.state.requestSuccess) {
      this.setState({ requestSuccess: false }, () => {
        this.props.navigation.dispatch(NavigationActions.back());
      });
    }
  }

  onTextChange = (name, type) => {
    this.setState({ [type]: name }, () => {
      this.validate();
    });
  };

  validate = () => {
    const { name, lightningAddress } = this.state;

    const nameError = validateContactName(name);
    const lightningAddressError = validateLightningId(lightningAddress);

    const canUpdate = !nameError && !lightningAddressError;

    this.setState({ nameError, lightningAddressError }, () => {
      this.props.navigation.setParams({ canUpdate });
    });
  };

  handleRemoveContact(item) {
    showConfirm(`Are you sure you want to delete a contact “${item.name}”?`, () => {
      this.setState({ requestSuccess: true }, () => {
        this.props.removeContact(item.id);
      });
    });
  }

  handleUpdateContact = () => {
    this.setState({ requestSuccess: true }, () => {
      this.props.updateContact(this.state.item.id, this.state.name, this.state.lightningAddress);
    });
  };

  render() {
    const {
      item, nameError, lightningAddress, lightningAddressError,
    } = this.state;

    return (
      <View style={styles.screenContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.top}>
            <Image source={Images.userIcon} style={styles.userIcon} />
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
          <View style={styles.buttonsSection}>
            <TouchableOpacity
              activeOpacity={Metrics.activeOpacity}
              onPress={() =>
                this.props.navigation.navigate('PaymentCreate', {
                  toName: item.name,
                  address: lightningAddress,
                })
              }
            >
              <Text style={styles.buttonText}>CREATE PAYMENT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={Metrics.activeOpacity}
              onPress={() => Clipboard.set('Contact lightning id', `${lightningAddress}`)}
            >
              <Text style={styles.buttonText}>COPY ID</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputSection}>
            <TextInput
              onChangeText={text => this.onTextChange(text, 'name')}
              blurOnSubmit
              value={this.state.name}
              placeholder="Name"
              autoCorrect={false}
              returnKeyType="done"
            />
            {!isEmpty(nameError) && <Text style={styles.errorText}>{nameError}</Text>}
            <TextInput
              value={lightningAddress}
              onChangeText={text => this.onTextChange(text, 'lightningAddress')}
              placeholder="Lightning Address"
              multiline
              autoCorrect={false}
              returnKeyType="done"
            />
            {!isEmpty(lightningAddressError) && (
              <Text style={styles.errorText}>{lightningAddressError}</Text>
            )}
          </View>
          <Button
            title="DELETE CONTACT"
            style={styles.buttonStyle}
            textStyle={styles.buttonTextStyle}
            onPress={() => this.handleRemoveContact(item)}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  removeContact: id => dispatch(ContactsActions.contactsRemoveRequest(id)),
  updateContact: (id, name, address) =>
    dispatch(ContactsActions.contactsUpdateRequest(id, name, address)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactsInfoScreen);
