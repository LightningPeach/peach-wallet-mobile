import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Text, Image } from 'react-native';
import { connect } from 'react-redux';

// Styles
import styles from './Styles/ResponseScreenStyle';
import Button from '../Components/Button';
import { Images } from '../Themes';

class ResponseScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigation } = this.props;
    const text = navigation.getParam('text');
    const isError = navigation.getParam('isError') || false;
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.icon} source={isError ? Images.channelsError : Images.success} />
        <Text style={isError ? styles.textError : styles.textSuccess}>
          {isError ? 'ERROR' : 'SUCCESS'}
        </Text>
        <Text style={styles.text}>{text}</Text>
        <Button style={styles.button} title="OK" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResponseScreen);
