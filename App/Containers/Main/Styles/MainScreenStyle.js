import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  content: {
    marginTop: Metrics.section,
    marginBottom: Metrics.section,
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentMargins: {
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerText: {
    ...Fonts.style.headerTitle,
    marginLeft: Metrics.baseMargin,
  },
  widgetsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: Metrics.section,
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
  walletIcon: {
    ...Metrics.icons.walletBig,
  },
  qrIcon: {
    ...Metrics.icons.qr,
  },
  createChanelIcon: {
    ...Metrics.icons.createChanel,
  },
  nfcPaymentIcon: {
    ...Metrics.icons.nfcPayment,
  },
  tabIcon: {
    ...Metrics.icons.mainTab,
  },
  modeIcon: {
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
});
