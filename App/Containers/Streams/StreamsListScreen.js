import React, { Component } from 'react';
import { FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import Types from '../../Config/Types';

import HeaderAdd from '../../Components/HeaderAdd';
import EmptyListPlaceholder from '../../Components/EmptyListPlaceholder';
import StreamListRow from '../../Components/StreamListRow';
import { StreamData } from '../../Realm';
import { addRealmCollectionListener } from '../../Realm/Utils';

// Styles
import styles from './Styles/StreamsListScreenStyle';
import { Images, Metrics } from '../../Themes';
import { AccountSelectors } from '../../Redux/AccountRedux';
import Text from '../../Components/Text';
import Button from '../../Components/Button';
import PrivacyModeView from '../../Components/PrivacyModeView';

class StreamsListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const mode = navigation.getParam('privacyMode');
    const isLocked = mode === Types.MODE_STANDARD;
    return {
      headerTitle: (
        <PrivacyModeView style={styles.customHeader} lockStyle={styles.headerLockStyle}>
          <Text style={styles.headerTitleStyle}>Stream payment</Text>
        </PrivacyModeView>
      ),
      headerTitleStyle: styles.headerTitleStyle,
      headerBackTitle: null,
      headerRight: !isLocked ? (
        <HeaderAdd
          onPress={() =>
            navigation.navigate('PaymentCreate', { type: Types.LIGHTNING, subType: Types.STREAM })
          }
        />
      ) : null,
    };
  };

  static propTypes = {
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    navigation: Types.NAVIGATION_PROPS().isRequired,
    privacyMode: Types.MODE_PROPS,
  };

  static defaultProps = {
    privacyMode: null,
  };

  constructor(props) {
    super(props);

    const streams = StreamData.getActiveOnly();
    this.state = {
      streams,
    };
    addRealmCollectionListener(streams, this.streamsUpdateListener);

    const { privacyMode } = this.props;
    this.props.navigation.setParams({
      privacyMode,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.privacyMode !== this.props.privacyMode) {
      this.props.navigation.setParams({ privacyMode: this.props.privacyMode });
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    this.state.streams.removeAllListeners();
  }

  streamsUpdateListener = () => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      updateTimestamp: Date.now(),
    });
  };

  renderEmpty = () => (
    <EmptyListPlaceholder
      imageSource={Images.streamPlaceholder}
      imageStyle={Metrics.icons.streamPlaceholder}
      infoText={`This will display all your ${'\n'}unfinished streams`}
    />
  );

  renderData = btcFraction => (
    <FlatList
      data={this.state.streams}
      extraData={this.state.updateTimestamp}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <StreamListRow
          {...item}
          btcFraction={btcFraction}
          onPress={() => this.props.navigation.navigate('StreamsInfo', { streamId: item.id })}
        />
      )}
      style={styles.section}
    />
  );

  renderStandardState = () => (
    <SafeAreaView style={styles.container}>
      <Image source={Images.streamPlaceholder} style={styles.standardIcon} />
      <Text style={styles.standardText}>Streams are available only in the Extended Mode.</Text>
      <Button
        title="CHANGE PRIVACY MODE"
        style={styles.standardButton}
        onPress={() => this.props.navigation.push('PrivacyModeSelectScreen')}
      />
    </SafeAreaView>
  );

  render() {
    const { btcFraction, privacyMode } = this.props;

    if (privacyMode === Types.MODE_STANDARD) {
      return this.renderStandardState();
    }

    return (
      <SafeAreaView style={styles.screenContainer}>
        {this.state.streams.length > 0 ? this.renderData(btcFraction) : this.renderEmpty()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
  privacyMode: AccountSelectors.getPrivacyMode(state),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StreamsListScreen);
