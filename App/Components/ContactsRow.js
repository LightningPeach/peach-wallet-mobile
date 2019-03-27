import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { StackActions } from 'react-navigation';

import Text from '../Components/Text';

import { Metrics } from '../Themes';
import styles from './Styles/ContactsRowStyle';

export default class ContactsRow extends Component {
  // Prop type warnings
  static propTypes = {
    item: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    onPress: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };

  static defaultProps = {
    onPress: undefined,
  };

  render() {
    const { item, navigation, onPress } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={Metrics.activeOpacity}
        style={styles.container}
        onPress={() => {
          if (onPress) {
            onPress(item);
            navigation.dispatch(StackActions.pop());
          } else {
            navigation.navigate('ContactsInfo', { ...item });
          }
        }}
      >
        <Text style={styles.titleTextFirstLetter}>{item.name[0]}</Text>
        <Text style={styles.titleText}>{item.name.slice(1)}</Text>
      </TouchableOpacity>
    );
  }
}
