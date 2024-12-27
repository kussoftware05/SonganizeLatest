import {Dimensions} from 'react-native';

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;
const isPortrait = () => {
  const dim = Dimensions.get('window');

  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};
const scale = size =>
  isPortrait()
    ? (Dimensions.get('window').width / guidelineBaseWidth) * size
    : (Dimensions.get('window').width / guidelineBaseHeight) * size;
const verticalScale = size =>
  isPortrait()
    ? (Dimensions.get('window').height / guidelineBaseHeight) * size
    : (Dimensions.get('window').height / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export {scale, verticalScale, moderateScale};
