
// Import React and Component
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoImage from '../../components/logo_image';
import { COLORS } from '../../constant/Colors';

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
     
      AsyncStorage.multiGet(['user_key', 'user_name']).then(response => {
       
        var userKey = response[0][1];
        var userName = response[1][1];
       
        if(userKey === null && userName === null){
            navigation.replace('Login')
        }
        else{
            navigation.replace('DrawerNavigationRoutes')
        }
    }, 2000);
   
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <LogoImage />
      <ActivityIndicator
        animating={animating}
        color= {COLORS.logoColor}
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
