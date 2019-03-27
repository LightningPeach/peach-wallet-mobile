import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import RowCheckmark from '../../Components/RowCheckmark';
import UiActions from '../../Redux/UiRedux';
import Types from '../../Config/Types';

// Styles
import styles from './Styles/ProfileCurrencyScreenStyle';

class ProfileCurrencyScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Change unit',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS().isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    updateBtcFraction: PropTypes.func.isRequired,
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.section}>
          {Types.BTC_FRACTION_VALUES.map(c => (
            <RowCheckmark
              navigation={this.props.navigation}
              key={c}
              name={c}
              isSelected={this.props.btcFraction === c}
              onPress={() => this.props.updateBtcFraction(c)}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
});

const mapDispatchToProps = dispatch => ({
  updateBtcFraction: value => dispatch(UiActions.updateBtcFraction(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileCurrencyScreen);
