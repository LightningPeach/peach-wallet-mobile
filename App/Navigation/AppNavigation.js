import { createStackNavigator } from 'react-navigation';
import ResponseScreen from '../Containers/ResponseScreen';
import ChangePinScreen from '../Containers/ChangePinScreen';
import UnlockPinScreen from '../Containers/UnlockPinScreen';
import CreatePinScreen from '../Containers/CreatePinScreen';
import NfcPaymentScreen from '../Containers/NfcPaymentScreen';
import StreamsErrorScreen from '../Containers/Streams/StreamsErrorScreen';

import TabsNav from './TabsNavigation';
import InitialScreen from '../Containers/InitialScreen';
import SignUpScreen from '../Containers/Login/SignUpScreen';
import SignInScreen from '../Containers/Login/SignInScreen';
import PaymentScreen from '../Containers/Payments/PaymentScreen';
import PaymentInfoScreen from '../Containers/Payments/PaymentInfoScreen';
import PaymentCreateScreen from '../Containers/Payments/PaymentCreateScreen';
import PaymentDataScreen from '../Containers/Payments/PaymentDataScreen';
import ItemSelectScreen from '../Containers/Payments/ItemSelectScreen';
import ChannelsInfoScreen from '../Containers/Channels/ChannelsInfoScreen';
import ChannelsNewScreen from '../Containers/Channels/ChannelsNewScreen';
import ChannelsErrorScreen from '../Containers/Channels/ChannelsErrorScreen';
import ContactsNewScreen from '../Containers/Contacts/ContactsNewScreen';
import ContactsInfoScreen from '../Containers/Contacts/ContactsInfoScreen';
import ContactsScreen from '../Containers/Contacts/ContactsScreen';
import ProfileLicenseScreen from '../Containers/Profile/ProfileLicenseScreen';
import ProfileCurrencyScreen from '../Containers/Profile/ProfileCurrencyScreen';
import ProfileChangePassScreen from '../Containers/Profile/ProfileChangePassScreen';
import PaymentRequestScreen from '../Containers/Payments/PaymentRequestScreen';
import PaymentRequestInfoScreen from '../Containers/Payments/PaymentRequestInfoScreen';
import PaymentResponseScreen from '../Containers/Payments/PaymentResponseScreen';
import StreamsListScreen from '../Containers/Streams/StreamsListScreen';
import StreamsInfoScreen from '../Containers/Streams/StreamsInfoScreen';
import StreamsEndScreen from '../Containers/Streams/StreamsEndScreen';
import PaymentQrCodeScreen from '../Containers/Main/PaymentQrCodeScreen';
import SignupQrCodeScreen from '../Containers/Main/SignupQrCodeScreen';

import { Colors, isIOS } from '../Themes';
import styles from './Styles/NavigationStyles';
import PrivacyModeSelectScreen from '../Containers/Payments/PrivacyModeSelectScreen';

// Manifest of possible screens
const AppNavigation = createStackNavigator(
  {
    Initial: { screen: InitialScreen },
    // Tabs
    Tabs: { screen: TabsNav },

    // Login
    SignUp: { screen: SignUpScreen },
    SignIn: { screen: SignInScreen },
    ChangePinScreen: { screen: ChangePinScreen },
    UnlockPinScreen: { screen: UnlockPinScreen },
    CreatePinScreen: { screen: CreatePinScreen },
    ResponseScreen: { screen: ResponseScreen },
    PrivacyModeSelectScreen: { screen: PrivacyModeSelectScreen },

    // Main screens
    PaymentHistory: { screen: PaymentScreen },
    PaymentInfo: { screen: PaymentInfoScreen },
    PaymentCreate: { screen: PaymentCreateScreen },
    PaymentData: { screen: PaymentDataScreen },
    ItemSelect: { screen: ItemSelectScreen },
    PaymentResponse: { screen: PaymentResponseScreen },
    PaymentQrCode: { screen: PaymentQrCodeScreen },
    SignupQrCode: { screen: SignupQrCodeScreen },
    NfcPayment: { screen: NfcPaymentScreen },

    // Streams screens
    StreamsList: { screen: StreamsListScreen },
    StreamsInfo: {
      screen: StreamsInfoScreen,
      navigationOptions: { headerStyle: styles.headerStreams },
    },
    StreamsError: {
      screen: StreamsErrorScreen,
      navigationOptions: { headerStyle: styles.headerStreams },
    },
    StreamsEnd: {
      screen: StreamsEndScreen,
      navigationOptions: { headerStyle: styles.headerStreams },
    },

    // Channels screens
    ChannelsInfo: { screen: ChannelsInfoScreen },
    ChannelsNew: { screen: ChannelsNewScreen },
    ChannelsError: { screen: ChannelsErrorScreen },

    // Contacts screens
    Contacts: { screen: ContactsScreen },
    ContactsNew: { screen: ContactsNewScreen },
    ContactsInfo: { screen: ContactsInfoScreen },

    // Profile screens
    ProfileLicense: { screen: ProfileLicenseScreen },
    ProfileCurrency: { screen: ProfileCurrencyScreen },
    ProfileChangePass: { screen: ProfileChangePassScreen },
    PaymentRequest: { screen: PaymentRequestScreen },
    PaymentRequestInfo: { screen: PaymentRequestInfoScreen },
  },
  {
    // Default config for all screens
    headerMode: 'screen',
    initialRouteName: 'Initial',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitleStyle,
      headerTintColor: isIOS ? Colors.white : Colors.orange,
    },
  },
);

export default AppNavigation;
