import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import styles from './Styles/ProfileAddressStyle';
import { getIcon } from '../Services/Profile';
import Text from '../Components/Text';

export default class ProfileAddress extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    token: PropTypes.string,
    actions: PropTypes.oneOfType([
      PropTypes.node.isRequired,
      PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
    ]).isRequired,
  };

  static defaultProps = {
    token: '',
  };

  render() {
    const { actions } = this.props;
    const actionContainerClass = [styles.actionsContainer];
    if (!Array.isArray(actions) || actions.length <= 1) {
      actionContainerClass.push(styles.actionsContainerSingle);
    }
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Image source={getIcon(this.props.type)} style={styles.image} />
          <Text style={styles.text}>{this.props.token}</Text>
        </View>
        <View style={actionContainerClass}>
          {this.props.actions}
        </View>
      </View>
    );
  }
}
