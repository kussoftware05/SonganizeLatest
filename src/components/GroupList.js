import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Loader from '../components/Loader/Loader';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {getGroup} from '../redux/services/groupAction';
import {
  updateGroup,
  deleteGroup,
  deleteGroupMember,
  deleteGroupPendingMember,
} from '../redux/services/groupAction';

import Dialog from 'react-native-dialog';

import {COLORS} from '../constant/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {verticalScale} from '../components/scale';
import NetInfo from '@react-native-community/netinfo';
import AppButton from './forms/AppButton';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Songanizeoffline.db'});

const GroupList = props => {
  const dispatch = useDispatch();

  const [memberModal, setMemberModal] = useState(false);
  const [renameGroupModal, setRenameGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [errortext, setErrortext] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteMemberAlert, setShowDeleteMemberAlert] = useState(false);
  const [showDeletePendingMemberAlert, setShowDeletePendingMemberAlert] =
    useState(false);
  const [groupDelete, setgroupDelete] = useState(null);
  const [groupMemberDelete, setgroupMemberDelete] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [groupMemberPendingDelete, setgroupMemberPendingDelete] =
    useState(null);

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
    const singleGroup = {
      groupId: groupId,
      user_key: userKey,
      user_name: userName,
    };

    await dispatch(getGroup(singleGroup)).then(res => {
      if (res.type == 'auth/group/rejected') {
        setErrortext(res.payload);
      } else {
        setGroupName(res.payload.group_name);
      }
    });
  };
  const handleSubmitPress = async groupId => {
    const updateData = {
      group_name: groupName,
      groupId: groupId,
      user_key: userKey,
      user_name: userName,
    };

    await dispatch(updateGroup(updateData)).then(res => {
      if (res.type == 'auth/updateGroup/fulfilled') {
        setGroupName(res.payload.group_name);
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE tbl_groups set g_name=? where serverId=?',
            [groupName, groupId],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('updation success');
              } else console.log('Updation Failed');
            },
          );
        });
        Alert.alert(
          'Success',
          'Group Renamed successfully',
          [
            {
              text: 'Ok',
              onPress: () => props.fetchDataHandler(),
            },
          ],
          {cancelable: false},
        );
        setRenameGroupModal(false);
      }
    });
  };
  const handlegroupDelete = groupDeleteId => {
    setgroupDelete(groupDeleteId);
    setShowDeleteAlert(true);
  };
  const handlegroupMemberDelete = (userid, groupID) => {
    setgroupMemberDelete(userid);
    setGroupId(groupID);
    setShowDeleteMemberAlert(true);
  };
  const handlegroupPendingMemberDelete = (email, groupID) => {
    setgroupMemberPendingDelete(email);
    setGroupId(groupID);
    setShowDeletePendingMemberAlert(true);
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
        const updateData = {
          id: groupDelete,
          uid: userId,
          user_key: userKey,
          user_name: userName,
        };

        setShowDeleteAlert(false);

        dispatch(deleteGroup(updateData)).then(res => {
          if (res.type == 'auth/deleteGroup/rejected') {
            setErrortext(res.payload);
          } else {
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

            db.transaction(tx => {
              tx.executeSql(
                'UPDATE tbl_groups set isDeleted=? where serverId=?',
                [true, groupDelete],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    db.transaction(tx => {
                      tx.executeSql(
                        'UPDATE tbl_groups_users set isDeleted=? where gId=? AND uId =?',
                        [true, groupDelete, userId],
                        (tx, result) => {
                          console.log(
                            'Results groupusers',
                            result.rowsAffected,
                          );
                        },
                      );
                    });
                  } else {
                    console.log('Something is wrong');
                  }
                },
              );
            });
          }
        });
      }
    } catch (error) {}
    setLoading(false);
  };
  const handleMemberDialogCancel = () => {
    setShowDeleteMemberAlert(false);
  };
  const handleMemberDialogOk = () => {
    //Show Loader
    setLoading(true);
    try {
      // if we have division id than its edit mode
      if (groupMemberDelete) {
        const updateData = {
          id: groupId,
          memberid: groupMemberDelete,
          user_key: userKey,
          user_name: userName,
        };

        setShowDeleteMemberAlert(false);

        dispatch(deleteGroupMember(updateData)).then(res => {
          console.log(JSON.stringify(res));
          if (res.type == 'auth/deleteMemberGroup/rejected') {
            setErrortext(res.payload);
          } else {
            Alert.alert('Member Deleted successfully.');
            props.fetchDataHandler();
          }
        });
      }
    } catch (error) {}
    setLoading(false);
  };

  const handleMemberPendingDialogCancel = () => {
    setShowDeletePendingMemberAlert(false);
  };
  const handleMemberPendingDialogOk = () => {
    //Show Loader
    setLoading(true);
    try {
      // if we have division id than its edit mode
      if (groupMemberPendingDelete) {
        const updateData = {
          id: groupId,
          email: groupMemberPendingDelete,
          user_key: userKey,
          user_name: userName,
        };

        setShowDeletePendingMemberAlert(false);

        dispatch(deleteGroupPendingMember(updateData)).then(res => {
          console.log(JSON.stringify(res));
          if (res.type == 'auth/deleteMemberPengingGroup/rejected') {
            setErrortext(res.payload);
          } else {
            Alert.alert('Pending Member Deleted successfully.');
            props.fetchDataHandler();
          }
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
          <Text style={styles.heading}>{props.data.group_name}</Text>
          <View style={styles.buttonArea}>
            <View style={styles.deleteButton}>
              <Dialog.Container visible={showDeleteAlert}>
                <Dialog.Title>Group delete</Dialog.Title>
                <Dialog.Description>
                  Do you want to delete "{props.data.group_name}"?
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
        {props.data.mem_data.length > 0
          ? props.data.mem_data.map(membrData => (
              <View style={styles.members} key={membrData.id}>
                <View style={styles.member}>
                  <View style={styles.profileArea}>
                    {membrData.file_data_new == '' ? (
                      <Image
                        source={{
                          uri: 'https://i.pinimg.com/736x/de/59/4e/de594ec09881da3fa66d98384a3c72ff.jpg',
                        }}
                        style={styles.profile}></Image>
                    ) : (
                      <Image
                        source={{
                          uri: membrData.file_data_new,
                        }}
                        style={styles.profile}></Image>
                    )}
                    <Text style={styles.profileName}>
                      {membrData.firstname + ' ' + membrData.familyname}
                    </Text>
                  </View>

                  <View style={styles.dialogContainer} key={membrData.id}>
                    <Dialog.Container visible={showDeleteMemberAlert}>
                      <Dialog.Title>Delete member</Dialog.Title>
                      <Dialog.Description>
                        Do you really want to delete the member "
                        {membrData.firstname + ' ' + membrData.familyname} (
                        {membrData.email}) from the group{' '}
                        {props.data.group_name}"?
                      </Dialog.Description>
                      <Dialog.Button
                        label="Cancel"
                        onPress={handleMemberDialogCancel}
                        color={COLORS.green}
                        bold="true"
                      />
                      <Dialog.Button
                        label="Yes"
                        onPress={() => handleMemberDialogOk()}
                        color={COLORS.red}
                        bold="true"
                      />
                    </Dialog.Container>
                  </View>
                  <View style={styles.memberDeleteButton} key={membrData.id}>
                    <TouchableOpacity
                      onPress={() =>
                        handlegroupMemberDelete(membrData.id, props.data.id)
                      }
                      key={membrData.id}>
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
                </View>
              </View>
            ))
          : ''}
        {props.data.pending_member.length > 0
          ? props.data.pending_member.map(pendingData => (
              <View style={styles.members} key={pendingData.id}>
                <View style={styles.member}>
                  <View style={styles.pendingArea}>
                    <Text style={styles.pendingText}>
                      These members are not registered, yet:
                    </Text>
                    <View style={styles.pendingMiddleArea}>
                      <Text style={styles.profileName}>
                        {pendingData.email}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dialogContainer}>
                    <Dialog.Container visible={showDeletePendingMemberAlert}>
                      <Dialog.Title>Delete member</Dialog.Title>
                      <Dialog.Description>
                        Do you really want to delete the invitation for friend
                        with email "{pendingData.email} from the group{' '}
                        {props.data.group_name}"?
                      </Dialog.Description>
                      <Dialog.Button
                        label="Cancel"
                        onPress={handleMemberPendingDialogCancel}
                        color={COLORS.green}
                        bold="true"
                      />
                      <Dialog.Button
                        label="Yes"
                        onPress={() => handleMemberPendingDialogOk()}
                        color={COLORS.red}
                        bold="true"
                      />
                    </Dialog.Container>
                  </View>
                  <View style={styles.memberDeleteButton}>
                    <TouchableOpacity
                      onPress={() =>
                        handlegroupPendingMemberDelete(
                          pendingData.email,
                          props.data.id,
                        )
                      }>
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
                </View>
              </View>
            ))
          : ''}
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

export default GroupList;

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
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 23,
    marginHorizontal: 10,
    color: 'black',
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
