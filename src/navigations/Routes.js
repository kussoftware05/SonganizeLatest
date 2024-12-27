import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Appnavigator from './Appnavigator';

const Routes = () => {
  
  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
  }, []);

  useEffect(() => {
    initialRouteCheck();
  }, [userKey, userName, userId]);

    const initialRouteCheck = async() => {
      if((userKey !== null || userKey !== '') && (userName !== null || userName !== '') && (userId !== null || userId !== ''))
      {
        setIsLoggedIn(true)
      }
      else{
        setIsLoggedIn(false)
      }
    }

    // read storage data userID
    const readUserId = async user_id => {
      try {
        const userId1 = JSON.parse(await AsyncStorage.getItem(user_id));
        if (userId1 !== null) {
          setUserId(userId1);
        }
      } catch (e) {
        Alert.alert('Failed to fetch the data from storage');
      }
    };
     // read storage data userName
    const readUserName = async user_name => {
      try {
        const username1 = JSON.parse(await AsyncStorage.getItem(user_name));
        if (username1 !== null) {
          setUserName(username1);
        }
      } catch (e) {
        Alert.alert('Failed to fetch the data from storage');
      }
    };
     // read storage data userKey
    const readUserKey = async user_key => {
      try {
        const userKey1 = JSON.parse(await AsyncStorage.getItem(user_key));
        if (userKey1 !== null) {
           setUserKey(userKey1);
        }
      } catch (e) {
        Alert.alert('Failed to fetch the data from storage');
      }
    };

  return (
    <Appnavigator />
  );
};

export default Routes;
