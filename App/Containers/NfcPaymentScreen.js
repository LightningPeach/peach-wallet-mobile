import React, { Component } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NfcActions from '../Redux/NfcRedux';
import Types from '../Config/Types';
import BackAwareComponent from '../Components/BackAwareComponent';
import Text from '../Components/Text';

// Styles
import styles from './Styles/NfcPaymentScreenStyle';
import { Images } from '../Themes';

class NfcPaymentScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    ...BackAwareComponent.navigationOptions({ navigation }),
  });

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS().isRequired,
    cancelNfc: PropTypes.func.isRequired,
  };

  goBack = () => {
    this.props.cancelNfc();
    this.props.navigation.goBack();
  };

  render() {
    return (
      <BackAwareComponent showCrossIcon goBack={this.goBack}>
        <SafeAreaView style={styles.contentContainer}>
          <Image style={styles.image} source={Images.nfcLarge} />
          <Text style={styles.textTitle}>HOLD NEAR READER</Text>
        </SafeAreaView>
      </BackAwareComponent>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  cancelNfc: () => dispatch(NfcActions.nfcCancelRequest()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NfcPaymentScreen);
