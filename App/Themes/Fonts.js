import Colors from './Colors';
import { isIOS } from './Utils';

const type = {
  base: isIOS ? 'SFProText-Light' : 'Roboto-Light',
  bold: isIOS ? 'SFProText-Bold' : 'Roboto-Bold',
  semibold: isIOS ? 'SFProText-Semibold' : 'Roboto-Medium',
  medium: isIOS ? 'SFProText-Medium' : 'Roboto-Medium',
  regular: isIOS ? 'SFProText-Regular' : 'Roboto-Regular',
};

const size = {
  h1: 32,
  h2: 24,
  h3: 20,
  input: 18,
  regular: 17,
  medium: 14,
  small: 12,
  tab: 10,
  tiny: 8.5,
  streamTime: 72,
};

const style = {
  normal: {
    fontFamily: type.base,
    fontSize: size.regular,
    color: Colors.white,
  },
  medium: {
    fontFamily: type.medium,
    fontSize: size.input,
    color: Colors.white,
  },
  tab: {
    fontFamily: isIOS ? type.regular : type.bold,
    fontSize: size.tab,
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium,
    color: Colors.white,
  },
  secondaryDescription: {
    fontFamily: type.regular,
    fontSize: size.small,
    color: Colors.warmGrey,
    lineHeight: 16,
  },
  headerTitle: {
    fontFamily: isIOS ? type.regular : type.medium,
    fontSize: isIOS ? size.input : size.h3,
    fontWeight: isIOS ? '400' : '500',
    color: Colors.white,
  },
  base: {
    fontFamily: type.base,
    fontSize: size.small,
    color: Colors.white,
  },
  regular: {
    fontFamily: type.regular,
    fontSize: size.medium,
    color: Colors.white,
  },
  semibold: {
    fontFamily: type.semibold,
    fontSize: size.input,
    color: Colors.white,
  },
  bold: {
    fontFamily: type.bold,
    fontSize: size.input,
    color: Colors.white,
  },
};

export default {
  type,
  size,
  style,
};
