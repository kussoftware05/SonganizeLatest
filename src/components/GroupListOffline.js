import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Loader from '../components/Loader/Loader';
import Icons from 'react-native-vector-icons/MaterialIcons';

import Dialog from 'react-native-dialog';
import {COLORS} from '../constant/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {verticalScale} from '../components/scale';
import NetInfo from '@react-native-community/netinfo';
import AppButton from './forms/AppButton';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Songanizeoffline.db'});

const GroupListOffline = props => {
  const [memberModal, setMemberModal] = useState(false);
  const [renameGroupModal, setRenameGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');

  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useState(false);
  const [groupDelete, setGroupDelete] = useState(null);

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

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
      } else {
      }
    });
  };

  const editPress = async groupId => {
    setRenameGroupModal(true);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_groups where id = ?',
        [groupId],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            setGroupName(results.rows.item(0).g_name);
          } else {
            Alert.alert('No record found');
          }
        },
      );
    });
  };
  const handleSubmitPress = async groupId => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tbl_groups set g_name=? where id=?',
        [groupName, groupId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setRenameGroupModal(false);
            Alert.alert(
              'Success',
              'Group updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => props.fetchDataHandler(),
                },
              ],
              {cancelable: false},
            );
          } else Alert.alert('Updation Failed');
        },
      );
    });
  };
  const handlegroupDelete = groupDeleteId => {
    setGroupDelete(groupDeleteId);
    setShowDeleteAlert(true);
  };

  const handleDialogCancel = () => {
    setShowDeleteAlert(false);
  };
  const handleDialogOk = () => {
    //Show Loader
    setLoading(true);
    try {
      // if we have division id than its edit mode
      if (groupDelete) {
        setShowDeleteAlert(false);
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE tbl_groups set isDeleted=? where id=?',
            [true, groupDelete],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                db.transaction(tx => {
                  tx.executeSql(
                    'UPDATE tbl_groups_users set isDeleted=? where ufId=? AND uId =?',
                    [true, groupDelete, userId],
                    (tx, result) => {
                      console.log('Results groupusers', result.rowsAffected);
                    },
                  );
                });
                Alert.alert(
                  'Success',
                  'Group deleted successfully',
                  [
                    {
                      text: 'Ok',
                      onPress: () => props.fetchDataHandler(),
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                Alert.alert('Something is wrong');
              }
            },
          );
        });
      }
    } catch (error) {}
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.bigBrandArea} key={props.data.id}>
        <View style={styles.middleArea}>
          <Text style={styles.heading}>{props.data.g_name}</Text>
          <Dialog.Container visible={showDeleteAlert}>
            <Dialog.Title>Group delete</Dialog.Title>
            <Dialog.Description>
              Do you want to delete "{props.data.g_name}"?
            </Dialog.Description>
            <Dialog.Button
              label="Cancel"
              onPress={handleDialogCancel}
              color={COLORS.green}
              bold="true"
            />
            <Dialog.Button
              label="Yes"
              onPress={() => handleDialogOk()}
              color={COLORS.red}
              bold="true"
            />
          </Dialog.Container>
          <View style={styles.buttonArea}>
            <View style={styles.deleteButton}>
              <TouchableOpacity
                onPress={() => handlegroupDelete(props.data.id)}>
                <Icons
                  name="delete"
                  color="white"
                  style={{
                    alignSelf: 'center',
                  }}
                  size={22}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.editButton}>
              <TouchableOpacity onPress={() => editPress(props.data.id)}>
                <Icons
                  name="edit"
                  color="white"
                  style={{
                    alignSelf: 'center',
                  }}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.middleLowerArea}>
          <Text style={styles.headingMessage}>
            Once you back as online, you will see the members of the group
          </Text>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={memberModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setMemberModal(!memberModal);
          }}
          style={styles.modalContainer}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Invite member</Text>
              <View style={styles.modelClose}>
                <TouchableOpacity onPress={() => setMemberModal(!memberModal)}>
                  <Icons
                    name="close"
                    color="white"
                    style={styles.closeIcon}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalTextInputArea}>
                <Text>me of group/band/chair/class:</Text>
                <TextInput style={styles.modalTextInput}></TextInput>
              </View>
              <View style={styles.modelButtons}>
                <Pressable style={styles.cancelButton}>
                  <Text
                    style={styles.modalButtonText}
                    onPress={() => setMemberModal(!memberModal)}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable style={styles.saveButton}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={renameGroupModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setRenameGroupModal(!renameGroupModal);
          }}
          style={styles.modalContainer}>
          <View style={styles.centeredView}>
            <Loader loading={loading} />
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Rename group</Text>
              <View style={styles.modelClose}>
                <TouchableOpacity
                  onPress={() => setRenameGroupModal(!renameGroupModal)}>
                  <Icons
                    name="close"
                    color="white"
                    style={styles.closeIcon}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalTextInputArea}>
                <Text style={styles.textColor}>
                  me of group/band/chair/class:
                </Text>
                <TextInput
                  style={styles.modalTextInput}
                  value={groupName}
                  onChangeText={setGroupName}></TextInput>
              </View>
              <View style={styles.modelButtons}>
                <View style={styles.cancelButton}>
                  <AppButton
                    onPress={() => setRenameGroupModal(!renameGroupModal)}
                    title="Cancel"
                    backgroundColor={COLORS.cancelButtonColor}
                  />
                </View>
                <View style={styles.saveButton}>
                  <AppButton
                    onPress={() => handleSubmitPress(props.data.id)}
                    title="Save"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default GroupListOffline;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  dialogContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 23,
    marginHorizontal: 10,
    color: 'black',
  },
  headingMessage: {
    fontSize: 15,
    fontWeight: '500',
    marginVertical: 15,
    marginHorizontal: 10,
    color: COLORS.gray,
  },
  createButton: {
    paddingVertical: 10,
    width: '50%',
    backgroundColor: 'green',
    textAlign: 'center',
    color: 'white',
    textTransform: 'lowercase',
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  createText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  underline: {
    borderWidth: 1,
    width: '90%',
    height: 1,
    borderColor: 'gray',
    marginTop: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bigBrandArea: {
    width: '100%',
    margin: 0,
    height: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  middleArea: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  middleLowerArea: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  buttonArea: {
    flexDirection: 'column',
    width: '20%',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.cancelButtonColor,
    width: '100%',
    borderRadius: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: COLORS.editButtonColor,
    width: '100%',
    borderRadius: 10,
    paddingVertical: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  members: {
    width: '80%',
    marginBottom: 20,
    marginLeft: 20,
  },
  member: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  profile: {
    width: '30%',
    height: verticalScale(40),
    borderRadius: 50,
  },
  pendingArea: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 5,
    width: '95%',
  },
  pendingMiddleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'semibold',
    marginLeft: 5,
  },
  memberDeleteButton: {
    backgroundColor: COLORS.cancelButtonColor,
    borderRadius: 10,
    width: '20%',
    paddingVertical: 5,
  },
  profileRemove: {
    fontSize: 15,
    fontWeight: 'semibold',
    textAlign: 'center',
    color: 'white',
  },
  modalContainer: {
    width: '90%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: '100%',
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: verticalScale(200),
    elevation: 5,
    overflow: 'hidden',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textListColorBold,
  },
  modalTextInputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  textColor: {
    fontSize: 16,
    color: COLORS.textListColorBold,
  },
  modalTextInput: {
    height: 35,
    borderWidth: 1,
    borderColor: COLORS.black,
    width: '32%',
    borderRadius: 5,
    marginLeft: 10,
  },
  modelButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cancelButton: {
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },
  modalButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: 'bold',
  },
  modelClose: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 45,
    height: 40,
    overflow: 'hidden',
    backgroundColor: COLORS.editButtonColor,
    borderRadius: 20,
  },
  closeIcon: {
    position: 'absolute',
    alignSelf: 'center',
    color: 'white',
    fontSize: 26,
  },
});
