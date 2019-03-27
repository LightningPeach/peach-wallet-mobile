import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import Types from '../../Config/Types';
import { debounce } from '../../Services/Utils';
// Styles
import styles from './Styles/PrivacyModeSelectScreenStyle';
import AccountActions, { AccountSelectors } from '../../Redux/AccountRedux';
import { Metrics, Images } from '../../Themes';
import Text from '../../Components/Text';
import { jsDelay } from '../../Services/Delay';

class PrivacyModeSelectScreen extends Component {
  static navigationOptions = ({
    navigation: {
      state: { params: { firstScreen } = {} },
    },
  }) => ({
    headerTitle: 'Choose Privacy Mode',
    headerTitleStyle: firstScreen ? styles.headerTitleStyleWithMargin : styles.headerTitleStyle,
    headerBackTitle: null,
  });

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS().isRequired,
    mode: Types.MODE_PROPS,
    changePrivacyMode: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mode: null,
  };

  constructor(props) {
    super(props);

    this.onChangeMode = debounce(this.onChangeMode);
  }

  onPress = (r, navigation) => {
    r.onPress();
    navigation.dispatch(NavigationActions.back());
  };

  onChangeMode = async (mode) => {
    this.props.changePrivacyMode(mode);
    await jsDelay(100);
    this.props.navigation.goBack();
  };

  render() {
    const { mode } = this.props;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.container}>
          <TouchableOpacity
            activeOpacity={Metrics.activeOpacity}
            style={styles.item}
            onPress={() => this.onChangeMode(Types.MODE_EXTENDED)}
          >
            <Image
              source={Images.extendedMode}
              style={[styles.icon, mode === Types.MODE_EXTENDED ? styles.iconSelected : null]}
            />
            <View style={styles.row}>
              <Text style={[styles.title, mode === Types.MODE_EXTENDED ? styles.selected : null]}>
                EXTENDED MODE
              </Text>
              <View style={styles.flexSpace} />
              {mode === Types.MODE_EXTENDED && <Text style={styles.activeLabel}>Active</Text>}
              <Image
                source={mode === Types.MODE_EXTENDED ? Images.on : Images.off}
                style={styles.radioIcon}
              />
            </View>
            <Text style={styles.description}>
              In this mode you will have a few extra features not yet present in the standard
              Lightning Network. These features rely on the Peach server to route a transaction.
              {'\n\n'}Added in the Extended Mode:{'\n\n'}
              <Image source={Images.ok} /> Stream Payments{'\n'}
              <Image source={Images.ok} /> Payments without an invoice{'\n'}
              <Image source={Images.ok} /> Contacts{'\n'}
            </Text>
            <View style={styles.divider} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={Metrics.activeOpacity}
            style={styles.item}
            onPress={() => this.onChangeMode(Types.MODE_STANDARD)}
          >
            <Image
              source={Images.standardMode}
              style={[styles.icon, mode === Types.MODE_STANDARD ? styles.iconSelected : null]}
            />
            <View style={styles.row}>
              <Text style={[styles.title, mode === Types.MODE_STANDARD ? styles.selected : null]}>
                STANDARD MODE
              </Text>
              <View style={styles.flexSpace} />
              {mode === Types.MODE_STANDARD && <Text style={styles.activeLabel}>Active</Text>}
              <Image
                source={mode === Types.MODE_STANDARD ? Images.on : Images.off}
                style={styles.radioIcon}
              />
            </View>
            <Text style={styles.description}>
              In this mode your wallet will never connect to the Peach server for any reason. The
              Extended Mode features will be disabled.{'\n\n'}
              <Image source={Images.ok} /> No 3rd party servers
              {'\n\n'}
              Disabled in the Standard Mode:{'\n\n'}
              <Image source={Images.okNo} /> Stream Payments{'\n'}
              <Image source={Images.okNo} /> Payments without an invoice{'\n'}
              <Image source={Images.okNo} /> Contacts{'\n'}
            </Text>
            <View style={styles.divider} />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  mode: AccountSelectors.getPrivacyMode(state),
});

const mapDispatchToProps = dispatch => ({
  changePrivacyMode: mode => dispatch(AccountActions.changePrivacyMode(mode)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivacyModeSelectScreen);
