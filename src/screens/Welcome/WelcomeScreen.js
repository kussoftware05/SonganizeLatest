import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ToastAndroid
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../constant/Colors';

import NetInfo from '@react-native-community/netinfo';
import { verticalScale } from '../../components/scale';
import RNRestart from 'react-native-restart'; // Import package from node modules

const WelcomeScreen = ({navigation}) => {
  var imgSrc = require('../../images/offline.png')
  const [offlineImage, setOfflineImage] = useState(imgSrc);
 
  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) 
      {
        ToastAndroid.showWithGravity(
          'Back to online mode.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        RNRestart.restart();
      } else {
        Linking.sendIntent("android.settings.SETTINGS");
      }
    });
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.message}>
            <Text style={styles.messageText}>Oops! You are currently Offline...</Text>
        </View>
        <View style={styles.picture}>
            <Image source = {offlineImage}  
            style={styles.pictureStyle}
        resizeMode='contain' />
        </View>
        <View style={styles.trySection}>
        <TouchableOpacity onPress={() => getNetInfo()}>
        <Text style={styles.normalText}>Please check your internet connection</Text>
           <Text style={styles.messageText}>Try Again...</Text>
           </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    margin: 10
  },
  subContainer:{
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    flexDirection: 'column'
  },
  message:{
    marginTop: 40,
    width:'100%',
    height:verticalScale(80),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picture:{
    width:'100%',
    height:verticalScale(300),
    flex: 1
  },
  pictureStyle:{
    width:'100%',
    height: '100%'
  },
  trySection:{
    marginTop: 20,
    width:'100%',
    height:verticalScale(50),
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: COLORS.logoColor,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
    padding: 5
  },
  messageText:{
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  normalText:{
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: COLORS.logoColor,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
  },
});
