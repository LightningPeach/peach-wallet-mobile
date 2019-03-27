import React, { Component } from 'react';
import { withNavigation, HeaderBackButton } from 'react-navigation';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import Types from '../Config/Types';
import { Metrics, Colors, ApplicationStyles, isIOS } from '../Themes';

class BackAwareComponent extends Component {
  static navigationOptions = ({ navigation }) => {
    const { showCrossIcon = false, goBack } = navigation.state.params || {};
    let headerLeft;
    if (showCrossIcon) {
      headerLeft = (
        <TouchableOpacity activeOpacity={Metrics.activeOpacity} onPress={goBack}>
          <Icon
            style={ApplicationStyles.screen.closeIcon}
            name="ios-close"
            size={Metrics.icons.close}
            color={isIOS ? Colors.lightGray : Colors.orange}
          />
        </TouchableOpacity>
      );
    } else {
      headerLeft = <HeaderBackButton tintColor={Colors.white} onPress={goBack} />;
    }
    return {
      headerLeft,
      headerBackTitle: null,
    };
  };

  static propTypes = {
    showCrossIcon: PropTypes.bool,
    navigation: Types.NAVIGATION_PROPS().isRequired,
    goBack: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    showCrossIcon: false,
  };

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      goBack: () => this.props.goBack(),
      showCrossIcon: this.props.showCrossIcon,
    });
  }

  render() {
    return this.props.children;
  }
}

export default withNavigation(BackAwareComponent);
