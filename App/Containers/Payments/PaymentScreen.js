import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SectionList, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { equals, last } from 'ramda';

import Text from '../../Components/Text';

import PrivacyModeView from '../../Components/PrivacyModeView';

import PaymentHistoryRow from '../../Components/PaymentHistoryRow';
import LightningActions, { LightningSelectors } from '../../Redux/LightningRedux';
import OnchainActions, { OnchainSelectors } from '../../Redux/OnchainRedux';
import { UiSelectors } from '../../Redux/UiRedux';

import Types from '../../Config/Types';
import { getHistoryRightAction } from '../../Services/Payment';
import { capitalizeFirstLetter } from '../../Transforms/capitalizeFirstLetter';
import { satoshiToBtcFraction } from '../../Transforms/currencies';
// Styles
import { Metrics, Images } from '../../Themes';
import styles from './Styles/PaymentScreenStyle';

class PaymentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { name } = navigation.state.params;

    return {
      title: `${capitalizeFirstLetter(name)} payment`,
      headerBackTitle: null,
      headerTitleStyle: styles.headerTitleStyle,
    };
  };

  static propTypes = {
    lightningHistory: PropTypes.array,
    onchainHistory: PropTypes.array,
    navigation: PropTypes.object.isRequired,
    getLightningHistory: PropTypes.func.isRequired,
    getOnchainHistory: PropTypes.func.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    getLightningBalance: PropTypes.func.isRequired,
    getBitcoinBalance: PropTypes.func.isRequired,
    isLoadingMoreHistory: PropTypes.bool.isRequired,
    canLoadMoreLightningHistory: PropTypes.bool.isRequired,
    loadMoreLightningHistory: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lightningHistory: [],
    onchainHistory: [],
  };

  constructor(props) {
    super(props);

    const { type } = props.navigation.state.params;
    const data = type === Types.LIGHTNING ? props.lightningHistory : props.onchainHistory;

    this.state = { type, data, refreshing: false };
  }

  componentDidMount() {
    this.getHistory();
  }

  componentDidUpdate(prevProps, prevState) {
    const currData =
      this.state.type === Types.LIGHTNING ? this.props.lightningHistory : this.props.onchainHistory;

    if (!equals(prevState.data, currData)) {
      this.setState({ data: currData, refreshing: false });
    } else if (this.state.refreshing) {
      this.setState({ refreshing: false });
    }
  }

  onCreatePayment = () => {
    const { navigation } = this.props;
    const { type } = this.state;
    navigation.navigate('PaymentCreate', { type });
  };

  onEndReached = () => {
    if (this.props.canLoadMoreLightningHistory) {
      this.props.loadMoreLightningHistory();
    }
  };

  onViewableItemsChanged = ({ viewableItems }) => {
    if (this.props.canLoadMoreLightningHistory) {
      this.props.loadMoreLightningHistory(last(viewableItems).item.date);
    }
  };

  getHistory = (updateBalance = false) => {
    if (this.state.type === Types.LIGHTNING) {
      this.props.getLightningHistory();

      if (updateBalance) {
        this.props.getLightningBalance();
      }
    } else {
      this.props.getOnchainHistory();

      if (updateBalance) {
        this.props.getBitcoinBalance();
      }
    }
  };

  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getHistory(true);
    });
  };

  render() {
    const {
      btcFraction,
      navigation: {
        state: {
          params: {
            id, balanceSatoshi, balanceUSD, type,
          },
        },
      },
      isLoadingMoreHistory,
    } = this.props;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitleText}>
            {`${satoshiToBtcFraction(balanceSatoshi, btcFraction)} ${btcFraction}`}
          </Text>
          <Text style={styles.headerSubTitleText}>{`~ $${balanceUSD}`}</Text>
          <Text style={styles.headerTokenText}>{id}</Text>
        </View>
        <View style={styles.buttonsSection}>
          <TouchableOpacity activeOpacity={Metrics.activeOpacity} onPress={this.onCreatePayment}>
            <Text style={styles.buttonText}>CREATE PAYMENT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={Metrics.activeOpacity}
            onPress={getHistoryRightAction(type, this.props.navigation, id)}
          >
            {type === Types.LIGHTNING ? (
              <PrivacyModeView style={styles.privacyModeView} lockStyle={styles.lockStyle}>
                <Text style={styles.buttonText}>STREAM PAYMENT</Text>
              </PrivacyModeView>
            ) : (
              <Text style={styles.buttonText}>COPY ID</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.historySection}>
          <Text style={styles.historyTitleText}>Payments history</Text>
        </View>
        <SectionList
          ref={(ref) => {
            this.sectionList = ref;
          }}
          onViewableItemsChanged={this.onViewableItemsChanged}
          style={styles.historyList}
          sections={this.state.data}
          stickySectionHeadersEnabled={false}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.onEndReached}
          ListEmptyComponent={
            <View style={styles.placeholderSection}>
              <Image source={Images.historyPlaceholder} style={Metrics.icons.historyPlaceholder} />
              <Text style={styles.placeholderText}>
                This will display the history of your transactions
              </Text>
            </View>
          }
          ListFooterComponent={
            isLoadingMoreHistory && (
              <View style={styles.footerStyle}>
                <ActivityIndicator animating size="large" />
              </View>
            )
          }
          keyExtractor={item => `${item.id}:${item.date}`}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <PaymentHistoryRow
              navigation={this.props.navigation}
              item={item}
              btcFraction={btcFraction}
            />
          )}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  lightningHistory: LightningSelectors.getHistory(state),
  onchainHistory: OnchainSelectors.getHistory(state),
  btcFraction: UiSelectors.getBtcFraction(state),
  isLoadingMoreHistory: LightningSelectors.isLoadingMoreHistory(state),
  canLoadMoreLightningHistory: LightningSelectors.canLoadMoreHistory(state),
});

const mapDispatchToProps = dispatch => ({
  getLightningBalance: () => dispatch(LightningActions.lightningBalanceRequest()),
  getLightningHistory: () => dispatch(LightningActions.lightningHistoryRequest()),
  getBitcoinBalance: () => dispatch(OnchainActions.onchainBalanceRequest()),
  getOnchainHistory: () => dispatch(OnchainActions.onchainHistoryRequest()),
  loadMoreLightningHistory: date =>
    dispatch(LightningActions.lightningLoadMoreHistoryRequest(date)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentScreen);
