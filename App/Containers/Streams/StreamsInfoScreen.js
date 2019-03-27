import React, { Component } from 'react';
import { path } from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import StreamsActions from '../../Redux/StreamsRedux';
import { StreamData } from '../../Realm';

import { showConfirm } from '../../Services/Alert';
import { getInfoButtonsName, getInfoColor, getInfoText, getStopText } from '../../Services/Streams';
import { Events, logEvent } from '../../Services/Analytics';

import Types from '../../Config/Types';
import Text from '../../Components/Text';
import Button from '../../Components/Button';
import { debounce } from '../../Services/Utils';
import { addRealmCollectionListener } from '../../Realm/Utils';

// Styles
import { isIOS, Colors, Metrics } from '../../Themes';
import styles from './Styles/StreamsInfoScreenStyle';

class StreamsInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: null,
    headerBackTitle: null,
    headerLeft: (
      <TouchableOpacity
        activeOpacity={Metrics.activeOpacity}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      >
        <Text style={styles.closeIcon}>
          <Icon
            name="ios-close"
            size={Metrics.icons.close}
            color={isIOS ? Colors.lightGray : Colors.orange}
          />
        </Text>
      </TouchableOpacity>
    ),
  });

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(PropTypes.shape({ streamId: PropTypes.string.isRequired }))
      .isRequired,
    stopStream: PropTypes.func.isRequired,
    pauseStream: PropTypes.func.isRequired,
    startStream: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleStart = debounce(this.handleStart);

    const streamId = path(['navigation', 'state', 'params', 'streamId'], props);
    this.streamSingleList = StreamData.getSingleList(streamId);

    const stream = this.streamSingleList[0];
    this.state = {
      stream,
      previousStreamStatus: stream.status,
    };

    this.didFocus = props.navigation.addListener('didFocus', () =>
      addRealmCollectionListener(this.streamSingleList, this.onStreamUpdateListener));
  }

  componentDidMount() {
    this.willBlur = this.props.navigation.addListener('willBlur', () =>
      this.streamSingleList.removeAllListeners());
  }

  componentWillUnmount() {
    this.didFocus.remove();
    this.willBlur.remove();
  }

  onStreamUpdateListener = () => {
    const { stream, previousStreamStatus } = this.state;
    if (stream.status === Types.STREAM_ERROR && previousStreamStatus !== Types.STREAM_ERROR) {
      this.props.navigation.push('StreamsError', { streamId: stream.id });
    } else if (stream.status === Types.STREAM_END && previousStreamStatus !== Types.STREAM_END) {
      if (previousStreamStatus === Types.STREAM_NEW) {
        this.props.navigation.goBack();
      } else {
        this.props.navigation.navigate('StreamsEnd', { streamId: stream.id });
      }
    }
    this.setState({ previousStreamStatus: stream.status });
  };

  handleStart = () => {
    const { stream } = this.state;
    if (stream.status === Types.STREAM_RUN) {
      logEvent(Events.StreamInfoPauseStream);
      this.props.pauseStream(stream.id);
    } else {
      logEvent(Events.StreamInfoStartStream);
      this.props.startStream(stream.id);
    }
  };

  handleStop = () => {
    const { stream } = this.state;
    if (stream.status === Types.STREAM_RUN) {
      this.props.pauseStream(stream.id);
    }

    showConfirm(getStopText(stream.status), () => {
      logEvent(Events.StreamInfoStopStream);
      this.props.stopStream(stream.id);
    });
  };

  render() {
    const { stream } = this.state;
    const buttonText = getInfoButtonsName(stream.status);
    const infoTextColor = getInfoColor(stream.status);
    const duration = moment.duration(stream.secToPay, 'seconds');
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={[styles.timeText, infoTextColor]}>
            {moment.utc(duration.as('milliseconds')).format('HH:mm:ss')}
          </Text>
          <Text style={[styles.statusText, infoTextColor]}>
            {getInfoText(stream.status, stream.name)}
          </Text>
          <Button
            style={styles.button}
            title={buttonText.start}
            onPress={this.handleStart}
            inline={false}
          />
          <Button
            style={[styles.button, styles.redButton]}
            textStyle={styles.redButtonText}
            title={buttonText.end}
            onPress={this.handleStop}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  startStream: id => dispatch(StreamsActions.updateStatusRequest(id, Types.STREAM_RUN)),
  stopStream: id => dispatch(StreamsActions.updateStatusRequest(id, Types.STREAM_END)),
  pauseStream: id => dispatch(StreamsActions.updateStatusRequest(id, Types.STREAM_PAUSE)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StreamsInfoScreen);
