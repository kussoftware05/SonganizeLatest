import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {useDispatch} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../constant/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getProfileImage} from './../redux/services/profileAction';
import {
  createSetlistTable,
  createUsersTable,
  createSongsTable,
  dropUsersTable,
  dropSongsTable,
  dropSetlistTable,
} from '../../src/util/DBManager';

import Loader from '../components/Loader/Loader';

const CustomSidebarMenu = props => {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');
  const [uploadedPicture, setUploadedPicture] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [userName, userKey, userId]);

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
  const getUserProfile = async () => {
    const user = {
      user_key: userKey,
      user_name: userName,
    };

    await dispatch(getProfileImage(user)).then(res => {
      if (res.type == 'auth/getProfilePicture/rejected') {
        console.log(res.payload);
      } else {
        if (res.payload.file_data) {
          setUploadedPicture(res.payload.file_data);
        }
      }
    });
  };
  const logoutClearData = async () => {
    clearAllData();
    console.log('printt' + userKey + '==' + userName + '////' + userId);
    dropUsersTable();
    dropSongsTable();
    dropSetlistTable();

    createUsersTable();
    createSongsTable();
    createSetlistTable();

    await props.navigation.replace('Login');
  };
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log(err);
    }
  };

  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <Loader loading={loading} />
      <View style={stylesSidebar.profileHeader}>
        {uploadedPicture != '' ? (
          <View style={stylesSidebar.profileHeaderPicCircle}>
            <Image
              source={{uri: uploadedPicture}}
              height={120}
              width={120}
              style={stylesSidebar.picture}
            />
          </View>
        ) : (
          <View style={stylesSidebar.profileHeaderPicCircle}>
            <Text style={{fontSize: 25, color: COLORS.logoColor}}>
              {userName.charAt(0)}
            </Text>
          </View>
        )}
        <Text style={stylesSidebar.profileHeaderText}>{userName}</Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {userName != '' ? (
          <DrawerItem
            label={({color}) => (
              <View style={{flex: 1, flexDirection: 'row'}}>
                <FontAwesome name="plus-square" size={25} color={'#67CDFF'} />
                <Text style={{marginLeft: 25, paddingTop: 5, color: '#67CDFF'}}>
                  Logout
                </Text>
              </View>
            )}
            onPress={() => {
              props.navigation.toggleDrawer();
              Alert.alert(
                'Logout',
                'Are you sure? You want to logout?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      return null;
                    },
                  },
                  {
                    text: 'Confirm',
                    onPress: async () => {
                      await logoutClearData();
                    },
                  },
                ],
                {cancelable: false},
              );
            }}
          />
        ) : null}
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.headerBackground,
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.headerBackground,
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    color: 'white',
    backgroundColor: COLORS.white,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.logoColor,
    borderWidth: 2,
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
  },
  picture: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    borderColor: COLORS.logoColor,
    borderWidth: 2,
  },
});
