import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  TouchableHighlight,
  Alert,
  UIManager,
  RefreshControl,
} from 'react-native';
import moment from 'moment';
import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  songShareAction,
  getAddedSongLists,
  deleteSetlistSongsAction,
  getEventSongsListAction,
  saveSongsOrderListsAction,
} from '../../redux/services/setlistAction';

import {COLORS} from '../../constant/Colors';
import Loader from '../../components/Loader/Loader';
import Icons from 'react-native-vector-icons/MaterialIcons';

import {scale, verticalScale} from '../../components/scale';

import DraggableFlatList from 'react-native-draggable-flatlist';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppButton from '../../components/forms/AppButton';
import SwitchComponent from '../../components/SwitchComponent';
import NetInfo from '@react-native-community/netinfo';
import {getSingleDataModel} from '../../models/setlistModel';

const SongList = ({route}) => {
  const {songId} = route.params;
  console.log('songId++' + songId);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [dataLists, setDataLists] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [errortext, setErrortext] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [addSongsModal, setAddSongsModal] = useState(false);

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [songDelete, setSongDelete] = useState(null);
  const [serverSetlistIDValue, setServerSetlistIDValue] = useState('');

  //offline mode check
  const [mode, setMode] = useState('');

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (songId > 0) {
        const timeout = setTimeout(() => {
          singleItem();
          getNetInfo();
          setLoading(false);
        }, 1000);

        return () => {
          setLoading(false);
          // clears timeout before running the new effect
          clearTimeout(timeout);
        };
      }
      //return () => unsubscribe()
    }, [songId, userKey, userName, userId, mode]),
  );
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (serverSetlistIDValue > 0) {
        const timeout = setTimeout(() => {
          if (mode == 'online') {
            addedSongsList();
          }
          setLoading(false);
        }, 1000);

        return () => {
          setLoading(false);
          // clears timeout before running the new effect
          clearTimeout(timeout);
        };
      }
      //return () => unsubscribe()
    }, [serverSetlistIDValue, userKey, userName, userId, mode]),
  );
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
        // ToastAndroid.showWithGravity(
        //   'Back to online mode now.',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.CENTER,
        // );
        setMode('online');
      } else {
        // ToastAndroid.showWithGravity(
        //   'You are currently offline mode.',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.CENTER,
        // );
        setMode('offline');
      }
    });
  };
  const singleItem = useCallback(async () => {
    setLoading(true);
    if (songId > 0) {
      getSingleDataModel(songId)
        .then(data => {
          setData(data);
          setEventName(data[0].event);
          setEventDate(data[0].event_date);
          setGroupNames(data[0].groups);
          setServerSetlistIDValue(data[0].serverSetlistID);

          setLoading(false);
        })
        .catch(error => console.log(error));
    }
  }, [songId, userName, userKey, userId]); // This is the dependency array

  //check isObjectEmpty
  function isObjectEmpty(object) {
    var isEmpty = true;
    for (keys in object) {
      isEmpty = false;
      break; // exiting since we found that the object is not empty
    }
    return isEmpty;
  }
  // toggle switches
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
  // toggle switches with component return value
  const toggleSwitchNew = (vals, id) => {
    state.switches[id] = vals;
    setState({...state});
  };
  //toggle switches handler
  const toggleSwitchHandler = (isEnabled, groupId) => {
    toggleSwitchNew(isEnabled, groupId);
  };
  const fetchSongsNames = async () => {
    setLoading(true);
    const items = {
      eventid: serverSetlistIDValue,
      user_name: userName,
      user_key: userKey,
    };
    await dispatch(getEventSongsListAction(items)).then(res => {
      if (res.type == 'auth/eventSongsList/rejected') {
        setErrortext(res.payload);
      } else {
        setLoading(false);
        setTableData(res.payload.res_data);
        res.payload.res_data &&
          res.payload.res_data.length > 0 &&
          res.payload.res_data.map((rowData, index) => {
            if (rowData.add_event_song == 1) {
              state.switches[rowData.id] = true;
              state.switches[rowData.state] = true;
              setState({...state});
            } else {
              state.switches[rowData.id] = false;
              state.switches[rowData.state] = false;
              setState({...state});
            }
          });
      }
    });
  };
  const handleSharePress = async () => {
    if (isObjectEmpty(state.switches) == true) {
      Alert.alert('Please choose a Song.');
    } else {
      if (state.switches) {
        var resArray = [];
        Object.entries(state.switches).forEach(([key, value]) => {
          if (value === true) {
            resArray.push(key);
          }
        });
        setLoading(true);
        const shareSong = {
          songs: resArray,
          event_id: serverSetlistIDValue,
          user_name: userName,
          user_key: userKey,
        };

        await dispatch(songShareAction(shareSong)).then(async res => {
          if (res.type == 'auth/songShare/fulfilled') {
            setLoading(false);

            await addedSongsList();
            await fetchSongsNames();
            Alert.alert('Song Added successfully.');
          } else if (res.type == 'auth/songShare/pending') {
            setLoading(true);
          } else {
            setErrortext(
              <Text style={{color: COLORS.themeColor}}>{res.payload}</Text>,
            );
          }
        });
      }
    }
  };
  const openEdit = () => {
    setAddSongsModal(false);
    navigation.navigate('AddSetlistScreen', {itemId: songId});
  };

  const addedSongsList = async () => {
    if (serverSetlistIDValue) {
      let item = {
        sId: serverSetlistIDValue,
        user_name: userName,
        user_key: userKey,
      };

      await dispatch(getAddedSongLists(item)).then(res => {
        if (res.type == 'auth/songlists/rejected') {
          setErrortext(res.payload);
        } else {
          setDataLists(res.payload.res_data);
        }
      });
    }
  };
  const renderItem = ({item, index, drag, isActive, order}) => (
    <TouchableOpacity style={styles.item} onLongPress={drag}>
      <View style={styles.songList}>
        <View
          style={{
            width: '80%',
            height: 30,
            borderColor: COLORS.white,
            borderWidth: 1,
          }}>
          <Text style={styles.itemText}>{item?.song_name}</Text>
        </View>

        <Dialog.Container visible={showDeleteAlert}>
          <Dialog.Title>Song delete</Dialog.Title>
          <Dialog.Description>
            Do you want to delete this Song?
          </Dialog.Description>
          <Dialog.Button
            label="Cancel"
            onPress={handleDialogCancel}
            color={COLORS.red}
            bold="true"
          />
          <Dialog.Button
            label="Yes"
            onPress={() => handleDialogOk()}
            color={COLORS.green}
            bold="true"
          />
        </Dialog.Container>
        <View style={{width: '20%', marginTop: -3, alignItems: 'flex-end'}}>
          <Text onPress={() => deleteItem(item.esid)}>
            {' '}
            <Icons
              name="delete"
              color={COLORS.red}
              style={{
                alignSelf: 'center',
              }}
              size={26}
            />
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  const deleteItem = itemId => {
    setSongDelete(itemId);
    setShowDeleteAlert(true);
  };
  const showSongsModal = async () => {
    await fetchSongsNames();
    setAddSongsModal(true);
  };
  const handleDialogCancel = () => {
    setShowDeleteAlert(false);
  };
  const handleDialogOk = () => {
    //Show Loader
    setLoading(true);
    try {
      // if we have division id than its edit mode
      if (songDelete) {
        setShowDeleteAlert(false);
        setLoading(true);
        const user = {
          event_songid: songDelete,
          user_name: userName,
          user_key: userKey,
        };
        dispatch(deleteSetlistSongsAction(user)).then(res => {
          if (res.type == 'auth/songsDelete/rejected') {
            setErrortext(res.payload);
          } else {
            setLoading(false);
            addedSongsList();
          }
        });
      }
    } catch (error) {
      //console.log(error);
    }
  };
  const closeModal = () => {
    setAddSongsModal(!addSongsModal);
    fetchSongsNames();
  };
  const onDragSaveData = async () => {
    var orderIDS = [];
    dataLists.map(resIDs => {
      orderIDS.push(resIDs.esid);
    });

    let item = {
      event_songs: orderIDS,
      user_name: userName,
      user_key: userKey,
    };

    await dispatch(saveSongsOrderListsAction(item)).then(res => {
      if (res.type == 'auth/saveSongsOrderLists/rejected') {
        setErrortext(res.payload);
      } else {
        setDataLists(res.payload.res_data);
      }
    });
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={addedSongsList}
          horizontal={true}
          contentContinaerStyle={{flexGrow: 1}}
        />
      }
      style={styles.containerOuter}>
      <Loader loading={loading} />
      <View style={styles.screenOuter}>
        <View style={styles.screenInner}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Setlist for Event {eventName}</Text>
          </View>
          <View style={styles.songDetailsOuter}>
            <View style={styles.songDetailsInner}>
              {groupNames ? (
                <Text style={styles.songDetailsText}>Group: {groupNames}</Text>
              ) : (
                ''
              )}
              <Text style={styles.songDetailsText}>
                Date:
                {eventDate
                  ? moment(eventDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
                  : ''}
              </Text>
            </View>

            <View style={styles.editButton}>
              <AppButton
                onPress={() => openEdit()}
                title="Edit"
                backgroundColor={COLORS.saveButtonColor}
              />
            </View>
          </View>
          {mode == 'online' ? (
            <View style={styles.buttonContainer}>
              <AppButton
                onPress={() => showSongsModal()}
                title="Add Songs"
                backgroundColor={COLORS.editButtonColor}
              />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <AppButton
                onPress={() =>
                  Alert.alert(
                    'You are currently not connected to the internet. Please try again later',
                  )
                }
                title="Add Songs"
                backgroundColor={COLORS.editButtonColor}
              />
            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={addSongsModal}
            onRequestClose={() => {
              hideOptionModal();
            }}>
            <ScrollView>
              <View style={styles.shareModalView}>
                <View style={styles.shareModalSub}>
                  <Loader loading={loading} />
                  <View style={styles.buttonCloseOptionContainer}>
                    <TouchableHighlight
                      style={{
                        ...styles.shareModalClose,
                        backgroundColor: COLORS.orange,
                      }}
                      onPress={() => {
                        closeModal();
                      }}>
                      <Icons name="close" size={30} color={COLORS.white} />
                    </TouchableHighlight>
                  </View>
                  <Text style={styles.shareModalHeading}>
                    Added song with...
                  </Text>
                  <View style={styles.songListings}>
                    {tableData &&
                      tableData.length > 0 &&
                      tableData.map((rowData, index) => (
                        <View
                          style={styles.addSongsModalcheckBoxes}
                          key={index}>
                          <Text style={styles.addSongsModalContentText}>
                            {rowData.filename}{' '}
                            {rowData.Interpret ? -rowData.Interpret : ''}
                          </Text>
                          <View style={styles.checkboxContainer}>
                            {rowData.add_event_song == 1 ? (
                              <SwitchComponent
                                item={rowData.id}
                                state={true}
                                value={!!state.switches}
                                onValueChange={toggleSwitchHandler}
                                onChange={toggleSwitch(rowData.id)}
                              />
                            ) : (
                              <SwitchComponent
                                item={rowData.id}
                                value={!!state.switches[rowData.id]}
                                state={false}
                                onValueChange={toggleSwitchHandler}
                                onChange={toggleSwitch(rowData.id)}
                              />
                            )}
                          </View>
                        </View>
                      ))}
                  </View>
                  <View style={[styles.btngrp, styles.shareModalButtons]}>
                    <AppButton
                      onPress={() => {
                        closeModal();
                      }}
                      title="Cancel"
                      backgroundColor={COLORS.cancelButtonColor}
                    />

                    <AppButton
                      onPress={() => handleSharePress()}
                      title="Save"
                      backgroundColor={COLORS.saveButtonColor}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </Modal>
          {dataLists && dataLists.length > 0 ? (
            <View>
              <View style={styles.listDragBox}>
                <DraggableFlatList
                  data={dataLists}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  onDragEnd={({data}) => setDataLists(data)}
                />
              </View>
              {mode == 'online' ? (
                <View style={styles.dragOderBox}>
                  <AppButton
                    onPress={() => {
                      onDragSaveData();
                    }}
                    title="Save"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              ) : (
                ''
              )}
            </View>
          ) : (
            ''
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SongList;

const styles = StyleSheet.create({
  containerOuter: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    width: '100%',
    height: 'auto',
  },
  songList: {
    flex: 1,
    flexDirection: 'row',
  },
  headerText: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 25,
    color: COLORS.textListColorBold,
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
  editButton: {
    alignItems: 'flex-end',
  },
  songDetailsOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  songDetailsInner: {
    width: '70%',
  },
  songDetailsText: {
    color: COLORS.textListColorBold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // start list drag box //
  listDragBox: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: verticalScale(10),
    backgroundColor: COLORS.white,
  },
  item: {
    marginTop: 10,
    paddingTop: 20,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.itemSeperator,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    alignItems: 'center',
  },
  // end list drag box//
  // start modal view //
  songListings: {
    marginTop: 10,
    width: '90%',
    paddingVertical: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 5,
  },
  addSongsModalcheckBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
    justifyContent: 'flex-end',
  },
  addSongsModalContentText: {
    fontSize: 18,
    color: COLORS.textListColorBold,
    marginRight: 5,
    fontWeight: 'bold',
    width: '80%',
  },
  checkboxContainer: {
    width: scale(50),
  },
  contentText: {
    fontSize: 16,
    color: 'black',
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
  shareModalClose: {
    borderRadius: 10,
    padding: 5,
    position: 'relative',
  },
  contents: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  shareModalcheckBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
    justifyContent: 'flex-end',
  },
  shareModalContentText: {
    fontSize: 18,
    color: 'black',
    marginRight: 5,
    fontWeight: 'bold',
  },
  shareModalButtons: {
    marginTop: 20,
  },
  buttons: {
    flexDirection: 'column',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'black',
  },
  button: {
    width: '90%',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 40,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  editModalButton: {
    paddingVertical: 10,
    width: '25%',
    borderRadius: 10,
  },
  editModalButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: 'semibold',
  },
  editModalCancel: {
    backgroundColor: COLORS.red,
  },
  editModalSave: {
    backgroundColor: COLORS.green,
  },
  shareModalView: {
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
    marginTop: verticalScale(150),
    paddingBottom: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  checkBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 15,
  },
  shareModalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textListColorBold,
    marginTop: 30,
    marginHorizontal: 10,
  },
  contentText: {
    fontSize: 16,
    color: 'black',
  },
  buttonCloseOptionContainer: {
    width: '100%',
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btngrp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  // end modal view //
  dragOderBox: {
    padding: 10,
  },
});
