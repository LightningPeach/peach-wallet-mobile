import Types from '../Config/Types';
import { Images } from '../Themes';

export const getIcon = (type) => {
  switch (type) {
    case Types.ONCHAIN:
      return Images.bitcoinWhiteIcon;

    case Types.LIGHTNING:
      return Images.lightningWhiteIcon;

    default:
      return null;
  }
};
