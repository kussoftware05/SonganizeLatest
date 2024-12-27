import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icons from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../constant/Colors';

import Loader from '../../components/Loader/Loader';
import {scale, verticalScale} from '../../components/scale';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import AppButton from '../../components/forms/AppButton';
import {
  createSetlistTable,
  createUsersTable,
  createSongsTable,
  dropUsersTable,
  dropSongsTable,
  dropSetlistTable,
} from '../../util/DBManager';

const ProfileSettings = ({navigation}) => {
  const dispatch = useDispatch();

  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(false);

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');
  const [mode, setMode] = useState('');

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

  const showDeleteModal = userId => {
    setDeleteModal(true);
  };
  const hideDeleteModal = () => {
    setLoading(false);
    setFeedback('');
    setDeleteModal(false);
  };
  const handleSubmitPress = () => {
    Alert.alert('Coming soon!');
  };

  const logoutClearData = async () => {
    clearAllData();

    dropUsersTable();
    dropSongsTable();
    dropSetlistTable();

    createUsersTable();
    createSongsTable();
    createSetlistTable();
    // await deleteFolder();
    await navigation.replace('Login');

    //AsyncStorage.clear();
    // const intervalId = setTimeout(async () => {
    //   await clearAllData();
    //   await deleteFolder();
    //   //RNRestart.restart();
    //   await navigation.replace('Login');
    //  }, 100);
    //  return () => clearTimeout(intervalId); // Cleanup on component unmount
  };
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log(err);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure to sign out?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: () => {
            logoutClearData();
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.screenOuter}>
        <View style={styles.screenInner}>
          <View style={styles.header}>
            <Text style={styles.titleHead}>Settings</Text>
          </View>
          <Text style={styles.head}>Account</Text>

          <View style={styles.contentArea}>
            <TouchableOpacity
              style={styles.contents}
              onPress={() => navigation.navigate('ChangePassword')}>
              <Text style={styles.contentText}>Change Password</Text>
              <Icons
                name="arrow-forward"
                color={COLORS.logoColor}
                style={{
                  alignSelf: 'center',
                }}
                size={22}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
              <Text style={styles.contentText}>Languages</Text>
              <Icons
                name="arrow-forward"
                color={COLORS.logoColor}
                style={{
                  alignSelf: 'center',
                }}
                size={22}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.buttonBox]}
              onPress={() => showDeleteModal(userId)}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity>
                  <MaterialIcons
                    name="account-cancel"
                    color={COLORS.white}
                    style={{
                      alignSelf: 'center',
                    }}
                    size={22}
                  />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Delete account</Text>
              </View>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonBox]}
              onPress={() => handleSignOut()}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity>
                  <Icons
                    name="logout"
                    color={COLORS.white}
                    style={{
                      alignSelf: 'center',
                    }}
                    size={22}
                  />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Logout</Text>
              </View>
            </Pressable>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={deleteModal}
            onRequestClose={() => {
              hideDeleteModal();
            }}>
            <ScrollView>
              <View style={styles.deleteModalView}>
                <View style={styles.deleteModalViewSub}>
                  <Loader loading={loading} />
                  <View style={styles.buttonCloseOptionContainer}>
                    <TouchableHighlight
                      style={{
                        ...styles.closeButton,
                        backgroundColor: COLORS.logoColor,
                      }}
                      onPress={() => {
                        hideDeleteModal();
                      }}>
                      <Icons name="close" size={30} color={COLORS.white} />
                    </TouchableHighlight>
                  </View>
                  <Text style={styles.deleteModalHeading}>Delete Account</Text>
                  <Text style={styles.deleteModalSubHeading}>
                    Please be aware that your account will be deleted completly.
                    Your files cannot be restored.
                  </Text>
                  <View style={styles.inputArea}>
                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>
                        What can we do better?
                      </Text>
                      <TextInput
                        textAlignVertical="top"
                        style={styles.input}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setFeedback}
                        value={feedback}
                      />
                    </View>
                  </View>
                  <Text style={styles.inputLabelText}>ARE YOU SURE?</Text>
                  <View style={styles.btngrp}>
                    <View style={styles.deleteModalCancel}>
                      <AppButton
                        onPress={() => {
                          hideDeleteModal();
                        }}
                        title="Cancel"
                        backgroundColor={COLORS.cancelButtonColor}
                      />
                    </View>
                    <View style={styles.deleteModalSave}>
                      <AppButton
                        onPress={() => handleSubmitPress()}
                        title="Yes"
                        backgroundColor={COLORS.saveButtonColor}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.lightgray,
  },
  screenOuter: {
    flex: 1,
    backgroundColor: COLORS.lightgray,
  },
  screenInner: {
    flex: 1,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  titleHead: {
    fontSize: 25,
    marginVertical: 30,
    marginHorizontal: 10,
  },
  head: {
    fontSize: 20,
    color: COLORS.textListColorBold,
    marginHorizontal: '5%',
    marginBottom: 10,
  },
  header: {
    width: '100%',
    height: 'auto',
  },
  upperArea: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  contentArea: {
    width: '100%',
    borderTopWidth: 1,
    paddingVertical: 25,
    gap: 10,
  },
  contents: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  checkBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 4,
  },
  contentText: {
    fontSize: 16,
    color: 'black',
  },
  buttons: {
    flexDirection: 'column',
    paddingTop: verticalScale(250),
    borderTopWidth: 1,
    borderTopColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'semibold',
    padding: 2,
  },
  buttonBox: {
    backgroundColor: COLORS.editButtonColor,
    borderRadius: 10,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
  table_body: {
    width: '90%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  table_body: {
    width: '90%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  list: {
    width: '100%',
    padding: 5,
  },
  flatlist: {
    borderTopWidth: 1,
    borderTopColor: 'black',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  // start delete modal style
  deleteModalView: {
    flex: 1,
    justifyContent: 'center',
    width: scale(350),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    elevation: 5,
    bottom: 0,
    borderTopColor: COLORS.lightgray,
    marginLeft: 'auto',
    marginRight: 'auto',
    //margin: 10,
    marginTop: verticalScale(120),
    paddingBottom: 20,
  },
  deleteModalViewSub: {
    width: '100%',
    height: '100%',
  },
  deleteModalHeading: {
    fontSize: 25,
    color: COLORS.black,
    marginTop: scale(20),
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  deleteModalSubHeading: {
    fontSize: 15,
    color: COLORS.black,
    marginTop: scale(15),
    marginHorizontal: 20,
  },
  btngrp: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  deleteModalButton: {
    paddingVertical: 10,
    width: scale(60),
    borderRadius: 12,
  },
  deleteModalButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: 'semibold',
  },
  deleteModalCancel: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
  },
  deleteModalSave: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
  },
  buttonCloseOptionContainer: {
    width: '100%',
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputArea: {
    width: scale(200),
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  inputField: {
    justifyContent: 'flex-start',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 15,
    color: COLORS.black,
    marginTop: scale(15),
    paddingBottom: verticalScale(5),
  },
  inputLabelText: {
    fontSize: 15,
    color: COLORS.black,
    marginTop: scale(15),
    marginHorizontal: 20,
    fontWeight: '500',
    paddingBottom: verticalScale(10),
  },
  input: {
    width: scale(300),
    padding: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 2,
  },
});
