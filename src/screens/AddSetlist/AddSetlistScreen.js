import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import Loader from '../../components/Loader/Loader';
import Icons from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../constant/Colors';
import {scale} from '../../components/scale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import AppButton from '../../components/forms/AppButton';
import {
  createSetListDataModel,
  updateSetListDataModel,
  getSingleEditDataModel,
} from '../../models/setlistModel';
import {
  createSetListServerAPI,
  updateSetListServerAPI,
} from '../../Service/setlistService';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'Songanizeoffline.db'});

const AddSetlistScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {itemId} = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = React.useState(new Date());
  const [dateModal, setdateModal] = useState(false);
  const [eventName, setEventName] = useState('');

  const [loading, setLoading] = useState(false);

  const [setListId, setSetListId] = useState('');
  const [addSongsModal, setAddSongsModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [toggleData, setToggleData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [toggleGroupsData, setToggleGroupsData] = useState([]);

  const [songShare, setSongShare] = useState(false);

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

  //check status mode
  const [mode, setMode] = useState('');

  const [state, setState] = useState({
    switches: {},
  });
  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
    getNetInfo();
  }, [userKey, userName, userId]);

  useEffect(() => {
    if (itemId > 0) {
      setLoading(true);
      const timeout = setTimeout(() => {
        updateData();
        fetchGroupsNames();
        setLoading(false);
      }, 1000);

      return () => {
        setLoading(false);
        // clears timeout before running the new effect
        clearTimeout(timeout);
      };
    } else {
      setLoading(true);
      const timeout = setTimeout(() => {
        fetchGroupsNames();
        setLoading(false);
      }, 1000);

      return () => {
        setLoading(false);
        // clears timeout before running the new effect
        clearTimeout(timeout);
      };
    }
  }, [itemId, userKey, userName, userId]);

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

  const updateData = useCallback(() => {
    if (itemId > 0) {
      setLoading(true);
      getSingleEditDataModel(itemId)
        .then(data => {
          setEventName(data[0].event_name);
          setSelectedDate(
            moment(data[0].date_event, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          );
          setLoading(false);
        })
        .catch(error => console.log(error));
    }
  }, [itemId, userName, userKey, userId]);

  const fetchGroupsNames = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT g.id, g.g_name, g.serverId  FROM tbl_groups_users AS u LEFT JOIN tbl_groups AS g ON u.ufId  = g.id WHERE u.uId = ?  AND u.isDeleted = 0 AND g.isDeleted = 0 ORDER BY g_name ASC',
        [userId],
        (tx, results) => {
          var len = results.rows.length;

          var temp = [];
          if (len > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
          }
          var mergedArry = [];
          var toggleGroupsDataArray = [];
          var toggleGroupIdsDataArray = [];

          if (temp.length > 0) {
            temp.map(gl => {
              toggleGroupsDataArray.push(gl.g_name);
              toggleGroupIdsDataArray.push(gl.serverId);
            });
            const keysFirst = ['group_id'];
            const keysSecond = ['group_name'];

            var toggleGroupsDataArrayDatas = toggleGroupsDataArray.map(gd => {
              const mergedValues = keysSecond.reduce(
                (obj, key, index) => ({
                  ...obj,
                  [key]: gd,
                }),
                {},
              );
              return mergedValues;
            });
            var toggleGroupIdsDataArrayDatas = toggleGroupIdsDataArray.map(
              gi => {
                const mergedKeys = keysFirst.reduce(
                  (obj, key, index) => ({
                    ...obj,
                    [key]: gi,
                  }),
                  {},
                );
                return mergedKeys;
              },
            );
            var mergedArry = toggleGroupsDataArrayDatas.map((it, i) => ({
              ...it,
              ...toggleGroupIdsDataArrayDatas[i],
            }));

            setToggleGroupsData(mergedArry);
            mergedArry.map(gn => {
              Object.entries(gn).forEach(([key, value]) => {
                if (key == 'group_id') {
                  setToggleData(value);
                  if (itemId > 0) {
                    if (key == 'group_name') {
                      setToggleDataName(value);
                    }
                    console.log('fetchgrp' + value);
                    db.transaction(tx => {
                      tx.executeSql(
                        'SELECT * FROM tbl_event_groups WHERE evId= ? AND gId= ? AND isDeleted = 0',
                        [itemId, value],
                        (tx, result) => {
                          var leng = result.rows.length;
                          if (leng > 0) {
                            console.log('group already selected');
                            setSongShare(true);
                            setState(state => ({
                              ...state,
                              switches: {
                                ...state.switches,
                                [value]: !state.switches[value],
                              },
                            }));
                            setToggleData(value);
                            console.log('selected' + JSON.stringify(state));
                          } else {
                            setSongShare(false);
                          }
                        },
                      );
                    });
                  }
                }
              });
            });
          } else {
            console.log('No record found');
          }
        },
      );
    });
  };
  const goToPage = id => {
    navigation.navigate('SongList', {songId: id});
  };
  const handleSubmitPress = async () => {
    if (eventName == '') {
      Alert.alert('Please enter Event Name');
      return false;
    }
    else {
      var resArray = [];
      if (state.switches) {
        Object.entries(state.switches).forEach(([key, value]) => {
          if (value === true) {
            resArray.push(key);
          }
        });
      }
      var nwDt = '';
      if (selectedDate !== null) {
        const selDtArr = selectedDate.split('/');
        nwDt = selDtArr[2] + '-' + selDtArr[1] + '-' + selDtArr[0];
      }

      var eventDate =
        selectedDate === null
          ? moment(new Date(), 'MM/DD/YYYY').format('YYYY-MM-DD')
          : nwDt;
      if (itemId > 0) {
        setLoading(true);

        resArray.map(gid => {
          updateSetListDataModel(userId, eventName, eventDate, itemId, gid)
            .then(data => {
              setSetListId(itemId);
              goToPage(itemId);
              setLoading(false);
            })
            .catch(error => console.log(error));
        });

        setTimeout(() => {
          if (mode === 'online') {
            updateSetListServerAPI(itemId, userKey, userId, userName, dispatch)
              .then(resut => {
                console.log('updateSetListServerAPI' + JSON.stringify(resut));
              })
              .catch(error => console.log(error));
          }
        }, 2000);
      } else {
        setLoading(true);

        createSetListDataModel(userId, eventName, eventDate, resArray)
          .then(data => {
            console.log('createSetListDataModel' + JSON.stringify(data));
            if (mode === 'online') {
              createSetListServerAPI(
                data[0].sid,
                userKey,
                userId,
                userName,
                dispatch,
              )
                .then(resut => {
                  setEditData(data);
                  setSetListId(data[0].sid);
                  goToPage(data[0].sid);
                  setLoading(false);
                })
                .catch(error => console.log(error));
            } else {
              setEditData(data);
              setSetListId(data[0].sid);
              goToPage(data[0].sid);
              setLoading(false);
            }
          })
          .catch(error => console.log(error));
      }
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
  const onChange = selectedDate => {
    const currentDate = selectedDate || date;
    setdateModal(false);
    setSelectedDate(moment(currentDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.outerBox}>
      <View style={styles.screenOuter}>
        <View style={styles.screenInner}>
          <Loader loading={loading} />
          <View style={styles.header}>
            <Text style={styles.headerText}>Add New Setlist</Text>
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>Event</Text>
            <TextInput
              style={styles.textInput}
              value={eventName}
              onChangeText={setEventName}></TextInput>
          </View>
          <View style={styles.groupArea}>
            <Text style={styles.inputText}>Group</Text>
            <View style={styles.switchesButtons}>
              {toggleGroupsData &&
                toggleGroupsData.length > 0 &&
                toggleGroupsData.map((rowData, index) => (
                  <View style={styles.textSwitch} key={index}>
                    <View style={styles.textSwitchName}>
                      <Text style={styles.textSwitchText}>
                        {rowData.group_name}
                      </Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                      {songShare == true ? (
                        <Switch
                          key={rowData.group_id}
                          trackColor={{false: '#767577', true: '#FFA500'}}
                          checked={true}
                          value={state.switches[rowData.group_id]}
                          onValueChange={toggleSwitch(rowData.group_id)}
                          style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
                        />
                      ) : (
                        <Switch
                          key={rowData.group_id}
                          trackColor={{false: '#767577', true: '#FFA500'}}
                          value={!!state.switches[rowData.group_id]}
                          onValueChange={toggleSwitch(rowData.group_id)}
                          style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
                        />
                      )}
                    </View>
                  </View>
                ))}
            </View>
          </View>
          <View style={styles.dateInputView}>
            <Text style={styles.inputText}>Date</Text>
            <View style={styles.inputBoxcalender}>
              <TextInput style={styles.smallInput}>
                <Text style={styles.inputshowDatecalender}>
                  {selectedDate && itemId > 0
                    ? selectedDate
                    : selectedDate
                    ? selectedDate
                    : new Date().toLocaleDateString()}
                </Text>
              </TextInput>
              <View style={styles.calenderArea}>
                <TouchableOpacity
                  style={styles.showcalender}
                  onPress={() => setdateModal(true)}>
                  <Icon name="calendar" color="#FFA500" size={25} />
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={dateModal}
                mode="date"
                minimumDate={new Date('1947-01-01')}
                onConfirm={onChange}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <View style={styles.saveButton}>
            <AppButton
              onPress={() => handleSubmitPress()}
              title="Save"
              backgroundColor={COLORS.saveButtonColor}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={addSongsModal}
            onRequestClose={() => {
              hideOptionModal();
            }}>
            <ScrollView>
              <View style={styles.addSongsModalView}>
                <View style={styles.addSongsModalSub}>
                  <Loader loading={loading} />
                  <View style={styles.buttonCloseOptionContainer}>
                    <TouchableHighlight
                      style={{
                        ...styles.addSongsModalClose,
                        backgroundColor: COLORS.orange,
                      }}
                      onPress={() => {
                        setAddSongsModal(!addSongsModal);
                      }}>
                      <Icons name="close" size={30} color={COLORS.white} />
                    </TouchableHighlight>
                  </View>
                  <Text style={styles.addSongsModalHeading}>
                    Add song to List...
                  </Text>
                  <View style={styles.songListings}>
                    {tableData &&
                      tableData.length > 0 &&
                      tableData.map((rowData, index) => (
                        <View
                          style={styles.addSongsModalcheckBoxes}
                          key={index}>
                          <Text style={styles.addSongsModalContentText}>
                            {rowData.filename}
                          </Text>
                          <View style={styles.checkboxContainer}>
                            <Switch
                              key={rowData.id}
                              thumbColor={COLORS.white}
                              trackColor={{true: 'orange', false: 'grey'}}
                              value={!!state.switches[rowData.id]}
                              onValueChange={toggleSwitch(rowData.id)}
                            />
                          </View>
                        </View>
                      ))}
                  </View>
                  <View style={[styles.btngrp, styles.addSongsModalButtons]}>
                    <TouchableOpacity
                      style={[
                        styles.addSongsModalButton,
                        styles.addSongsModalCancel,
                      ]}
                      onPress={() => {
                        setAddSongsModal(!addSongsModal);
                      }}>
                      <Text style={styles.addSongsModalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.addSongsModalButton,
                        styles.addSongsModalSave,
                      ]}
                      onPress={() => handleSharePress()}>
                      <Text style={styles.addSongsModalButtonText}>Save</Text>
                    </TouchableOpacity>
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

export default AddSetlistScreen;

const styles = StyleSheet.create({
  outerBox: {
    flex: 1,
  },
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
  header: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 20,
    color: COLORS.textListColorBold,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
  },
  dateInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
  },
  addSongsButton: {
    width: '80%',
    borderRadius: 5,
    backgroundColor: '#FE6518',
    height: 45,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 35,
  },
  addSongButtonText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 20,
  },
  saveButton: {
    margin: 20,
    alignItems: 'center',
  },
  textInput: {
    width: '70%',
    padding: 7,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 5,
    color: COLORS.textListColorBold,
    paddingVertical: 4,
  },
  inputText: {
    color: COLORS.textListColorBold,
    fontSize: 16,
    width: '30%',
  },
  inputTextName: {
    color: 'black',
    fontSize: 18,
    padding: 2,
  },
  smallInput: {
    width: '80%',
    padding: 5,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 5,
    color: COLORS.black,
  },
  groupArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  textSwitch: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  textSwitchName: {
    width: '70%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  textSwitchText: {
    color: COLORS.textListColorBold,
    fontSize: 16,
    width: '100%',
  },
  switchesButtons: {
    flexDirection: 'column',
    width: '70%',
  },
  inputBoxcalender: {
    backgroundColor: 'transparent',
    margin: 5,
    flexDirection: 'row',
    width: '70%',
  },
  inputshowDatecalender: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  showcalender: {
    padding: 5,
    width: '100%',
  },
  calenderArea: {
    width: '20%',
    margin: 0,
    padding: 0,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //add songs modal view
  addSongsModalSub: {
    width: '100%',
    height: '100%',
  },
  checkboxContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '30%',
  },
  addSongsModalHeading: {
    fontSize: 25,
    color: COLORS.black,
    marginTop: 30,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  btngrp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  addSongsModalButton: {
    paddingVertical: 10,
    width: '25%',
    borderRadius: 10,
  },
  addSongsModalButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: 'semibold',
  },
  addSongsModalCancel: {
    backgroundColor: COLORS.red,
  },
  addSongsModalSave: {
    backgroundColor: COLORS.green,
  },
  addSongsModalView: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    elevation: 5,
    bottom: 0,
    borderTopColor: COLORS.lightgray,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: scale(80),
    paddingBottom: 20,
    borderRadius: 10,
  },
  addSongsModalClose: {
    borderRadius: 10,
    padding: 5,
    position: 'relative',
  },
  addSongsModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  songListings: {
    width: '90%',
    paddingVertical: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 5,
  },
  shareModalClose: {
    borderRadius: 10,
    padding: 5,
    position: 'relative',
  },
  addSongsModalcheckBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
    justifyContent: 'flex-end',
  },
  addSongsModalButtons: {
    marginTop: 20,
  },
  addSongsModalContentText: {
    fontSize: 18,
    color: 'black',
    marginRight: 5,
    fontWeight: 'bold',
  },
  buttonCloseOptionContainer: {
    width: '100%',
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  // end view modal
});
