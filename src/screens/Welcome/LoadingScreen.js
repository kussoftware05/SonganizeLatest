import React, {useEffect} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';

import LogoImage from '../../components/logo_image';
const LoadingScreen = props => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      props.navigation.replace('DrawerNavigationRoutes');
    }, 20000);

    return () => {
      // clears timeout before running the new effect
      clearTimeout(timeout);
    };
  }, []);
  return (
    <View style={styles.loading}>
      <LogoImage />
      <ActivityIndicator size="large" color="orange"></ActivityIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
