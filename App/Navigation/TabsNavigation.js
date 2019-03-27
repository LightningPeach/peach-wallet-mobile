import React from 'react';
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import { Platform, Image } from 'react-native';

import PrivacyModeView from '../Components/PrivacyModeView';
import { Colors, Metrics, isIOS, Images } from '../Themes';
import styles from './Styles/NavigationStyles';

import MainScreen from '../Containers/Main/MainScreen';
import ChannelsScreen from '../Containers/Channels/ChannelsScreen';
import ContactsScreen from '../Containers/Contacts/ContactsScreen';
import ProfileScreen from '../Containers/Profile/ProfileScreen';

const MainStack = createStackNavigator(
  {
    Main: MainScreen,
  },
  {
    // Default config for all screens
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitleStyleWithMargin,
      headerTintColor: isIOS ? Colors.white : Colors.orange,
    },
  },
);

MainStack.navigationOptions = {
  tabBarLabel: 'Main',
  tabBarIcon: ({ focused }) =>
    Platform.select({
      ios: () => (
        <Image source={focused ? Images.mainActive : Images.mainInactive} style={styles.tabIcon} />
      ),
      android: () => (
        <Image
          source={focused ? Images.mainActiveAndroid : Images.mainInactiveAndroid}
          style={styles.tabIcon}
        />
      ),
    })(),
};

const ChannelsStack = createStackNavigator(
  {
    Channels: ChannelsScreen,
  },
  {
    // Default config for all screens
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitleStyleWithMargin,
      headerTintColor: isIOS ? Colors.white : Colors.orange,
    },
  },
);

ChannelsStack.navigationOptions = {
  tabBarLabel: 'Channels',
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ focused }) => (
    <Image source={focused ? Images.channelsActive : Images.channelsInactive} />
  ),
};

const ContactsStack = createStackNavigator(
  {
    Contacts: ContactsScreen,
  },
  {
    // Default config for all screens
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitleStyleWithMargin,
      headerTintColor: isIOS ? Colors.white : Colors.orange,
    },
  },
);

ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) =>
    Platform.select({
      ios: () => (
        <PrivacyModeView style={styles.privacyViewStyle} lockStyle={styles.lockStyle}>
          <Image source={focused ? Images.contactsActive : Images.contactsInactive} />
        </PrivacyModeView>
      ),
      android: () => (
        <PrivacyModeView style={styles.privacyViewStyle} lockStyle={styles.lockStyle}>
          <Image source={focused ? Images.contactsActiveAndroid : Images.contactsInactiveAndroid} />
        </PrivacyModeView>
      ),
    })(),
};

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  {
    // Default config for all screens
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitleStyleWithMargin,
      headerTintColor: isIOS ? Colors.white : Colors.orange,
    },
  },
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) =>
    Platform.select({
      ios: () => <Image source={focused ? Images.profileActive : Images.profileInactive} />,
      android: () => (
        <Image source={focused ? Images.profileActiveAndroid : Images.profileInactiveAndroid} />
      ),
    })(),
};

const TabsNavigation = createMaterialTopTabNavigator(
  {
    Main: {
      screen: MainStack,
    },
    Channels: {
      screen: ChannelsStack,
    },
    Contacts: {
      screen: ContactsStack,
    },
    Profile: {
      screen: ProfileStack,
    },
  },
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    lazy: false,
    initialRouteName: 'Main',
    tabBarOptions: {
      showIcon: true,
      activeTintColor: Colors.orange,
      inactiveTintColor: Colors.darkGray,
      labelStyle: styles.labelStyle,
      style: styles.tabStyle,
      indicatorStyle: {
        opacity: 0,
        height: 0,
      },
      tabStyle: {
        height: Metrics.tabBarHeight,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
);

TabsNavigation.navigationOptions = {
  header: null,
};

export default TabsNavigation;
