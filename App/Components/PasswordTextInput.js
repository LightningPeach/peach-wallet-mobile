import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TextInput from './TextInput';

import { Metrics, Colors } from '../Themes';

import styles from './Styles/PasswordTextInputStyle';

export default class PasswordTextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      icEye: 'visibility-off',
      password: true,
    };
  }

  changePwdType() {
    let newState;
    if (this.state.password) {
      newState = {
        icEye: 'visibility',
        password: false,
      };
    } else {
      newState = {
        icEye: 'visibility-off',
        password: true,
      };
    }

    // set new state value
    this.setState(newState);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput secureTextEntry={this.state.password} {...this.props} />
        <Icon
          style={styles.icon}
          name={this.state.icEye}
          size={Metrics.icons.icEye}
          color={this.state.password ? Colors.darkGray : Colors.orange}
          onPress={() => this.changePwdType()}
        />
      </View>
    );
  }
}
