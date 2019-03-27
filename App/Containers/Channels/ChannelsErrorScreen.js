import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, ScrollView } from 'react-native';
import { NavigationActions, StackActions, SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';

import Text from '../../Components/Text';
import Button from '../../Components/Button';

// Styles
import styles from './Styles/ChannelsErrorScreenStyle';
import { Images } from '../../Themes';

class ChannelsErrorScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: this.props.navigation.state.params.error,
    };
  }

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={Images.channelsError} style={styles.icon} />
          <Text style={styles.title}>ERROR</Text>
          <Text style={styles.text}>
            Channel open error:
            {'\n'}
            {this.state.error}
          </Text>
          <View style={styles.buttonsContainer}>
            <Button
              style={styles.button}
              title="OK"
              onPress={() => navigation.dispatch(StackActions.popToTop())}
            />
            <Button
              style={styles.button}
              title="TRY AGAIN"
              onPress={() => navigation.dispatch(NavigationActions.back())}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelsErrorScreen);
