import React, { Component } from 'react';
import { View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { equals, isEmpty } from 'ramda';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import Text from '../../Components/Text';
import Types from '../../Config/Types';
import Search from '../../Components/Search';
import HeaderAdd from '../../Components/HeaderAdd';
import ChannelsRow from '../../Components/ChannelsRow';

import { ChannelsSelectors } from '../../Redux/ChannelsRedux';

import { findChannelByName } from '../../Services/Search';

// Styles
import { Colors, Images, Metrics } from '../../Themes';
import styles from './Styles/ChannelsScreenStyle';

class ChannelsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const options = {
      title: 'CHANNELS',
      headerBackTitle: null,
      headerRight: <HeaderAdd onPress={() => navigation.navigate('ChannelsNew')} />,
    };

    if (navigation.getParam('hideHeader')) {
      options.header = null;
    }

    return options;
  };

  static propTypes = {
    channels: PropTypes.arrayOf(Types.CHANNEL_PROPS.isRequired).isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.channelsInterval = 0;
    this.state = {
      channels: props.channels,
      showSearchShadow: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (!equals(prevProps.channels, this.props.channels)) {
      this.setState({ channels: this.props.channels });
    }
  }

  componentWillUnmount() {
    clearInterval(this.channelsInterval);
  }

  handleSearch = (name) => {
    if (isEmpty(name)) {
      this.setState({ showSearchShadow: true, channels: this.props.channels });
    } else {
      const channels = findChannelByName(name, this.props.channels);
      this.setState({ showSearchShadow: false, channels });
    }
  };

  headleOnFocus = () => {
    this.setState({ showSearchShadow: true }, () => {
      this.props.navigation.setParams({ hideHeader: true });
    });
  };

  headleOnEndSearch = () => {
    this.setState({ showSearchShadow: false }, () => {
      this.props.navigation.setParams({ hideHeader: false });
    });
  };

  renderEmpty = () => (
    <View style={styles.placeholderContainer}>
      <Image source={Images.channelsPlaceholder} style={styles.emptyChannels} />
      <Text style={styles.placeholderText}>This will display all your channels</Text>
    </View>
  );

  renderEmptySearch = () => (
    <View style={styles.placeholderContainer}>
      <Icon name="ios-search" size={Metrics.icons.searchPlaceholder} color={Colors.darkGray} />
      <Text style={styles.placeholderText}>No results found</Text>
    </View>
  );

  renderChannels = () => {
    const { channels } = this.state;
    const { btcFraction } = this.props;

    if (isEmpty(channels)) {
      return this.renderEmptySearch();
    }
    return (
      <FlatList
        ref={(list) => {
          this.list = list;
        }}
        data={channels}
        keyExtractor={item => item.channel_point}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <ChannelsRow item={item} navigation={this.props.navigation} btcFraction={btcFraction} />
        )}
        ListFooterComponent={() => <View style={styles.separator} />}
        style={styles.listContainer}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.searchContainer}>
          <Search
            onChangeText={this.handleSearch}
            onFocus={this.headleOnFocus}
            onEndSearch={this.headleOnEndSearch}
            style={styles.search}
          />
        </View>
        <View style={styles.container}>
          {isEmpty(this.props.channels) ? this.renderEmpty() : this.renderChannels()}
          {this.state.showSearchShadow && <View style={styles.searchShadow} />}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
  channels: ChannelsSelectors.getChannels(state),
  isConnected: state.network.isConnected,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelsScreen);
