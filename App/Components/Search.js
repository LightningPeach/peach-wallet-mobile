import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBox from 'react-native-search-box';
import { isEmpty } from 'ramda';

import { Metrics, Colors, isIOS } from '../Themes';

import styles from './Styles/SearchStyle';

export default class Search extends Component {
  // Prop type warnings
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onEndSearch: PropTypes.func,
  };

  // Defaults for props
  static defaultProps = {
    onFocus: () => {},
    onEndSearch: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
    };
  }

  changeText(text) {
    this.props.onChangeText(text);
  }

  handleOnFocus = () => {
    this.setState({ isActive: true }, () => {
      this.props.onFocus();
    });
  };

  handleBeforeSearch = (text, cb) => {
    if (isEmpty(text)) {
      this.setState({ isActive: false }, () => {
        this.props.onEndSearch();
        cb();
      });
    }
  };

  handleOnCancel = () => {
    this.setState({ isActive: false }, () => {
      this.props.onChangeText('');
      this.props.onEndSearch();
    });
  };

  handleOnDelete = () => {
    this.props.onChangeText('');
  };

  render() {
    const containerStyles = [styles.container];

    if (this.state.isActive) {
      containerStyles.push(styles.headerActive);
    }

    return (
      <SearchBox
        containerStyles={containerStyles}
        backgroundColor={isIOS ? Colors.background : Colors.black}
        placeholderTextColor={Colors.lightGray}
        titleCancelColor={Colors.orange}
        tintColorDelete={Colors.lightGray}
        tintColorSearch={Colors.lightGray}
        selectionColor={Colors.orange}
        inputStyle={styles.textInput}
        inputBorderRadius={Metrics.buttonRadius}
        cancelButtonTextStyle={styles.textCancel}
        onChangeText={text => this.changeText(text)}
        beforeSearch={this.handleBeforeSearch}
        searchIconExpandedMargin={Metrics.search.searchIconExpandedMargin}
        searchIconCollapsedMargin={Metrics.search.searchIconCollapsedMargin}
        placeholderExpandedMargin={Metrics.search.placeholderExpandedMargin}
        placeholderCollapsedMargin={Metrics.search.placeholderCollapsedMargin}
        onFocus={this.handleOnFocus}
        onCancel={this.handleOnCancel}
        onDelete={this.handleOnDelete}
      />
    );
  }
}
