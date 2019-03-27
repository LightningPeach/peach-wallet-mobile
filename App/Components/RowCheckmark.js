import React, { Component } from 'react';
import { split, reduce, addIndex } from 'ramda';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View } from 'react-native';
import { Metrics, Images } from '../Themes';
import styles from './Styles/RowCheckmarkStyle';

import Text from '../Components/Text';

const reduceIndexed = addIndex(reduce);

export default class RowCheckmark extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    isLocked: PropTypes.bool,
    lockDescription: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    radioButton: PropTypes.bool,
  };

  static defaultProps = {
    isSelected: false,
    isLocked: false,
    lockDescription: null,
    radioButton: false,
  };

  renderCheckMark = () => {
    const { isSelected, radioButton } = this.props;
    if (radioButton) {
      return <Image source={isSelected ? Images.on : Images.off} style={styles.checkMark} />;
    }

    return isSelected ? <Image source={Images.checkMarkIcon} /> : null;
  };

  render() {
    const {
      isSelected, name, onPress, isLocked, lockDescription,
    } = this.props;
    const style = [styles.text];
    if (isSelected) {
      style.push(styles.active);
    }

    if (isLocked) {
      const descArray = reduceIndexed(
        (acc, element, i, all) => {
          if (i === all.length - 1) {
            return [...acc, element];
          }

          return [
            ...acc,
            element,
            <Text
              key={i}
              style={styles.profileText}
              onPress={() => this.props.navigation.navigate('PrivacyModeSelectScreen')}
            >
              Extended Mode
            </Text>,
          ];
        },
        [],
        split('Extended Mode', lockDescription),
      );

      return (
        <View style={styles.lockedContainer}>
          <View style={styles.lockedRow}>
            <Text style={style}>{name}</Text>
            <Image source={Images.lock} style={styles.lockIcon} />
          </View>
          <Text style={styles.description}>{descArray}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity activeOpacity={Metrics.activeOpacity} style={styles.row} onPress={onPress}>
        <Text style={[style, styles.flex]}>{name}</Text>
        {this.renderCheckMark()}
      </TouchableOpacity>
    );
  }
}
