import React, { Component } from 'react';
import { View, Linking, WebView } from 'react-native';
import { path, map, isNil } from 'ramda';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import Text from '../../Components/Text';
import ShadowComponent from '../../Components/ShadowComponent';
import Types from '../../Config/Types';
import Errors from '../../Config/Errors';
import { showError } from '../../Services/InformBox';
import { Events, logEvent } from '../../Services/Analytics';

// Styles
import styles from './Styles/ProfileLicenseScreenStyle';
import Button from '../../Components/Button';
import BackAwareComponent from '../../Components/BackAwareComponent';
import AppConfig from '../../Config/AppConfig';

const injectScript = `
  (function() {
    window.onclick = function(e) {      
      if(e.target.href.indexOf('#') === -1){             
        e.preventDefault();
        window.postMessage(e.target.href);
        e.stopPropagation();
      }
    }
  }())
`;

class ProfileLicenseScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    ...BackAwareComponent.navigationOptions({ navigation }),
    headerTitle: navigation.getParam('title', ''),
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  });
  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(PropTypes.shape({
      onAgreed: PropTypes.func,
      onDataProcessingEnabled: PropTypes.func,
    })).isRequired,
  };

  constructor(props) {
    super(props);

    this.renderPaginationCallback = this.renderPaginationCallback.bind(this);

    this.props.navigation.setParams({
      onBack: this.onBack,
      title: AppConfig.licenseTexts[0].title,
    });

    this.state = {
      index: 0,
      total: AppConfig.licenseTexts.length,
    };
  }

  onUserAgreed = () => {
    logEvent(Events.ProfileLicenseAgree);
    this.props.navigation.state.params.onAgreed();
    this.props.navigation.goBack();
  };

  onDataProcessingEnabled = () => {
    logEvent(Events.ProfileLicenseDataProcessingEnable);
    this.props.navigation.state.params.onDataProcessingEnabled();
    this.swipeForward();
  };

  onSwiperIndexChange = (index) => {
    this.props.navigation.setParams({ title: AppConfig.licenseTexts[index].title });
    this.setState({ index });
  };

  goBack = () => {
    if (this.swiper.state.index > 0) {
      this.swipeBack();
      return;
    }

    this.props.navigation.goBack();
  };

  swipeBack = () => {
    setImmediate(() => this.swiper.scrollBy(-1, true));
  };

  swipeForward = () => {
    setImmediate(() => this.swiper.scrollBy(1, true));
  };

  handleWebViewClick = async ({ nativeEvent }) => {
    const { data } = nativeEvent;
    if (isNil(data)) {
      return;
    }
    const canOpen = await Linking.canOpenURL(data);
    if (canOpen) {
      Linking.openURL(data);
    } else {
      showError(Errors.EXCEPTION_OPEN_LINK);
    }
  };

  renderPaginationCallback(index, total) {
    const isEndPage = index === total - 1;
    const onAgreedCallback = path(['navigation', 'state', 'params', 'onAgreed'], this.props);
    const onDataProcessingEnabledCallback = path(
      ['navigation', 'state', 'params', 'onDataProcessingEnabled'],
      this.props,
    );

    let leftButtonName;
    let leftButtonHandler;
    let rightButtonName;
    let rightButtonHandler;

    if (isEndPage) {
      if (onAgreedCallback) {
        rightButtonName = 'AGREE';
        rightButtonHandler = this.onUserAgreed;
      } else {
        rightButtonName = 'CLOSE';
        rightButtonHandler = this.props.navigation.goBack;
      }

      leftButtonName = 'PREVIOUS';
      leftButtonHandler = this.swipeBack;
    } else if (onDataProcessingEnabledCallback) {
      rightButtonName = 'AGREE';
      rightButtonHandler = this.onDataProcessingEnabled;
      leftButtonName = 'SKIP';
      leftButtonHandler = this.swipeForward;
    } else {
      rightButtonName = 'NEXT';
      rightButtonHandler = this.swipeForward;
    }

    return (
      <View style={styles.bottomBarContainer}>
        <ShadowComponent />
        <View style={styles.bottomBar}>
          {leftButtonHandler && (
            <Button
              style={styles.leftButton}
              title={leftButtonName}
              onPress={leftButtonHandler}
              inline
            />
          )}
          <Text style={styles.pagingText}>
            {index + 1} of {total} steps
          </Text>
          <Button
            style={styles.rightButton}
            title={rightButtonName}
            onPress={rightButtonHandler}
            inline
          />
        </View>
      </View>
    );
  }

  render() {
    const { index, total } = this.state;
    return (
      <BackAwareComponent goBack={this.goBack}>
        <SafeAreaView style={styles.screenContainer}>
          <Swiper
            ref={(s) => {
              this.swiper = s;
            }}
            showsPagination={false}
            loop={false}
            onIndexChanged={this.onSwiperIndexChange}
          >
            {map(
              item => (
                <WebView
                  javaScriptEnabled
                  style={styles.webView}
                  key={item.title}
                  scalesPageToFit
                  originWhitelist={['*']}
                  source={item.html}
                  injectedJavaScript={injectScript}
                  onMessage={this.handleWebViewClick}
                />
              ),
              AppConfig.licenseTexts,
            )}
          </Swiper>
          {this.renderPaginationCallback(index, total)}
        </SafeAreaView>
      </BackAwareComponent>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileLicenseScreen);
