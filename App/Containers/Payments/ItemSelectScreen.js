import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import RowCheckmark from '../../Components/RowCheckmark';
import Types from '../../Config/Types';
import { debounce } from '../../Services/Utils';
// Styles
import styles from './Styles/ItemSelectScreenStyle';
import { AccountSelectors } from '../../Redux/AccountRedux';
import Text from '../../Components/Text';

class ItemSelectScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title'),
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  });

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      radioButton: PropTypes.bool,
      items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        isSelected: PropTypes.bool,
        onPress: PropTypes.func.isRequired,
        lockDescription: PropTypes.string,
        isLockable: PropTypes.bool,
      })),
    })).isRequired,
    privacyMode: Types.MODE_PROPS,
  };

  static defaultProps = {
    privacyMode: null,
  };

  constructor(props) {
    super(props);

    this.onPress = debounce(this.onPress);
    this.state = {
      rows: props.navigation.getParam('items'),
      radioButton: props.navigation.getParam('radioButton', false),
      description: props.navigation.getParam('description'),
    };
  }

  onPress = (r, navigation) => {
    r.onPress();
    navigation.dispatch(NavigationActions.back());
  };

  render() {
    const { navigation, privacyMode } = this.props;
    const { rows, radioButton, description } = this.state;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.section}>
          {description && <Text style={styles.description}>{description}</Text>}
          {rows.map(r => (
            <RowCheckmark
              navigation={this.props.navigation}
              key={r.name}
              name={r.name}
              radioButton={radioButton}
              isSelected={r.isSelected}
              isLocked={r.isLockable && privacyMode === Types.MODE_STANDARD}
              lockDescription={r.lockDescription}
              onPress={() => this.onPress(r, navigation)}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  privacyMode: AccountSelectors.getPrivacyMode(state),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemSelectScreen);
