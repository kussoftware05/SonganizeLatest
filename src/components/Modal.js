import React, {useState, useCallback, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../constant/Colors';
import Loader from '../components/Loader/Loader';
import {scale, verticalScale} from '../components/scale';

import DropDownPicker from 'react-native-dropdown-picker';
import {useDispatch} from 'react-redux';
import {
  groupShareAction,
  getSongGroupsAction
} from '../redux/services/songanizeAction';

import Dialog from 'react-native-dialog';

import RNFS from 'react-native-fs';
import YoutubePlayer from 'react-native-youtube-iframe';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchComponent from './SwitchComponent';
import AppButton from './forms/AppButton';
import NetInfo from '@react-native-community/netinfo';
import {
  updateSongsDataModel,
  deleteSongsDataModel
} from '../models/songanizeModel';
import {
  updateEditSongsServerAPI,
  deleteSongsServerAPI,
  updateHiddenSongsServerAPI,
  removeHiddenSongsServerAPI
} from '../Service/songsService';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'Songanizeoffline.db'});

const Popup = ({
  modalVisible,
  setModalVisible,
  activeItem,
  titleEdit,
  interpreetEdit,
  typeEdit,
  byEdit,
  linkEdit,
  filenameEdit,
  writerEdit,
  categoryEdit,
  genreEdit,
  keyEdit,
  itemId,
  fcode,
  fsharedSong,
  fhiddenFileId,
  fhidden_song,
  fgroupId,
  ffirstname,
  flastname,
  serverSGID,
  tableData,
  refreshData,
}) => {
  const dispatch = useDispatch();

  const [editModal, setEditModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState([
    {label: 'Lyrics', value: 'Lyrics'},
    {label: 'Chords', value: 'Chords'},
    {label: 'Tabs', value: 'Tabs'},
    {label: 'Notes', value: 'Notes'},
    {label: 'Other', value: 'Other'},
  ]);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [titleData, setTitleData] = useState('');
  const [interpreet, setInterpreet] = useState('');
  const [writterBy, setWrittenBy] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState('');
  const [fileType, setFileType] = useState('');
  const [generate, setGenerate] = useState('');
  const [file, setFile] = useState('');
  const [fileCode, setFileCode] = useState('');
  const [userFirstname, setUserFirstname] = useState('');
  const [userLastname, setUserLastname] = useState('');

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [songDelete, setSongDelete] = useState(null);

  const [toggleGroupsList, setToggleGroupsList] = useState([]);

  const [mode, setMode] = useState('');
  const [serverID, setServerID] = useState('');

  const [state, setState] = useState({
    switches: {},
  });
  const [toggleVal, setToggleVal] = useState({});

  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState();

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
    getNetInfo();
  }, [userKey, userName, userId]);

  useEffect(() => {
    setValuestoField();
  }, [itemId]);

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
      if (state.isConnected == false) {
        setMode('offline');
      } else {
        setMode('online');
      }
    });
  };
  const setValuestoField = () => {
    setTitleData(titleEdit);
    if (linkEdit) {
      setYoutubeLink(linkEdit);
      setYoutubeVideoId(
        linkEdit.replace('https://www.youtube.com/watch?v=', ''),
      );
    }
    setInterpreet(interpreetEdit);
    setKey(keyEdit);
    setWrittenBy(writerEdit);
    setFile(filenameEdit);
    setFileType(typeEdit);
    setType(categoryEdit);
    setGenerate(genreEdit);
    setFileCode(fcode);
    setUserFirstname(ffirstname);
    setUserLastname(flastname);
  };

  const hideEditModal = () => {
    setLoading(false);
    setEditModal(false);
    tableData;
    refreshData();
  };
  const hideInfoModal = () => {
    setLoading(false);
    setInfoModal(false);
    tableData;
    refreshData();
  };
  const showEditModal = itemId => {
    setModalVisible(false);
    setEditModal(true);

    setTitleData(titleEdit);
    setYoutubeLink(linkEdit);
    setInterpreet(interpreetEdit);
    setKey(keyEdit);
    setWrittenBy(writerEdit);
    setFile(filenameEdit);
    setFileType(typeEdit);
    setType(categoryEdit);
    setGenerate(genreEdit);
    setFileCode(fcode);
  };

  const showInfoModal = itemId => {
    setModalVisible(false);
    setInfoModal(true);

    setTitleData(titleEdit);
    setYoutubeLink(linkEdit);
    setInterpreet(interpreetEdit);
    setKey(keyEdit);
    setWrittenBy(writerEdit);
    setFile(filenameEdit);
    setFileType(typeEdit);
    setType(categoryEdit);
    setGenerate(genreEdit);
  };

  const handleSubmitPress = () => {
    setEditLoading(true);

    try {
      // if we have division id than its edit mode
      if (itemId) {
        updateSongsDataModel(
          titleData,
          interpreet,
          youtubeLink,
          writterBy,
          generate,
          file,
          type,
          key,
          itemId,
        )
          .then(data => {
            if (mode === 'online') {
              updateEditSongsServerAPI(
                titleData,
                interpreet,
                youtubeLink,
                writterBy,
                generate,
                file,
                type,
                key,
                itemId,
                userKey,
                userId,
                userName,
                dispatch,
              )
                .then(resut => {
                  setEditLoading(false);
                  Alert.alert(
                    'Alert',
                    'You have successfully Updated.',
                    [{text: 'OK', onPress: () => refreshData()}],
                    {cancelable: false},
                  );
                })
                .catch(error => console.log(error));
            } else {
              setEditLoading(false);
              Alert.alert(
                'Alert',
                'You have successfully Updated.',
                [{text: 'OK', onPress: () => refreshData()}],
                {cancelable: false},
              );
            }
          })
          .catch(error => console.log(error));
      }
    } catch (error) {
      console.log('message' + error);
    }
  };
  const showShareModal = async () => {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_files WHERE id  =?',
          [itemId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              setServerID(temp[0].serverSGId);
            }
          },
        );
      },
      function (error) {
        reject(undefined);
        throw new Error('error: ' + error.message);
      },
      function () {
        console.log('ok');
      },
    );

    fetchGroupsNames();

    setModalVisible(false);
    setShareModal(true);
  };
  const fetchGroupsNames = async () => {
    console.log('setServerID--' + serverID);
    setLoading(true);
    const item = {
      user_name: userName,
      user_key: userKey,
      songid: serverID,
    };

    await dispatch(getSongGroupsAction(item)).then(res => {
      setLoading(false);

      if (res.type == 'auth/getSongGroups/rejected') {
        setErrortext(res.payload);
      } else {
        if (res.payload.group_data && res.payload.group_data.length > 0) {
          setToggleGroupsList(res.payload.group_data);
          res.payload.group_data &&
            res.payload.group_data.length > 0 &&
            res.payload.group_data.map((rowData, index) => {
              if (rowData.shared_to_group == 1) {
                state.switches[rowData.group_id] = true;
                setState({...state});
              }
            });
        }
      }
    });
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
  const toggleSwitchNew = (vals, id) => {
    state.switches[id] = vals;
    setState({...state});
  };

  const toggleSwitchHandler = (isEnabled, groupId) => {
    toggleSwitchNew(isEnabled, groupId);
  };
  const handleSongDelete = (songDelete, fcode) => {
    setSongDelete(songDelete);
    setShowDeleteAlert(true);
  };
  const handleHiddenSong = (itemId, serverSGID) => {
    
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_files_hidden where ufhId = ?',
        [itemId],
        (tx, results) => {
          var leng = results.rows.length;

          if (leng == 0) {
            let sql =
              'INSERT INTO tbl_user_files_hidden (ufhId, uId, file_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?)';
            let params = [itemId, userId, serverSGID, 0, new Date().toISOString()]; //storing user data in an array

            db.executeSql(
              sql,
              params,
              result => {
                console.log(
                  'file hidden in local successfully' + JSON.stringify(result),
                );
                if (mode === 'online') {
                  updateHiddenSongsServerAPI(
                    itemId,
                    userKey,
                    userId,
                    userName,
                    dispatch,
                  )
                    .then(resut => {
                      setEditLoading(false);
                      Alert.alert(
                        'Success',
                        'Song Hide successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () => refreshData(),
                          },
                        ],
                        {cancelable: false},
                      );
                    })
                    .catch(error => console.log(error));
                }
                else{
                  setEditLoading(false);
                      Alert.alert(
                        'Success',
                        'Song Hide successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () => refreshData(),
                          },
                        ],
                        {cancelable: false},
                      );
                }
              },
              error => {
                console.log('Create user error', error);
              },
            );
          } else {
            db.transaction(tx => {
              tx.executeSql(
                'UPDATE tbl_user_files_hidden set isDeleted =? where ufhId =?',
                [0, itemId],
                (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('local group hidden updated hidden');
                    if (mode === 'online') {
                      updateHiddenSongsServerAPI(
                        itemId,
                        userKey,
                        userId,
                        userName,
                        dispatch,
                      )
                        .then(resut => {
                          setEditLoading(false);
                          Alert.alert(
                            'Success',
                            'Song Hide successfully',
                            [
                              {
                                text: 'Ok',
                                onPress: () => refreshData(),
                              },
                            ],
                            {cancelable: false},
                          );
                        })
                        .catch(error => console.log(error));
                    }
                    else{
                      setEditLoading(false);
                      Alert.alert(
                        'Success',
                        'Song Hide successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () => refreshData(),
                          },
                        ],
                        {cancelable: false},
                      );
                    }
                   
                  } else console.log('local group update failed');
                },
              );
            });
          }
        },
      );
    });
  };
  const handleRemoveHiddenSong = (itemId, fcode) => {

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tbl_user_files_hidden set isDeleted =? where ufhId =?',
        [1, itemId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('local group hidden updated');
            if (mode === 'online') {
              removeHiddenSongsServerAPI(
                itemId,
                userKey,
                userId,
                userName,
                dispatch,
              )
                .then(resut => {
                  setEditLoading(false);
                  Alert.alert(
                    'Success',
                    'Song Added View List successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => refreshData(),
                      },
                    ],
                    {cancelable: false},
                  );
                })
                .catch(error => console.log(error));
            }
            else{
              setEditLoading(false);
                  Alert.alert(
                    'Success',
                    'Song Added View List successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => refreshData(),
                      },
                    ],
                    {cancelable: false},
                  );
            }
          } else console.log('local group update failed');
        },
      );
    });
  };
  const handleDialogCancel = () => {
    setShowDeleteAlert(false);
  };
  const handleDialogOk = (itemId, fcode) => {
    //Show Loader
    setLoading(true);
    try {
      // if we have division id than its edit mode
      if (songDelete) {
        setShowDeleteAlert(false);
        setModalVisible(false);

        deleteSongsDataModel(songDelete)
          .then(data => {
            if (data.rowsAffected > 0) {
              if (mode === 'online') {
                deleteSongsServerAPI(
                  songDelete,
                  userKey,
                  userId,
                  userName,
                  dispatch,
                )
                  .then(resut => {
                    deleteImageFile(fcode, userName);
                    setShowDeleteAlert(false);
                    setModalVisible(false);
                    setLoading(false);
                    Alert.alert(
                      'Success',
                      'Song deleted successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => refreshData(),
                        },
                      ],
                      {cancelable: false},
                    );
                  })
                  .catch(error => console.log(error));
              } else {
                deleteImageFile(fcode, userName);
                setShowDeleteAlert(false);
                setModalVisible(false);
                setLoading(false);
                Alert.alert(
                  'Success',
                  'Song deleted successfully',
                  [
                    {
                      text: 'Ok',
                      onPress: () => refreshData(),
                    },
                  ],
                  {cancelable: false},
                );
              }
            }
          })
          .catch(error => console.log(error));
      }
    } catch (error) {
      //console.log(error);
    }
    setLoading(false);
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
  const handleSharePress = async () => {
    if (isObjectEmpty(state.switches) == true) {
      Alert.alert('Please choose a group');
    } else {
      if (state.switches) {
        var resArray = [];
        Object.entries(state.switches).forEach(([key, value]) => {
          if (value === true) {
            resArray.push(key);
          }
        });

        setLoading(true);
        const shareGroup = {
          gid: resArray,
          song_id: serverID,
          user_name: userName,
          user_key: userKey,
        };

        await dispatch(groupShareAction(shareGroup)).then(res => {
          if (res.type == 'auth/groupShare/fulfilled') {
            setLoading(false);
            setShareModal(false);
            Alert.alert(
              'Alert',
              'Group Shared successfully.',
              [{text: 'OK', onPress: () => refreshData()}],
              {cancelable: false},
            );
          } else if (res.type == 'auth/groupShare/pending') {
            setLoading(true);
          } else {
            setErrortext(
              <Text style={{color: COLORS.themeColor}}>res.payload</Text>,
            );
          }
        });
      }
    }
  };
  const deleteImageFile = async (filename, userName) => {
    const folderName = 'songanize';

    const filesDir =
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath;
    const folderPath = `${filesDir}/${userName}/${folderName}`;

    var filepath = folderPath + '/' + filename;

    RNFS.exists(filepath)
      .then(result => {
        if (result) {
          return (
            RNFS.unlink(filepath)
              .then(() => {
                console.log('FILE DELETED IN LOCAL');
              })
              // `unlink` will throw an error, if the item to unlink does not exist
              .catch(err => {
                console.log(err.message);
              })
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const playVideo = link => {
    setModalVisible(false);
    setVideoModal(true);
  };

  const hideVideoModal = () => {
    setLoading(false);
    setVideoModal(false);
    tableData;
    refreshData();
  };
  return (
    <View style={styles.centeredView}>
      <Loader loading={editLoading} />
      <Loader loading={loading} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          {mode == 'offline' ? (
            <View style={styles.offlinemodalView}>
              {fsharedSong == 1 ? (
                <TouchableOpacity onPress={() => showInfoModal(itemId)}>
                  <Icons
                    name="info"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    size={30}
                  />
                </TouchableOpacity>
              ) : (
                ''
              )}
              {fsharedSong == 0 ? (
                <TouchableOpacity onPress={() => showEditModal(itemId)}>
                  <Icons
                    name="edit"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    size={30}
                  />
                </TouchableOpacity>
              ) : (
                ''
              )}
              <Dialog.Container visible={showDeleteAlert}>
                <Dialog.Title>Song delete</Dialog.Title>
                <Dialog.Description>
                  Do you want to delete this Song? You cannot undo this action.
                </Dialog.Description>
                <Dialog.Button
                  label="Cancel"
                  onPress={handleDialogCancel}
                  color={COLORS.red}
                  bold="true"
                />
                <Dialog.Button
                  label="Yes"
                  onPress={() => handleDialogOk(itemId, fcode)}
                  color={COLORS.green}
                  bold="true"
                />
              </Dialog.Container>
              <TouchableOpacity>
                {fsharedSong == 0 ? (
                  <Icons
                    name="delete-forever"
                    color={COLORS.red}
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => handleSongDelete(itemId, fcode)}
                    size={30}
                  />
                ) : (fhidden_song == 0) & (fsharedSong == 1) ? (
                  <Icons
                    name="remove-red-eye"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => handleRemoveHiddenSong(fhiddenFileId, fcode)}
                    size={30}
                  />
                ) : ((fhiddenFileId == null || fhidden_song == null) && fsharedSong == 1)
                || ((fhiddenFileId != null || fhidden_song != null) && fsharedSong == 1)
                ? (
                //) : (fhidden_song == 1) & (fsharedSong == 1) ? (
                  <Icons
                    name="cancel"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => handleHiddenSong(itemId, serverSGID)}
                    size={30}
                  />
                ) : (
                  ''
                )}
              </TouchableOpacity>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: COLORS.logoColor,
                }}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Icons name="close" size={30} color={COLORS.white} />
              </TouchableHighlight>
              <Text style={styles.modalText}>{activeItem?.title}</Text>
            </View>
          ) : (
            <View style={styles.modalView}>
              {fsharedSong == 1 ? (
                <TouchableOpacity onPress={() => showInfoModal(itemId)}>
                  <Icons
                    name="info"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    size={30}
                  />
                </TouchableOpacity>
              ) : (
                ''
              )}
              {fsharedSong == 0 ? (
                <TouchableOpacity onPress={() => showEditModal(itemId)}>
                  <Icons
                    name="edit"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    size={30}
                  />
                </TouchableOpacity>
              ) : (
                ''
              )}
              <TouchableOpacity>
                <Icons
                  name="insert-link"
                  color={
                    youtubeLink == '' ? COLORS.lightgray : COLORS.logoColor
                  }
                  style={{
                    alignSelf: 'center',
                  }}
                  onPress={() => playVideo(youtubeLink)}
                  disabled={youtubeLink == '' ? true : false}
                  size={30}
                />
              </TouchableOpacity>

              <Dialog.Container visible={showDeleteAlert}>
                <Dialog.Title>Song delete</Dialog.Title>
                <Dialog.Description>
                  Do you want to delete this Song? You cannot undo this action.
                </Dialog.Description>
                <Dialog.Button
                  label="Cancel"
                  onPress={handleDialogCancel}
                  color={COLORS.red}
                  bold="true"
                />
                <Dialog.Button
                  label="Yes"
                  onPress={() => handleDialogOk(itemId, fcode)}
                  color={COLORS.green}
                  bold="true"
                />
              </Dialog.Container>
              <TouchableOpacity>
                {fsharedSong == 0 ? (
                  <Icons
                    name="delete-forever"
                    color={COLORS.red}
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => handleSongDelete(itemId, fcode)}
                    size={30}
                  />
                ) : (fhidden_song == 0) & (fsharedSong == 1) ? (
                  <Icons
                    name="remove-red-eye"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => handleRemoveHiddenSong(fhiddenFileId, fcode)}
                    size={30}
                  />
                     ) : ((fhiddenFileId == null || fhidden_song == null) && fsharedSong == 1) 
                     || ((fhiddenFileId != null || fhidden_song != null) && fsharedSong == 1)
                     ? (
                //) : (fhidden_song == 1) & (fsharedSong == 1) ? (
                  <Icons
                    name="cancel"
                    color={COLORS.logoColor}
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => handleHiddenSong(itemId, serverSGID)}
                    size={30}
                  />
                ) : (
                  ''
                )}
              </TouchableOpacity>
              <TouchableOpacity>
                {fsharedSong == 0 ? (
                  fgroupId > 0 ? (
                    <Icons
                      name="share"
                      color={COLORS.green}
                      style={{
                        alignSelf: 'center',
                      }}
                      onPress={() => showShareModal()}
                      size={30}
                    />
                  ) : (
                    <Icons
                      name="share"
                      color={COLORS.logoColor}
                      style={{
                        alignSelf: 'center',
                      }}
                      onPress={() => showShareModal(itemId)}
                      size={30}
                    />
                  )
                ) : (
                  ''
                )}
              </TouchableOpacity>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: COLORS.logoColor,
                }}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Icons name="close" size={30} color={COLORS.white} />
              </TouchableHighlight>
              <Text style={styles.modalText}>{activeItem?.title}</Text>
            </View>
          )}
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModal}
        onRequestClose={() => {
          hideEditModal();
        }}>
        <ScrollView>
          <View style={styles.editModalView}>
            <View style={styles.editModalViewSub}>
              <Loader loading={loading} />
              <View style={styles.buttonCloseOptionContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.closeButton,
                    backgroundColor: COLORS.logoColor,
                  }}
                  onPress={() => {
                    hideEditModal();
                  }}>
                  <Icons name="close" size={30} color={COLORS.white} />
                </TouchableHighlight>
              </View>
              <Text style={styles.editModalHeading}>Edit song information</Text>
              <View style={styles.inputArea}>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Youtube link:</Text>
                  <TextInput
                    placeholder="Youtube link"
                    placeholderTextColor={COLORS.textColorLightGrey}
                    type="password"
                    style={styles.input}
                    onChangeText={setYoutubeLink}
                    value={youtubeLink}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Title:</Text>
                  <TextInput
                    placeholder="Title"
                    placeholderTextColor={COLORS.textColorLightGrey}
                    style={styles.input}
                    onChangeText={setTitleData}
                    value={titleData}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Interpret:</Text>
                  <TextInput
                    placeholder="Interpret"
                    placeholderTextColor={COLORS.textColorLightGrey}
                    type="password"
                    style={styles.input}
                    onChangeText={setInterpreet}
                    value={interpreet}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Written by:</Text>
                  <TextInput
                    placeholder="Written by"
                    placeholderTextColor={COLORS.textColorLightGrey}
                    type="password"
                    style={styles.input}
                    onChangeText={setWrittenBy}
                    value={writterBy}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Key:</Text>
                  <TextInput
                    placeholder="Key"
                    placeholderTextColor={COLORS.textColorLightGrey}
                    type="password"
                    style={styles.input}
                    onChangeText={setKey}
                    value={key}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Type:</Text>

                  <DropDownPicker
                    open={open}
                    value={type}
                    items={items}
                    setOpen={setOpen}
                    dropDownDirection="TOP"
                    setValue={setType}
                    setItems={setItems}
                    placeholder="Please select"
                    style={[
                      styles.input,
                      {width: '100%', minHeight: verticalScale(25)},
                    ]}
                    containerStyle={{
                      width: '70%',
                    }}
                    disabledStyle={{
                      opacity: 0.5,
                    }}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Genre:</Text>
                  <TextInput
                    placeholder="Genre"
                    placeholderTextColor={COLORS.textColorLightGrey}
                    type="password"
                    style={styles.input}
                    onChangeText={setGenerate}
                    value={generate}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Filename:</Text>
                  <TextInput
                    placeholder="Filename"
                    placeholderTextColor={COLORS.textColorLightGrey}
                    type="file"
                    style={{...styles.input, width: '54%'}}
                    onChangeText={setFile}
                    value={file}
                  />

                  <Text style={styles.inputLabel}>{'.' + fileType}</Text>
                </View>
              </View>
              <View style={styles.btngrp}>
                <View style={styles.editModalCancel}>
                  <AppButton
                    onPress={() => hideEditModal()}
                    title="Cancel"
                    backgroundColor={COLORS.cancelButtonColor}
                  />
                </View>
                <View style={styles.editModalSave}>
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
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModal}
        onRequestClose={() => {
          hideInfoModal();
        }}>
        <ScrollView>
          <View style={styles.editModalView}>
            <View style={styles.editModalViewSub}>
              <Loader loading={loading} />
              <View style={styles.buttonCloseOptionContainer}>
                <TouchableHighlight
                  style={{
                    ...styles.closeButton,
                    backgroundColor: COLORS.logoColor,
                  }}
                  onPress={() => {
                    hideInfoModal();
                  }}>
                  <Icons name="close" size={30} color={COLORS.white} />
                </TouchableHighlight>
              </View>
              <Text style={styles.editModalHeading}>Song information</Text>
              <View style={styles.inputArea}>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Shared By:</Text>
                  <Text style={styles.infoField}>
                    {userFirstname + ' ' + userLastname}
                  </Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Youtube link:</Text>
                  <Text style={styles.infoField}>{youtubeLink}</Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Title:</Text>
                  <Text style={styles.infoField}>{titleData}</Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Interpret:</Text>
                  <Text style={styles.infoField}>{interpreet}</Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Written by:</Text>
                  <Text style={styles.infoField}>{writterBy}</Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Key:</Text>
                  <Text style={styles.infoField}>{key}</Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Type:</Text>
                  <Text style={styles.infoField}>{type}</Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Genre:</Text>
                  <Text style={styles.infoField}>{generate}</Text>
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.infoLabel}>Filename:</Text>
                  <Text style={styles.infoField}>{file}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={videoModal}
        onRequestClose={() => {
          hideVideoModal();
        }}>
        <ScrollView>
          <View style={styles.videoModalView}>
            <View style={styles.videoModalViewSub}>
              <View style={styles.buttonCloseOptionVideo}>
                <TouchableHighlight
                  style={{
                    ...styles.closeButton,
                    backgroundColor: COLORS.logoColor,
                  }}
                  onPress={() => {
                    hideVideoModal();
                  }}>
                  <Icons name="close" size={35} color={COLORS.white} />
                </TouchableHighlight>
              </View>
              <Loader loading={loading} />
              <View style={styles.videoPlayerModal}>
                <YoutubePlayer
                  height={600}
                  play={playing}
                  videoId={youtubeVideoId}
                  onError={() => {
                    console.log('Error loading video');
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModal}
        onRequestClose={() => {
          setShareModal(!shareModal);
        }}>
        <ScrollView>
          <View style={styles.shareModalView}>
            <View style={styles.shareModalSub}>
              <View style={styles.buttonCloseOptionContainer}>
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
                Share this song with...
              </Text>
              <View style={styles.content}>
                {toggleGroupsList &&
                  toggleGroupsList.length > 0 &&
                  toggleGroupsList.map((rowData, index) => (
                    <View style={styles.shareModalcheckBoxes} key={index}>
                      <Text style={styles.shareModalContentText}>
                        {rowData.group_name}
                      </Text>
                      <View style={styles.checkboxContainer}>
                        {rowData.shared_to_group == 1 ? (
                          <SwitchComponent
                            item={rowData.group_id}
                            value={!!state.switches}
                            state={true}
                            onValueChange={toggleSwitchHandler}
                            onChange={toggleSwitch(rowData.group_id)}
                          />
                        ) : (
                          <SwitchComponent
                            item={rowData.group_id}
                            value={!!state.switches[rowData.group_id]}
                            state={false}
                            onValueChange={toggleSwitchHandler}
                            onChange={toggleSwitch(rowData.group_id)}
                          />
                        )}
                      </View>
                    </View>
                  ))}
              </View>
              <View style={styles.btngrp}>
                <View style={styles.editModalCancel}>
                  <AppButton
                    onPress={() => {
                      setShareModal(!shareModal);
                    }}
                    title="Cancel"
                    backgroundColor={COLORS.cancelButtonColor}
                  />
                </View>
                <View style={styles.editModalSave}>
                  <AppButton
                    onPress={() => handleSharePress()}
                    title="Save"
                    backgroundColor={COLORS.saveButtonColor}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Popup;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '99%',
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingLeft: 20,
    alignItems: 'center',
    shadowColor: COLORS.textListColorBold,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  offlinemodalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingLeft: 20,
    alignItems: 'center',
    shadowColor: COLORS.textListColorBold,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
  },
  openButton: {
    backgroundColor: COLORS.pink,
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    marginLeft: '10%',
  },
  closeButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
    position: 'relative',
  },
  textStyle: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  editModalView: {
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
    marginTop: verticalScale(90),
    paddingBottom: 20,
  },
  editModalViewSub: {
    width: '100%',
    height: '100%',
  },
  buttonCloseOptionContainer: {
    width: '100%',
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputArea: {
    width: '90%',
    gap: 10,
    marginVertical: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: COLORS.textListColorBold,
    padding: 5,
  },
  inputLabel: {
    fontSize: 16,
    borderColor: COLORS.textListColorBold,
    color: COLORS.textListColorBold,
  },
  infoLabel: {
    fontSize: 16,
    borderColor: COLORS.textListColorBold,
    color: COLORS.textListColorBold,
  },
  infoField: {
    fontSize: 16,
    borderColor: COLORS.textListColorBold,
    color: COLORS.textListColorBold,
  },
  input: {
    width: '70%',
    padding: 7,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.textListColorBold,
    borderRadius: 5,
    color: COLORS.textListColorBold,
    paddingVertical: 0,
  },
  editModalHeading: {
    fontSize: 25,
    color: COLORS.textListColorBold,
    marginTop: 30,
    fontWeight: 'bold',
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
  editModalButton: {
    paddingVertical: 8,
    width: '25%',
    borderRadius: 14,
  },
  editModalButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: 'semibold',
  },
  editModalCancel: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
  },
  editModalSave: {
    marginTop: 20,
    width: '40%',
    alignItems: 'center',
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
    marginTop: 230,
    paddingBottom: 20,
    borderRadius: 10,
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
  bigBand: {
    borderTopWidth: 1,
    borderTopColor: COLORS.textListColorBold,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textListColorBold,
    marginTop: 20,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  //start video modal view
  videoModalView: {
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
    height: scale(300),
    flexDirection: 'row',
  },
  videoModalViewSub: {
    margin: 10,
    width: '95%',
    height: '95%',
  },
  buttonCloseOptionVideo: {
    width: '100%',
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  videoPlayerModal: {
    marginTop: 60,
    marginHorizontal: 10,
  },
  // end video modal view
});
