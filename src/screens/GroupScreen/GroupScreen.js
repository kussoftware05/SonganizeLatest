import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  Alert,
  TouchableHighlight,
  Switch,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {getGroupLists, getGroups} from '../../redux/services/groupAction';

import GroupList from '../../components/GroupList';
import Loader from '../../components/Loader/Loader';
import {scale, verticalScale} from '../../components/scale';
import {COLORS} from '../../constant/Colors';
import LogoImage from '../../images/logo.png';

import {
  getCheckUsers,
  getSendInvitation,
  inviteExistingGroup,
  inviteNewGroup,
} from '../../redux/services/invitefriendAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addSQLGroups} from '../../util/DBManager';
import NetInfo from '@react-native-community/netinfo';
import AppButton from '../../components/forms/AppButton';
import GroupListOffline from '../../components/GroupListOffline';
import {
  updateGroupServerAPI,
  updateEditGroupServerAPI,
  deleteGroupServerAPI,
} from '../../Service/groupService';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'Songanizeoffline.db'});

const GroupScreen = () => {
  const dispatch = useDispatch();

  var inviteMsg = 'Hi,it would be nice to meet you on songanize.com.';

  const [groupModal, setGroupModal] = useState(false);
  const [inviteGroupModal, setInviteGroupModal] = useState(false);
  const [inviteFriendModal, setInviteFriendModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [email, setEmail] = useState('');
  const [sendEmail, setSendEmail] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');
  const [tableData, setTableData] = useState([]);
  const [sqlGroupsData, setSqlGroupsData] = useState([]);

  const [mergeGroupMembrData, setMergeGroupMembrData] = useState([]);
  const [errortext, setErrortext] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [inviteMessageModal, setInviteMessageModal] = useState(false);

  const [inviteModalFlag, setInviteModalFlag] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(inviteMsg);
  const [inviteMsgModalTitle, setInviteMsgModalTitle] = useState('');
  const [inviteMessageModalFlag, setInviteMessageModalFlag] = useState('');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [songShare, setSongShare] = useState(false);
  const [userAddedToGroups, setUserAddedToGroups] = useState([]);

  const [mode, setMode] = useState('');
  const [offlinemodeMessage, setOfflinemodeMessage] = useState('');

  const [state, setState] = useState({
    switches: {},
  });

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
    getNetInfo();
  }, []);

  useEffect(() => {
    getNetInfo();
    if (mode == 'online') {
      const timeout = setTimeout(async () => {
        await updateGroupServerAPI(userKey, userId, userName, dispatch);
        await updateEditGroupServerAPI(userKey, userId, userName, dispatch);
        await deleteGroupServerAPI(userKey, userId, userName, dispatch);
      }, 1000);

      const timeout1 = setTimeout(async () => {
        await fetchGroupsNames();
      }, 2000);

      return () => {
        // clears timeout before running the new effect
        clearTimeout(timeout);
        clearTimeout(timeout1);
      };
    } else {
      const timeout = setTimeout(async () => {
        fetchDataFromLocaldatabase();
      }, 1000);

      return () => {
        // clears timeout before running the new effect
        clearTimeout(timeout);
      };
    }
  }, [userKey, userName, userId, mode]);

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

  const hideGroupModal = () => {
    setGroupName('');
    setGroupModal(!groupModal);
    // setGroupModal(false);
  };
  const handleSubmitPress = async () => {
    if (groupName == '') {
      Alert.alert('Please enter Group Name');
      return false;
    }
    if (mode == 'offline') {
      addSQLGroups(0, userId, userId, groupName, 0, new Date().toISOString());

      Alert.alert(
        'Success',
        'Group created successfully',
        [
          {
            text: 'Ok',
            onPress: () => fetchDataFromLocaldatabase(),
          },
        ],
        {cancelable: false},
      );
      setGroupName('');
      setGroupModal(false);
    } else if (mode == 'online') {
      addSQLGroups(0, userId, userId, groupName, 0, new Date().toISOString());

      await updateGroupServerAPI(userKey, userId, userName, dispatch);
    }
  };

  const handleCheckPress = () => {
    if (email == '') {
      Alert.alert('Please enter Friend Email-id');
      return false;
    }
    if (userId) {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          // ToastAndroid.showWithGravity(
          //   'Back to online mode.',
          //   ToastAndroid.SHORT,
          //   ToastAndroid.CENTER,
          // );
          const user = {
            email_id: email,
            //userId: userId,
            user_name: userName,
            user_key: userKey,
          };
          dispatch(getCheckUsers(user)).then(res => {
            console.log('checkUsers' + JSON.stringify(res));
            if (res.type == 'auth/checkUsers/rejected') {
              setErrortext(res.payload);
            } else {
              setTableData(res.payload);
              setRegisterStatus(res.payload.register_status);
              setLoading(false);
              if (res.payload.register_status == '') {
                setEmail('');
                setInviteModal(false);
                setSendEmail(res.payload.invite_email);
                setUserFirstName(res.payload.first_name);
                //setInviteMessage(...inviteMessage, ...userFirstName)
                setInviteFriendModal(true);
              } else {
                setEmail('');
                setInviteModal(false);
                setSendEmail(res.payload.invite_email);
                setUserFirstName(res.payload.first_name);

                //setUserAddedToGroups(res.payload.friend_groups);
                // setUserAddedToGroups([{"groupid":"629"},{"groupid":"632"},{"groupid":"613"}])
                // if(res.payload.friend_groups)
                // {
                //   // res.payload.friend_groups.map((frndGrps)=>{
                //   //   setUserAddedToGroups(frndGrps.groupid)
                //   // })
                //   setUserAddedToGroups(res.payload.friend_groups)
                // }
                //setInviteMessage({...inviteMessage, ...userFirstName})
                setInviteGroupModal(true);
              }
            }
          });
        } else {
          setOfflinemodeMessage(
            'You are currently not connected to the internet. Please try again later',
          );
        }
      });
    }
  };
  const fetchAllGroups = () => {
    const groupsChecked = {
      email: sendEmail,
      user_name: userName,
      user_key: userKey,
    };
    dispatch(getGroups(groupsChecked)).then(res => {
      console.log('groupsAll' + JSON.stringify(res));
      if (res.type == 'auth/groupsAll/rejected') {
        setErrortext(res.payload);
      } else {
        if (res.payload.res_data) {
          setUserAddedToGroups(res.payload.res_data);
        }
      }
    });
  };
  const handleExistShare = () => {
    fetchAllGroups();
    setInviteGroupModal(false);
    setShareModal(true);
  };
  const openGroupModal = flag => {
    if (flag == 'invite') {
      setInviteGroupModal(false);
      setInviteModalFlag(true);
      setGroupModal(true);
    } else {
      setInviteModalFlag(false);
      setGroupModal(true);
    }
  };
  const toggleSwitch = useCallback(
    id => () =>
      setState(state => ({
        ...state,
        switches: {
          ...state.switches,
          [id]: !state.switches[id],
        },
      })),
    [],
  );
  const handleInviteMessage = type => {
    fetchGroupsNames();
    if (type == 'just') {
      setInviteMsgModalTitle('Send invitation');
      setInviteMessageModalFlag(type);
      setInviteFriendModal(false);
      setInviteMessageModal(true);
    } else if (type == 'existing') {
      setInviteMsgModalTitle('Send invitation to selected groups');
      setInviteMessageModalFlag(type);
      setInviteFriendModal(false);
      setInviteMessageModal(true);
    } else {
      setInviteMsgModalTitle('Send invitation to new group');
      setInviteMessageModalFlag(type);
      setInviteFriendModal(false);
      setInviteMessageModal(true);
    }
  };
  const handleMessageSent = () => {
    setInviteMessageModal(false);
    const user = {
      invite_email: sendEmail,
      user_name: userName,
      user_key: userKey,
      message_from_user: inviteMsg,
    };
    dispatch(getSendInvitation(user)).then(res => {
      if (res.type == 'auth/sendInvitation/rejected') {
        setErrortext(res.payload);
      } else {
        Alert.alert('Thank you. The message was sent successfully.');
        fetchGroupsNames();
      }
    });
  };
  const fetchGroupsNames = async () => {
    setLoading(true);
    const user = {
      user_key: userKey,
      user_name: userName,
    };

    await dispatch(getGroupLists(user)).then(res => {
      if (res.type == 'auth/grouplist/rejected') {
        setErrortext(res.payload);
        setLoading(false);
      } else {
        if (res.payload) {
          setLoading(false);
          setMergeGroupMembrData(res.payload.res_data);
        }
      }
    });
  };
  const fetchDataFromLocaldatabase = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT g.id, g.g_name  FROM tbl_groups_users AS u LEFT JOIN tbl_groups AS g ON u.ufId  = g.id WHERE u.uId = ?  AND u.isDeleted = 0 AND g.isDeleted = 0 ORDER BY g_name ASC',
        [userId],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            setSqlGroupsData(temp);
            setMergeGroupMembrData(temp);
          }
        },
      );
    });
  };
  //check isObjectEmpty
  function isObjectEmpty(object) {
    var isEmpty = true;
    for (keys in object) {
      isEmpty = false;
      break; // exiting since we found that the object is not empty
    }
    return isEmpty;
  }
  const handleInviteExistingGroup = usertype => {
    if (isObjectEmpty(state.switches) == true && songShare == false) {
      Alert.alert('Please choose a group');
    } else {
      if (state.switches) {
        var resArray = [];
        Object.entries(state.switches).forEach(([key, value]) => {
          if (value === true) {
            resArray.push(key);
          }
        });
        if (registerStatus == '' || registerStatus == '0') {
          const userMail = {
            invite_email: sendEmail,
            user_name: userName,
            user_key: userKey,
            message_from_user: inviteMsg,
          };

          dispatch(getSendInvitation(userMail)).then(res => {
            if (res.type == 'auth/sendInvitation/rejected') {
              setErrortext(res.payload);
            } else {
              fetchGroupsNames();
              console.log('mail sent successfully by API');
            }
          });
        }
        resArray.map(sg => {
          var gidArray = [];
          gidArray.push(sg);

          const user = {
            user_name: userName,
            user_key: userKey,
            invite_email: sendEmail,
            groups: gidArray,
          };

          dispatch(inviteExistingGroup(user)).then(res => {
            if (res.type == 'auth/innviteExistGroup/rejected') {
              setErrortext(res.payload);
            } else {
              if (usertype == 'exist') {
                setShareModal(false);
              } else {
                setInviteMessageModal(false);
              }
              Alert.alert('Your friend was added to the groups you selected.');
              fetchGroupsNames();
            }
          });
        });
      }
    }
  };
  const handleInviteNewGroup = usertype => {
    if (groupName == '') {
      Alert.alert('Please enter Group Name');
      return false;
    }
    if (registerStatus == '' || registerStatus == '0') {
      const userMail = {
        invite_email: sendEmail,
        user_name: userName,
        user_key: userKey,
        message_from_user: inviteMsg,
      };

      dispatch(getSendInvitation(userMail)).then(res => {
        if (res.type == 'auth/sendInvitation/rejected') {
          setErrortext(res.payload);
        } else {
          fetchGroupsNames();
          console.log('mail sent successfully by API');
        }
      });
    }
    const user = {
      user_name: userName,
      user_key: userKey,
      invite_email: sendEmail,
      group_name: groupName,
    };

    dispatch(inviteNewGroup(user)).then(res => {
      if (res.type == 'auth/invitenewgroup/rejected') {
        setErrortext(res.payload);
      } else {
        if (usertype == 'exist') {
          setShareModal(false);
        } else {
          setInviteMessageModal(false);
        }

        Alert.alert('Your friend was added to the new group.');
        fetchGroupsNames();
      }
    });
  };

  return (
    <ScrollView
      style={styles.screenOuter}
      refreshControl={<RefreshControl refreshing={isRefreshing} />}>
      <View style={styles.screenInner}>
        <Loader loading={loading} />
        <Text style={styles.heading}>Groups</Text>
        <Pressable
          style={styles.inviteButton}
          onPress={() => setInviteModal(true)}>
          <Text style={styles.inviteText}>invite a friend</Text>
          <Image source={LogoImage} style={styles.buttonLogo} />
        </Pressable>
        <Pressable
          style={styles.createButton}
          onPress={() => openGroupModal('create')}>
          <Text style={styles.createText}>create a group</Text>
        </Pressable>
        <View style={styles.underline}></View>
        {mode == 'online'
          ? mergeGroupMembrData &&
            mergeGroupMembrData.map((rowData, index) => (
              <GroupList
                data={rowData}
                key={index}
                fetchDataHandler={fetchGroupsNames}
              />
            ))
          : mergeGroupMembrData &&
            mergeGroupMembrData.map((rowData, index) => (
              <GroupListOffline
                data={rowData}
                key={index}
                fetchDataHandler={fetchDataFromLocaldatabase}
              />
            ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={groupModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            hideGroupModal();
          }}
          style={styles.modalContainer}>
          <View style={styles.centeredView}>
            <Loader loading={loading} />
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {' '}
                {inviteModalFlag ? 'Add friend to new group' : 'Create a group'}
              </Text>
              <View style={styles.buttonCloseOptionContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.shareModalClose,
                    backgroundColor: COLORS.orange,
                  }}
                  onPress={() => hideGroupModal()}>
                  <Icons name="close" size={30} color={COLORS.white} />
                </TouchableHighlight>
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
              {inviteModalFlag ? (
                <View style={styles.modelSend}>
                  <View style={styles.saveButton}>
                    <AppButton
                      onPress={() => handleInviteNewGroup('exist')}
                      title="Send"
                      backgroundColor={COLORS.saveButtonColor}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.modelButtons}>
                  <View style={styles.cancelButton}>
                    <AppButton
                      onPress={() => hideGroupModal()}
                      title="Cancel"
                      backgroundColor={COLORS.cancelButtonColor}
                    />
                  </View>
                  <View style={styles.saveButton}>
                    <AppButton
                      onPress={() => handleSubmitPress()}
                      title="Save"
                      backgroundColor={COLORS.saveButtonColor}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={inviteModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setInviteModal(!inviteModal);
          }}
          style={styles.modalContainer}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Invite a friend</Text>
              <View style={styles.buttonCloseOptionContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.shareModalClose,
                    backgroundColor: COLORS.orange,
                  }}
                  onPress={() => setInviteModal(!inviteModal)}>
                  <Icons name="close" size={30} color={COLORS.white} />
                </TouchableHighlight>
              </View>
              <View style={styles.friendInviteModal}>
                <Text style={styles.inputText}>mail to friend:</Text>
                <TextInput
                  style={styles.inviteModalInput}
                  value={email}
                  onChangeText={setEmail}></TextInput>
              </View>
              <Text style={styles.inviteModalText}>
                In first step songanize checks if your friend is already
                registered
              </Text>
              {offlinemodeMessage ? (
                <Text style={styles.inviteModalTextMessage}>
                  {offlinemodeMessage}
                </Text>
              ) : (
                ''
              )}
              <View style={styles.inviteModalButtons}>
                <View style={styles.cancelButton}>
                  <AppButton
                    onPress={() => setInviteModal(!inviteModal)}
                    title="Cancel"
                    backgroundColor={COLORS.cancelButtonColor}
                  />
                </View>
                <View style={styles.saveButton}>
                  <AppButton
                    onPress={() => handleCheckPress()}
                    title="Check"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={inviteGroupModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setInviteGroupModal(!inviteGroupModal);
          }}>
          <View style={styles.centeredView}>
            <Loader loading={loading} />
            <View style={styles.inviteModalContainer}>
              <Text style={styles.modalInviteHead}>
                Hey, your friend is registered already. Great! You have the
                following options:
              </Text>
              <View style={styles.buttonCloseOptionContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.shareModalClose,
                    backgroundColor: COLORS.orange,
                  }}
                  onPress={() => setInviteGroupModal(!inviteGroupModal)}>
                  <Icons name="close" size={30} color={COLORS.white} />
                </TouchableHighlight>
              </View>
              <Pressable style={styles.inviteButtons}>
                <Text
                  style={styles.modalButtonText}
                  onPress={() => setInviteGroupModal(!inviteGroupModal)}>
                  Ok, Thanks!
                </Text>
              </Pressable>
              <Pressable style={styles.inviteButtons}>
                <Text
                  style={styles.modalButtonText}
                  onPress={() => handleExistShare(userAddedToGroups)}>
                  Add to existing group
                </Text>
              </Pressable>
              <Pressable style={styles.inviteButtons}>
                <Text
                  style={styles.modalButtonText}
                  onPress={() => openGroupModal('invite')}>
                  Add to new group
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={inviteFriendModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setInviteFriendModal(!inviteFriendModal);
          }}>
          <View style={styles.centeredView}>
            <Loader loading={loading} />
            <View style={styles.inviteModalContainer}>
              <Text style={styles.modalInviteHead}>
                Thank you for promoting songanize. Your options are:
              </Text>
              <View style={styles.buttonCloseOptionContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.shareModalClose,
                    backgroundColor: COLORS.orange,
                  }}
                  onPress={() => setInviteFriendModal(!inviteFriendModal)}>
                  <Icons name="close" size={30} color={COLORS.white} />
                </TouchableHighlight>
              </View>
              <Pressable style={styles.inviteButtons}>
                <Text
                  style={styles.modalButtonText}
                  onPress={() => handleInviteMessage('just')}>
                  Just invite to songanize
                </Text>
              </Pressable>
              <Pressable style={styles.inviteButtons}>
                <Text
                  style={styles.modalButtonText}
                  onPress={() => handleInviteMessage('existing')}>
                  Add to existing group
                </Text>
              </Pressable>
              <Pressable style={styles.inviteButtons}>
                <Text
                  style={styles.modalButtonText}
                  onPress={() => handleInviteMessage('new')}>
                  Add to new group
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={inviteMessageModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setInviteMessageModal(!inviteMessageModal);
          }}>
          <View style={styles.centeredView}>
            <Loader loading={loading} />
            <View style={styles.inviteMessageModalContainer}>
              <Text style={styles.modalInviteHead}>{inviteMsgModalTitle}</Text>
              <View style={styles.buttonCloseOptionContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.shareModalClose,
                    backgroundColor: COLORS.orange,
                  }}
                  onPress={() => setInviteMessageModal(!inviteMessageModal)}>
                  <Icons name="close" size={35} color={COLORS.white} />
                </TouchableHighlight>
              </View>
              {/* condition start */}
              {inviteMessageModalFlag == 'existing' ? (
                <View style={styles.invitContent}>
                  {mergeGroupMembrData &&
                    mergeGroupMembrData.map((rowData, index) => (
                      <View style={styles.shareModalcheckBoxes} key={index}>
                        <Text style={styles.shareModalContentText}>
                          {rowData.group_name}
                        </Text>
                        <View style={styles.checkboxContainer}>
                          {songShare == true ? (
                            <Switch
                              key={rowData.id}
                              trackColor={{false: '#767577', true: '#FFA500'}}
                              checked={songShare}
                              value={!!state.switches}
                              onValueChange={toggleSwitch(rowData.id)}
                            />
                          ) : (
                            <Switch
                              key={rowData.id}
                              trackColor={{false: '#767577', true: '#FFA500'}}
                              value={!!state.switches[rowData.id]}
                              onValueChange={toggleSwitch(rowData.id)}
                            />
                          )}
                        </View>
                      </View>
                    ))}
                </View>
              ) : inviteMessageModalFlag == 'new' ? (
                <View style={styles.modalTextInputArea}>
                  <Text style={styles.textColor}>
                    me of group/band/chair/class:
                  </Text>
                  <TextInput
                    style={styles.modalTextInput}
                    value={groupName}
                    onChangeText={setGroupName}></TextInput>
                </View>
              ) : (
                ''
              )}
              {/* condition end */}
              <View style={styles.messageBox}>
                <Text style={styles.message}>Message:</Text>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Type something"
                    placeholderTextColor="grey"
                    numberOfLines={6}
                    multiline={true}
                    onChangeText={setInviteMessage}
                    value={inviteMessage}
                  />
                </View>
              </View>
              <Text style={styles.message}>
                Your friend receives an email with your message, a description
                of songanize and a link to register.
              </Text>
              {inviteMessageModalFlag == 'existing' ? (
                <View style={styles.shareModalButtons}>
                  <AppButton
                    onPress={() => handleInviteExistingGroup('new')}
                    title="Send"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              ) : inviteMessageModalFlag == 'new' ? (
                <View style={styles.shareModalButtons}>
                  <AppButton
                    onPress={() => handleInviteNewGroup('new')}
                    title="Send"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              ) : (
                <View style={styles.shareModalButtons}>
                  <AppButton
                    onPress={() => handleMessageSent()}
                    title="Send"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={shareModal}
          onRequestClose={() => {
            hideOptionModal();
          }}>
          <ScrollView>
            <View style={styles.shareModalView}>
              <View style={styles.shareModalSub}>
                <Loader loading={loading} />
                <View style={styles.buttonCloseBtnContainer}>
                  <TouchableHighlight
                    style={{
                      ...styles.shareModalClose,
                      backgroundColor: COLORS.orange,
                    }}
                    onPress={() => {
                      setShareModal(!shareModal);
                    }}>
                    <Icons name="close" size={30} color={COLORS.white} />
                  </TouchableHighlight>
                </View>
                <Text style={styles.shareModalHeading}>
                  Add friend to selected groups
                </Text>
                {userAddedToGroups &&
                  userAddedToGroups.map((rowData, index) => (
                    <View style={styles.content}>
                      <View style={styles.shareModalcheckBoxes} key={index}>
                        <Text style={styles.shareModalContentText}>
                          {rowData.group_name}
                        </Text>
                        <View style={styles.checkboxContainer}>
                          {rowData.user_added_to_group == 1 ? (
                            <Switch
                              key={rowData.group_id}
                              trackColor={{false: '#767577', true: '#FFA500'}}
                              checked={true}
                              value={!!state.switches}
                              onValueChange={toggleSwitch(rowData.group_id)}
                            />
                          ) : (
                            <Switch
                              key={rowData.group_id}
                              trackColor={{false: '#767577', true: '#FFA500'}}
                              value={!!state.switches[rowData.group_id]}
                              onValueChange={toggleSwitch(rowData.group_id)}
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                <View style={styles.shareModalButtons}>
                  <AppButton
                    onPress={() => handleInviteExistingGroup('exist')}
                    title="Send"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  screenOuter: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  screenInner: {
    flex: 1,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heading: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 25,
    color: COLORS.textListColorBold,
  },
  createButton: {
    paddingVertical: 10,
    width: scale(185),
    height: verticalScale(38),
    backgroundColor: COLORS.saveButtonColor,
    textAlign: 'center',
    color: COLORS.white,
    textTransform: 'lowercase',
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  createText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 18,
  },
  underline: {
    borderBottomWidth: 1,
    width: '100%',
    height: 1,
    borderColor: COLORS.gray,
    marginTop: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bigBrandArea: {
    width: '100%',
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
    backgroundColor: 'red',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: 'orange',
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
    width: '70%',
    marginVertical: 20,
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
    height: 50,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'semibold',
    marginLeft: 5,
  },
  memberDeleteButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: '30%',
    paddingVertical: 5,
  },
  profileRemove: {
    fontSize: 15,
    fontWeight: 'semibold',
    textAlign: 'center',
    color: 'white',
  },
  modalContainer: {
    width: '80%',
  },
  inviteModalContainer: {
    //marginTop: scale(70),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: scale(320),
    height: verticalScale(320),
    elevation: 5,
    overflow: 'hidden',
  },
  modalInviteHead: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: verticalScale(250),
    width: '90%',
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
  },
  textColor: {
    fontSize: 16,
    color: COLORS.textListColorBold,
  },
  modalTextInput: {
    height: 35,
    borderWidth: 1,
    borderColor: 'black',
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
  modelSend: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    marginTop: 50,
  },
  cancelButton: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
  },
  inviteButtons: {
    width: scale(150),
    backgroundColor: COLORS.saveButtonColor,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  modalButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    alignSelf: 'center',
    color: COLORS.white,
    fontSize: 28,
  },
  inviteButton: {
    width: scale(185),
    height: verticalScale(38),
    borderRadius: 10,
    backgroundColor: COLORS.black,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonLogo: {
    width: 25,
    height: 25,
    position: 'absolute',
    right: 15,
  },
  friendInviteModal: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    color: COLORS.black,
    fontSize: 16,
  },
  inviteModalInput: {
    width: 200,
    borderWidth: 1,
    borderColor: COLORS.black,
    marginLeft: 10,
    borderRadius: 5,
    padding: 5,
    paddingVertical: 2,
  },
  inviteModalText: {
    color: COLORS.black,
    fontSize: 16,
    marginTop: 20,
  },
  inviteModalTextMessage: {
    color: COLORS.red,
    fontSize: 15,
    marginTop: 10,
  },
  inviteModalButton: {
    paddingVertical: 10,
    borderRadius: 15,
  },
  inviteModalButtons: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginTop: 30,
  },
  shareModalView: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    elevation: 5,
    bottom: 0,
    borderTopColor: COLORS.lightgray,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: scale(250),
    paddingBottom: 20,
    borderRadius: 10,
  },
  shareModalcheckBoxes: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#B8B8B8',
  },
  shareModalContentText: {
    fontSize: 22,
    color: 'black',
    marginRight: 5,
    fontWeight: 'bold',
  },
  shareModalButtons: {
    marginTop: 20,
    padding: 10,
  },
  shareModalSub: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '90%',
    paddingVertical: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 5,
  },
  invitContent: {
    width: scale(300),
    paddingVertical: 10,
    gap: 5,
  },
  checkboxContainer: {
    width: scale(60),
  },
  shareModalClose: {
    borderRadius: 10,
    padding: 5,
    position: 'relative',
  },
  buttonCloseOptionContainer: {
    width: '100%',
    position: 'absolute',
    left: scale(18),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonCloseBtnContainer: {
    width: '100%',
    position: 'absolute',
    left: scale(0),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  shareModalHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 30,
    marginHorizontal: 10,
  },
  shareModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  editModalButton: {
    paddingVertical: 10,
    width: scale(60),
    borderRadius: 10,
  },
  editModalSave: {
    backgroundColor: COLORS.green,
  },
  inviteMessageModalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: scale(350),
    elevation: 5,
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  textAreaContainer: {
    borderColor: COLORS.black,
    borderWidth: 1,
    padding: 5,
    width: scale(180),
    height: verticalScale(100),
  },
  messageBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    textAlign: 'left',
    marginTop: verticalScale(10),
  },
  message: {
    fontSize: 16,
    color: COLORS.textListColorBold,
  },
  textArea: {
    flex: 1,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
});
