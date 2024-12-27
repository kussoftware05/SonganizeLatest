import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../constant/Colors';
import {useNavigation} from '@react-navigation/native';
import ProfileTextField from '../../components/forms/ProfileTextField';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, {types} from 'react-native-document-picker';
// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Loader from '../../components/Loader/Loader';

import NetInfo from '@react-native-community/netinfo';
import AppButton from '../../components/forms/AppButton';
import {
  updateProfileServerAPI,
  UploadProfileImageServerAPI,
} from '../../Service/profileService';

import {
  fetchProfileModel,
  fetchProfilePictureModel,
  uploadPictureDataModel,
  updateProfileDataModel,
} from '../../models/profileModel';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Songanizeoffline.db'});

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [familyname, setFamilyname] = useState('');

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [fileUploading, setfileUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [uploadedPicture, setUploadedPicture] = useState('');
  const [uploadPicture, setUploadPicture] = useState('');
  const [uploadPictureData, setUploadPictureData] = useState('');
  const [uploadPictureName, setUploadPictureName] = useState('');
  const [pictureType, setPictureType] = useState('');

  const usernameInput = useRef();
  const emailInput = useRef();
  const firstnameInput = useRef();
  const familynameInput = useRef();

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

  const [mode, setMode] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (mode == 'online') {
        const timeout = setTimeout(async () => {
          await updateProfileServerAPI(
            username,
            email,
            firstname,
            familyname,
            userKey,
            userId,
            userName,
            dispatch,
          );
          // UploadProfileImageServerAPI(
          //   uploadPictureName,
          //   uploadPictureData,
          //   pictureType,
          //   userKey,
          //   userId,
          //   userName,
          //   dispatch,
          // )
        }, 1000);

        const timeout1 = setTimeout(async () => {
          await getUserProfile();
        }, 2000);

        return () => {
          // clears timeout before running the new effect
          clearTimeout(timeout);
          clearTimeout(timeout1);
        };
      } else {
        const timeout = setTimeout(async () => {
          getUserProfile();
        }, 1000);

        return () => {
          // clears timeout before running the new effect
          clearTimeout(timeout);
        };
      }
    }, [userKey, userName, userId, mode]),
  );
  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
    getNetInfo();
  }, [userKey, userName, userId]);
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
  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        setMode('online');
      } else {
        setMode('offline');
      }
    });
  };
  const getUserProfile = async () => {
    if (userId) {
      setLoading(true);

      fetchProfileModel(userKey, userName, userId)
        .then(data => {
          setLoading(false);
          setUsername(data[0].user_login);
          setEmail(data[0].user_email);
          setFirstname(data[0].user_firstname);
          setFamilyname(data[0].user_lastname);
        })
        .catch(error => console.log(error));

      fetchProfilePictureModel(userKey, userName, userId)
        .then(data => {
          setLoading(false);
          if (data[0].code) {
            displayProfilePic(data[0].code, data[0].file_type);
          }
        })
        .catch(error => console.log(error));
    }
  };
  const handleSubmitPress = async () => {
    setLoading(true);

    updateProfileDataModel(username, email, firstname, familyname, userId)
      .then(data => {
        if (mode === 'online') {
          updateProfileServerAPI(
            username,
            email,
            firstname,
            familyname,
            userKey,
            userId,
            userName,
            dispatch,
          )
            .then(resut => {
              console.log('updateProfileServerAPI' + JSON.stringify(resut));
            })
            .catch(error => console.log(error));
          setLoading(false);
          Alert.alert('Profile Updated successfully.');
        } else {
          setLoading(false);
          Alert.alert('Profile Updated successfully.');
        }
      })
      .catch(error => console.log(error));
  };
  const handleProfileUpload = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
      });
      if (response[0].uri) {
        RNFS.readFile(response[0].uri, 'base64')
          .then(res => {
            let uploadFile = 'data:' + response[0].type + ';base64,' + res;

            let date = new Date();
            var getExtension = response[0].type.slice(
              response[0].type.lastIndexOf('/') + 1,
            );

            var randomName =
              'img' +
              date.getFullYear() +
              ('0' + (date.getMonth() + 1)).slice(-2) +
              ('0' + date.getDate()).slice(-2) +
              date.getHours() +
              date.getMinutes() +
              date.getSeconds() +
              '.' +
              getExtension;

            if (uploadFile) {
              setUploadPicture(uploadFile);
              setUploadPictureData(res);
              setProfilePicture(response[0].uri);
              setUploadPictureName(randomName);
              setPictureType(getExtension);
            }
          })
          .catch(err => {
            console.log(err.message, err.code);
          });
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleSavePicture = async () => {
    setfileUploading(true);
    try {
      if (uploadPicture) {
        uploadPictureDataModel(uploadPictureName, pictureType, userId)
          .then(async data => {
            console.log('imageProfile==' + JSON.stringify(data));
            if (data.rowsAffected > 0) {
              await checkPermissionDownload(
                userName,
                uploadPictureName,
                uploadPictureData,
              );
              console.log('local profile picture user updated');
              setfileUploading(false);
              setUploadedPicture(uploadPicture);

              if (mode === 'online') {
                UploadProfileImageServerAPI(
                  uploadPictureName,
                  uploadPictureData,
                  pictureType,
                  userKey,
                  userId,
                  userName,
                  dispatch,
                )
                  .then(resut => {
                    console.log(
                      'UploadProfileImageServerAPI' + JSON.stringify(resut),
                    );
                  })
                  .catch(error => console.log(error));
                setLoading(false);
                Alert.alert(
                  'Alert',
                  'Profile Picture successfully Uploaded.',
                  [{text: 'OK', onPress: () => getUserProfile()}],
                  {cancelable: false},
                );
                setProfilePicture('');
              } else {
                Alert.alert(
                  'Alert',
                  'Profile Picture successfully Uploaded.',
                  [{text: 'OK', onPress: () => getUserProfile()}],
                  {cancelable: false},
                );
                setProfilePicture('');
              }
            } else console.log('local profile picture failed');
          })
          .catch(error => console.log(error));
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const displayProfilePic = (filename, fileType) => {
    const folderName = 'songanizeshare';

    const filesDir =
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath;
    const folderPath = `${filesDir}/${userName}/${folderName}`;
    var path = folderPath + '/' + filename;
    console.log('path--' + path);

    RNFS.exists(path)
      .then(result => {
        console.log('file exists: ', result);

        if (result) {
          RNFetchBlob.fs.readFile(path, 'base64').then(data => {
            if (fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png') {
              var baseData = 'data:image/' + fileType + ';base64,' + data;
              setUploadedPicture(baseData);
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const hasFilesPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const isReadGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (hasPermission) {
      return true;
    }
    if (isReadGranted) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const statusRead = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (statusRead === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (
      status === PermissionsAndroid.RESULTS.DENIED ||
      statusRead === PermissionsAndroid.RESULTS.DENIED
    ) {
      ToastAndroid.show('Files permission denied by user.', ToastAndroid.LONG);
    } else if (
      status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
      statusRead === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      ToastAndroid.show('Files permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  };
  const checkPermissionDownload = async (userName, filename, img64Bit) => {
    const hasPermission = await hasFilesPermission();

    if (!hasPermission) {
      return;
    }
    if (hasPermission) {
      await createPersistedFolder(userName, filename, img64Bit);
    }
  };
  const createPersistedFolder = async (userName, filename, img64Bit) => {
    console.log(filename);
    var folderName = 'songanizeshare';

    try {
      const filesDir =
        Platform.OS === 'android'
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;

      const folderPath = `${filesDir}/${userName}/${folderName}`;

      const folderExists = await RNFS.exists(folderPath);
      console.log(folderPath);
      if (!folderExists) {
        RNFS.mkdir(folderPath)
          .then(() => {
            console.log('Songanize Folder created successfully');
          })
          .catch(error => {
            console.error('Error creating folder:', error);
          });
      } else {
        console.log('Persisted folder already exists:', folderPath);
      }
      var path = folderPath + '/' + filename;

      const {config, fs} = RNFetchBlob;
      fs.writeFile(path, img64Bit, 'base64').then(res => {
        console.log('File Id: ', res);
        console.log('File Saved successfully to local folder');
      }).catch;
      err => console.log('err File not saved', err)();
    } catch (error) {
      console.error('Error creating persisted folder:', error);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={getUserProfile} />
      }>
      <View style={styles.screenOuter}>
        {/* <Loader loading={loading}/> */}
        <View style={styles.screenInner}>
          <Loader loading={fileUploading} />
          <Loader loading={loading} />
          <View style={styles.upperArea}>
            <Text style={styles.titleHead}>Edit Profile</Text>
            <TouchableOpacity>
              <Icons
                name="settings"
                color={COLORS.editButtonColor}
                style={{
                  alignSelf: 'center',
                }}
                onPress={() => navigation.navigate('ProfileSettings')}
                size={22}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.profilePicture}>
            {profilePicture ? (
              <View>
                <Image
                  source={{uri: profilePicture}}
                  height={120}
                  width={120}
                  style={styles.picture}
                />
                <View style={styles.saveBtn}>
                  <AppButton
                    onPress={() => handleSavePicture()}
                    title="Save Picture"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              </View>
            ) : uploadedPicture ? (
              <View>
                <Image
                  source={{uri: uploadedPicture}}
                  height={120}
                  width={120}
                  style={styles.picture}
                />
              </View>
            ) : (
              <View style={styles.profileHeaderPicCircle}>
                <Text style={{fontSize: 25, color: COLORS.editButtonColor}}>
                  {userName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.editIcon}>
              <TouchableOpacity>
                <Icons
                  name="edit"
                  color={COLORS.editButtonColor}
                  style={{
                    alignSelf: 'center',
                  }}
                  onPress={() => handleProfileUpload()}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldSection}>
            <View style={styles.inputField}>
              <Text style={styles.label}>Username:</Text>
              <ProfileTextField
                placeholder="Username"
                type="text"
                isRequired={true}
                ref={usernameInput}
                onChangeText={setUsername}
                value={userName}
                className="inputViewTextIcon"
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.label}>Email:</Text>

              <ProfileTextField
                placeholder="Email"
                type="email"
                isRequired={true}
                ref={emailInput}
                onChangeText={setEmail}
                keyboardType="email-address"
                value={email}
                className="inputViewTextIcon"
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.label}>Firstname:</Text>

              <ProfileTextField
                placeholder="First Name"
                type="text"
                isRequired={true}
                ref={firstnameInput}
                onChangeText={setFirstname}
                className="inputViewTextIcon"
                value={firstname}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.label}>Familyname:</Text>

              <ProfileTextField
                placeholder="Family Name"
                type="text"
                isRequired={true}
                ref={familynameInput}
                onChangeText={setFamilyname}
                className="inputViewTextIcon"
                value={familyname}
              />
            </View>
          </View>
          <View style={styles.buttonArea}>
            <View style={styles.cancel}>
              <AppButton
                title="Cancel"
                backgroundColor={COLORS.cancelButtonColor}
              />
            </View>
            <View style={styles.save}>
              <AppButton
                onPress={() => handleSubmitPress()}
                title="Save"
                backgroundColor={COLORS.saveButtonColor}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightgray,
  },
  screenOuter: {
    flex: 1,
    backgroundColor: COLORS.lightgray,
    width: '100%',
  },
  screenInner: {
    flex: 1,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  upperArea: {
    width: '100%',
    height: 50,
    borderBottomColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleHead: {
    fontSize: 22,
  },
  profilePicture: {
    borderRadius: 50,
    width: '100%',
    marginTop: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profileHeaderPicCircle: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    color: 'white',
    backgroundColor: COLORS.white,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.logoColor,
    borderWidth: 2,
  },
  editIcon: {
    position: 'absolute',
    top: 80,
    right: 160,
    height: 30,
    width: 30,
    backgroundColor: COLORS.white,
    borderColor: COLORS.editButtonColor,
    borderWidth: 2,
    borderRadius: 15,
  },
  picture: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 60,
    borderColor: COLORS.editButtonColor,
    borderWidth: 2,
  },
  fieldSection: {
    width: '100%',
  },
  inputField: {
    width: '100%',
    flexDirection: 'column',
    margin: 'auto',
  },
  label: {
    fontSize: 16,
    color: COLORS.textListColorBold,
    padding: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
  },
  buttonArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    margin: 10,
  },
  cancel: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
  },
  save: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
  },
  saveBtn: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 15,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
