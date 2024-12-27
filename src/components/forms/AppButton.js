import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { COLORS } from '../../constant/Colors';
import { scale, verticalScale } from '../scale';
const AppButton = ({onPress, title, size,  backgroundColor}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.appButtonContainer,
      size === 'lg' && {
        paddingVertical: 6,
        elevation: 6,
        width: '100%',
      },
        backgroundColor && {backgroundColor}]}>
    <Text style={styles.appButtonText}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default AppButton;

const styles = StyleSheet.create({
  appButtonContainer: {
    padding: 2,
    width: scale(120),
    height: verticalScale(35),
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 6,
    elevation: 6,
  },
  appButtonText: {
    color: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 15,
    padding: 5,
    letterSpacing: 1,
    justifyContent: 'space-between',
  },
});