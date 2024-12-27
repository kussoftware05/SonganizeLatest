import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
// import the package below
import 'react-native-get-random-values';
import {
  BackHandler,
  Alert,
  StatusBar,
  AppState,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Routes from './src/navigations/Routes';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import NetInfo from '@react-native-community/netinfo';
import WelcomeScreen from './src/screens/Welcome/WelcomeScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {PaperProvider} from 'react-native-paper';

import {openDatabase} from 'react-native-sqlite-storage';
import {getGroupLists} from './src/redux/services/groupAction';
import {
  getSonganizeLists,
  hiddenSonganizeAction,
  uploadDocumentation,
  downloadSongAction,
  updateSonganizeAction,
  deleteSongAction,
  updatehideSonganizeAction,
  hiddenToListSonganizeAction
} from './src/redux/services/songanizeAction';
import {getsetLists, createSetlist} from './src/redux/services/setlistAction';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getProfileImage,
} from './src/redux/services/profileAction';
import {
  addSQLGroups,
  createSetlistTable,
  addSQLSetLists,
  createUsersTable,
  createSongsTable,
  addSQLUser,
  addSQLSongs,
  addSQLUserProfilePic,
} from './src/util/DBManager';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import Loader from './src/components/Loader/Loader';
import BackgroundFetch from 'react-native-background-fetch';

import BackgroundService from 'react-native-background-actions';

var db = openDatabase({name: 'Songanizeoffline.db'});

const AppWrapper = () => {
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want exit Songanize?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };
  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        console.log('online');
      } else {
        <WelcomeScreen />;
      }
    });
  };
  React.useEffect(() => {
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', backAction);
    getNetInfo();
  });
  return (
    <>
      <PaperProvider>
        <Provider store={store}>
          <StatusBar style="auto" />
          <Routes />
          <App />
        </Provider>
      </PaperProvider>
    </>
  );
};
const App = () => {
  const dispatch = useDispatch();

  const [fileUploadData, setFileUploadData] = useState('');
  const [fileArryObjData, setFileArryObjData] = useState('');

  //for fetching storage Data
  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState('');

  const [mode, setMode] = useState('online');
  const [loading, setLoading] = useState(false);

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
  }, []);

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
  const readUserLoggedIn = async user_loggedIn => {
    await AsyncStorage.setItem('user_loggedIn', JSON.stringify(false), () => {
      try {
        AsyncStorage.getItem(user_loggedIn)
          .then(async value => {
            const userLogged = await JSON.parse(value);
            console.log('userLogged' + userLogged);
            if (userLogged !== null) {
              setUserLoggedIn(userLogged);
            } else {
              console.log('userLogged null');
            }
          })
          .done();
        console.log('userLogged--' + userLoggedIn);
      } catch (e) {
        console.log('Failed to fetch the data from storage userLogged');
      }
    });
  };

  useEffect(() => {
    Promise.resolve(getNetInfo()).catch(err => {
      console.log(err.response, '-----------------not getting info');
    });
    getNetInfo();
    createUsersTable();
    createSongsTable();
    createSetlistTable();

    // dropUsersTable();
    // dropSongsTable();
    // dropSetlistTable();
  }, [userKey, userId, userName, mode]);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [userKey, userId, userName, userLoggedIn, mode]);

  const handleAppStateChange = nextAppState => {
    //const timeInterval = 10000;
    const timeInterval = 15 * 60 * 1000; // wait 15 minutes time for uploading

    readUserLoggedIn('user_loggedIn');

    if (mode == 'online' && userLoggedIn === false) {
      console.log(appState + '\\\\\\' + nextAppState + '\\\\' + userLoggedIn);
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        const intervalId = setTimeout(async () => {
          if (userKey !== '' && userName !== '' && userId !== '') {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT user_key FROM tbl_wp_users  WHERE uId = ? AND user_login = ?',
                [userId, userName],
                (tx, results) => {
                  var len = results.rows.length;

                  var temp = [];
                  if (len > 0) {
                    for (let i = 0; i < results.rows.length; i++) {
                      console.log('increment-->' + i);
                      temp.push(results.rows.item(i));
                    }
                  }
                  if (temp.length > 0) {
                    temp.map(async uKey => {
                      if (uKey != '' && uKey) {
                        await callbackground(userKey, userId, userName);
                      } else {
                        console.log('existKey--' + JSON.stringify(uKey));
                      }
                    });
                  } else {
                    console.log('No record found');
                  }
                },
              );
            });
          }
        }, timeInterval);

        return () => clearTimeout(intervalId); // Cleanup on component unmount
      }

      setAppState(nextAppState);
    } else {
      console.log('Oops! you are currently offline.');
    }
  };

  useEffect(() => {
    if (mode == 'online') {
      console.log('fileUploadData==' + fileArryObjData);
      apiCallforSongsUpload(fileArryObjData, userKey, userName);
    }
  }, [fileArryObjData, userKey, userName, userId, mode]);

  const callbackground = async (userKey, userId, userName) => {
    const sleep = time =>
      new Promise(resolve => setTimeout(() => resolve(), time));

    const veryIntensiveTask = async taskDataArguments => {
      // Example of an infinite loop task
      const {delay} = taskDataArguments;
      await new Promise(async resolve => {
        await allFunctions(userKey, userId, userName);
        for (let i = 0; BackgroundService.isRunning(); i++) {
          console.log(i);
          await sleep(delay);
        }
      });
    };

    const options = {
      taskName: 'DataSync',
      taskTitle: 'Data synchronization',
      taskDesc: 'Process...',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
      parameters: {
        delay: 10000,
      },
    };
    BackgroundService.on('expiration', () => {
      console.log('I am being closed :(');
    });

    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'New ExampleTask description',
    }); // Only Android, iOS will ignore this call
    // iOS will also run everything here in the background until .stop() is called
    await BackgroundService.stop();
  };
  const getNetInfo = async () => {
    await NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        setMode('online');
      } else {
        setMode('offline');
      }
    });
  };

  const allFunctions = async (userKey, userId, userName) => 
  {
    if (userKey !== '' && userName !== '' && userId !== '') {
      setLoading(true);
      await updateSongsServer(userKey, userId, userName);
      await updateEditSongsServer(userKey, userId, userName);
      await deleteSongServer(userKey, userId, userName);
      await updateHiddenSongsData(userKey, userId, userName);
      await removeHiddenSongsData(userKey, userId, userName);  
      await updateSetListServer(userKey, userId, userName);
      await updateEditSetlistServer(userKey, userId, userName);
      await updateEditUserData(userKey, userId, userName);
      await UploadUserProfileImage(userKey, userId, userName);

      await fetchUserData(userKey, userId, userName);
      await fetchGroupData(userKey, userId, userName);
      await fetchSetListData(userKey, userId, userName);
      await fetchSongsData(userKey, userId, userName);
      await fetchHiddenSongsData(userKey, userId, userName);
      setLoading(false);
    }
  };
  /* fetch server data when online start*/
  const fetchUserData = async (userKey, userId, userName) => {
    if (userKey) {
      const user = {
        userId: userId,
        user_key: userKey,
        user_name: userName,
      };

      await dispatch(getProfile(user)).then(res => {
        if (res.type == 'auth/profileView/fulfilled') {
          if (res.payload) {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM tbl_wp_users where uId = ?',
                [res.payload.id],
                async (tx, results) => {
                  var len = results.rows.length;

                  if (len == 0) {
                    //Call SQLite method to insert
                    addSQLUser(
                      res.payload.id,
                      res.payload.username,
                      res.payload.firstname,
                      res.payload.familyname,
                      res.payload.email,
                      'abcdefgh',
                      res.payload.nicename,
                      'abc',
                      'abcd',
                      res.payload.display_name,
                      res.payload.postal_code,
                      res.payload.city,
                      res.payload.country_code,
                      res.payload.country,
                      userKey,
                      0,
                      res.payload.registered,
                    );
                    const userPic = {
                      //userId: userId,
                      user_key: userKey,
                      user_name: userName,
                    };
                    console.log('userPic===' + JSON.stringify(userPic));
                    dispatch(getProfileImage(userPic)).then(resultPic => {
                      if (resultPic.payload) {
                        if (
                          resultPic.type == 'auth/getProfilePicture/fulfilled'
                        ) {
                          db.transaction(tx => {
                            tx.executeSql(
                              'SELECT * FROM tbl_user_profile_pic WHERE uId  =?',
                              [userId],
                              (tx, result) => {
                                var temp = [];
                                var picLen = result.rows.length;

                                if (picLen > 0) {
                                  temp.push(result.rows.item(0));
                                }

                                if (temp.length > 0) {
                                  temp.map(pictur => {
                                    console.log('found data in user folder');

                                    if (pictur.id != '') {
                                      var prfFlag = 1;

                                      addSQLUserProfilePic(
                                        userName,
                                        pictur.uId,
                                        pictur.id,
                                        pictur.year,
                                        pictur.week,
                                        pictur.image_code,
                                        pictur.image_type,
                                        pictur.last_change,
                                        pictur.file_data,
                                        prfFlag,
                                      );
                                    }
                                  });
                                } else {
                                  var prfFlag = 0;

                                  addSQLUserProfilePic(
                                    userName,
                                    resultPic.payload.userid,
                                    resultPic.payload.id,
                                    resultPic.payload.year,
                                    resultPic.payload.week,
                                    resultPic.payload.image_code,
                                    resultPic.payload.type,
                                    resultPic.payload.last_change,
                                    resultPic.payload.file_data,
                                    prfFlag,
                                  );
                                }
                              },
                            );
                          });
                        }
                      }
                    });
                  } else {
                    console.log('No new record found');
                    if (userKey && userName) {
                      await checkFileExistProfilePic(userKey, userName, '', '');
                    }
                  }
                },
              );
            });
          } else {
            console.log('No user found in server');
          }
        }
      });
    }
  };
  const fetchGroupData = async (userKey, userId, userName) => {
    if (userKey) {
      const user = {
        userId: userId,
        user_key: userKey,
        user_name: userName,
      };
      await dispatch(getGroupLists(user)).then(res => {
        if (res.type == 'auth/grouplist/fulfilled') {
          if (res.payload.res_data.length > 0) {
            res.payload.res_data.map(grp => {
              if (grp.id != '') {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM tbl_groups where serverId = ? AND uId = ?',
                    [grp.id, grp.added_by_user_id],
                    (tx, result) => {
                      var len = result.rows.length;
                      if (len == 0) {
                        db.transaction(tx => {
                          tx.executeSql(
                            'SELECT * FROM tbl_groups_users where gId = ? AND uId = ? AND added_by_user_id =?',
                            [grp.id, grp.user_id, grp.added_by_user_id],
                            (tx, results) => {
                              var leng = results.rows.length;

                              if (leng == 0) {
                                //Call SQLite method to insert
                                addSQLGroups(
                                  grp.id,
                                  grp.userid,
                                  grp.user_id,
                                  grp.group_name,
                                  false,
                                  grp.created_date,
                                  false,
                                );
                              } else {
                                console.log('No new record found');
                              }
                            },
                          );
                        });
                      } else {
                        db.transaction(tx => {
                          tx.executeSql(
                            'SELECT * FROM tbl_groups_users where gId = ? AND uId = ? AND added_by_user_id =?',
                            [grp.id, grp.user_id, grp.added_by_user_id],
                            (tx, results) => {
                              var leng = results.rows.length;

                              if (leng == 0) {
                                //Call SQLite method to insert
                                addSQLGroups(
                                  grp.id,
                                  grp.userid,
                                  grp.user_id,
                                  grp.group_name,
                                  false,
                                  grp.created_date,
                                  true,
                                );
                              } else {
                                console.log('No new record found');
                              }
                            },
                          );
                        });
                      }
                    },
                  );
                });
              }
            });
          }
        }
      });
    }
  };
  const fetchSongsData = async (userKey, userId, userName) => {
    if (userKey) {
      const user = {
        userId: userId,
        user_key: userKey,
        user_name: userName,
      };

      dispatch(getSonganizeLists(user)).then(res => {
        if (res.type == 'auth/songanizeList/fulfilled') {
          if (res.payload.res_data.length > 0) {
            res.payload.res_data.map(grp => {
              if (grp.id != '') {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM tbl_user_files where serverSGId = ? AND uId = ?',
                    [grp.id, grp.userid],
                    async (tx, results) => {
                      var len = results.rows.length;

                      if (len == 0) {
                        const downloadFile = {
                          code: grp.code,
                          userid: grp.userid,
                          user_key: userKey,
                          user_name: userName,
                        };

                        dispatch(downloadSongAction(downloadFile)).then(
                          resut => {
                            if (
                              resut.type == 'auth/downloadSonganize/fulfilled'
                            ) {
                              console.log(
                                'downloadSonganize0400' +
                                  JSON.stringify(resut.payload.name),
                              );
                              db.transaction(tx => {
                                tx.executeSql(
                                  'SELECT * FROM tbl_user_folder where uId = ? AND sufId = ?',
                                  [grp.userid, grp.folderid],
                                  (tx, results) => {
                                    var leng = results.rows.length;

                                    if (leng == 0) {
                                      var img64Bit = resut.payload.file_data;
                                      let ufFlag = 1;
                                      let ufhidden = 0;
                                      let serverHid = 0;
                                      let shared_by_userid = 0;

                                      //Call SQLite method to insert

                                      addSQLSongs(
                                        grp.id,
                                        grp.userid,
                                        grp.title,
                                        grp.interpret,
                                        grp.link,
                                        grp.writer,
                                        grp.genre,
                                        grp.filename,
                                        grp.category,
                                        grp.filetype,
                                        grp.year,
                                        grp.week,
                                        grp.code,
                                        grp.key,
                                        grp.folderid,
                                        grp.img_data,
                                        grp.shareimg,
                                        grp.shared_song,
                                        grp.firstname,
                                        grp.lastname,
                                        grp.username,
                                        grp.email,
                                        grp.registered,
                                        grp.lastchange,
                                        grp.timestamp,
                                        grp.folder_lastchange,
                                        img64Bit,
                                        ufFlag,
                                        ufhidden,
                                        serverHid,
                                        shared_by_userid,
                                        grp.song_group_id,
                                        grp.imgtype,
                                      );
                                    } else {
                                      let ufFlag = 0;
                                      let ufhidden = 0;
                                      let serverHid = 0;
                                      let shared_by_userid = 0;
                                      var img64Bit = resut.payload.file_data;

                                      //Call SQLite method to insert
                                      addSQLSongs(
                                        grp.id,
                                        grp.userid,
                                        grp.title,
                                        grp.interpret,
                                        grp.link,
                                        grp.writer,
                                        grp.genre,
                                        grp.filename,
                                        grp.category,
                                        grp.filetype,
                                        grp.year,
                                        grp.week,
                                        grp.code,
                                        grp.key,
                                        grp.folderid,
                                        grp.img_data,
                                        grp.shareimg,
                                        grp.shared_song,
                                        grp.firstname,
                                        grp.lastname,
                                        grp.username,
                                        grp.email,
                                        grp.registered,
                                        grp.lastchange,
                                        grp.timestamp,
                                        grp.folder_lastchange,
                                        img64Bit,
                                        ufFlag,
                                        ufhidden,
                                        serverHid,
                                        shared_by_userid,
                                        grp.song_group_id,
                                        grp.imgtype,
                                      );
                                    }
                                  },
                                );
                              });
                            }
                          },
                        );
                      } else {
                        if (grp.code) {
                          await checkFileExist(
                            grp.code,
                            grp.userid,
                            userKey,
                            userName,
                          );
                        }

                        if (grp.img_data) {
                          var strImage = grp.img_data.split(',');
                          await checkFileExistProfilePic(
                            '',
                            userName,
                            grp.shareimg,
                            grp.shared_song,
                            strImage[1],
                          );
                        }
                      }
                    },
                  );
                });
              }
            });
          }
        }
      });
    }
  };
  const fetchHiddenSongsData = async (userKey, userId, userName) => {
    if (userKey) {
      const user = {
        user_key: userKey,
        user_name: userName,
      };
      await dispatch(hiddenSonganizeAction(user)).then(res => {
        if (res.type == 'auth/hiddenSonganize/fulfilled') {
          if (res.payload.res_data.length > 0) {
            res.payload.res_data.map(grp => {
              if (grp.id != '') {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM tbl_user_files_hidden where file_id = ? AND uId = ?',
                    [grp.id, userId],
                    async (tx, results) => {
                      var len = results.rows.length;

                      if (len == 0) {
                        db.transaction(tx => {
                          tx.executeSql(
                            'SELECT * FROM tbl_user_files where serverSGId = ? AND uId = ?',
                            [grp.id, userId],
                            (tx, resultUF) => {
                              var leng = resultUF.rows.length;

                              if (leng > 0) {
                                var tempUF = [];
                                if (leng > 0) {
                                  for (
                                    let i = 0;
                                    i < resultUF.rows.length;
                                    ++i
                                  ) {
                                    tempUF.push(resultUF.rows.item(i));
                                  }
                                }
                                if (tempUF.length > 0) {
                                  tempUF.map(ufs => {
                                    //Call SQLite method to insert
                                    let sql1 =
                                      'INSERT INTO tbl_user_files_hidden (ufhId, uId, file_id, ServerhId, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?)';
                                    let params1 = [
                                      ufs.id,
                                      userId,
                                      grp.id,
                                      grp.hid,
                                      new Date(),
                                      0,
                                    ]; //storing user data in an array

                                    console.log(params1);
                                    db.executeSql(
                                      sql1,
                                      params1,
                                      result1 => {
                                        console.log(
                                          'Song created successfully.' +
                                            JSON.stringify(result1),
                                        );
                                      },
                                      error => {
                                        //console.log('Create song error in local db', error);
                                      },
                                    );
                                  });
                                }
                              } else {
                                const downloadFile = {
                                  code: grp.code,
                                  userid: grp.shared_by_userid,
                                  user_key: userKey,
                                  user_name: userName,
                                };

                                dispatch(downloadSongAction(downloadFile)).then(
                                  resut => {
                                    if (
                                      resut.type ==
                                      'auth/downloadSonganize/fulfilled'
                                    ) {
                                      db.transaction(tx => {
                                        tx.executeSql(
                                          'SELECT * FROM tbl_user_folder where uId = ? AND sufId = ?',
                                          [grp.shared_by_userid, grp.folderid],
                                          (tx, results) => {
                                            var lengh = results.rows.length;

                                            if (lengh == 0) {
                                              var img64Bit =
                                                resut.payload.file_data;
                                              let ufFlag = 1;
                                              let ufhidden = 1;
                                              //Call SQLite method to insert
                                              addSQLSongs(
                                                grp.id,
                                                grp.userid,
                                                grp.title,
                                                grp.interpret,
                                                grp.link,
                                                grp.writer,
                                                grp.genre,
                                                grp.filename,
                                                grp.category,
                                                grp.filetype,
                                                grp.year,
                                                grp.week,
                                                grp.code,
                                                grp.key,
                                                grp.folderid,
                                                grp.img_data,
                                                grp.shareimg,
                                                grp.shared_song,
                                                grp.firstname,
                                                grp.lastname,
                                                grp.username,
                                                grp.email,
                                                grp.registered,
                                                grp.lastchange,
                                                grp.timestamp,
                                                grp.folder_lastchange,
                                                img64Bit,
                                                ufFlag,
                                                ufhidden,
                                                grp.hid,
                                                grp.shared_by_userid,
                                                grp.song_group_id,
                                                grp.imgtype,
                                              );
                                            } else {
                                              let ufFlag = 0;
                                              var img64Bit =
                                                resut.payload.file_data;
                                              let ufhidden = 1;

                                              //Call SQLite method to insert
                                              addSQLSongs(
                                                grp.id,
                                                grp.userid,
                                                grp.title,
                                                grp.interpret,
                                                grp.link,
                                                grp.writer,
                                                grp.genre,
                                                grp.filename,
                                                grp.category,
                                                grp.filetype,
                                                grp.year,
                                                grp.week,
                                                grp.code,
                                                grp.key,
                                                grp.folderid,
                                                grp.img_data,
                                                grp.shareimg,
                                                grp.shared_song,
                                                grp.firstname,
                                                grp.lastname,
                                                grp.username,
                                                grp.email,
                                                grp.registered,
                                                grp.lastchange,
                                                grp.timestamp,
                                                grp.folder_lastchange,
                                                img64Bit,
                                                ufFlag,
                                                ufhidden,
                                                grp.hid,
                                                grp.shared_by_userid,
                                                grp.song_group_id,
                                                grp.imgtype,
                                              );
                                            }
                                          },
                                        );
                                      });
                                    }
                                  },
                                );
                              }
                            },
                          );
                        });
                      } else {
                        await checkFileExist(
                          grp.code,
                          grp.shared_by_userid,
                          userKey,
                          userName,
                        );
                      }
                    },
                  );
                });
              }
            });
          }
        }
      });
    }
  };
  const fetchSetListData = async (userKey, userId, userName) => {
    if (userKey) {
      let item = {
        userId: userId,
        user_key: userKey,
        user_name: userName,
      };

      await dispatch(getsetLists(item)).then(res => {
        if (res.type == 'auth/setlists/fulfilled') {
          if (res.payload.res_data.length > 0) {
            res.payload.res_data.map(sl => {
              if (sl.id != '') {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM tbl_setlist where serverSLId = ? AND uId = ?',
                    [sl.id, userId],
                    (tx, results) => {
                      var len = results.rows.length;

                      if (len == 0) {
                        //Call SQLite method to insert
                        addSQLSetLists(
                          sl.id,
                          userId,
                          sl.event,
                          false,
                          sl.event_date,
                          sl.group_names,
                          sl.group_ids,
                        );
                      } else {
                        console.log('No new record found');
                      }
                    },
                  );
                });
              }
            });
          }
        } else {
          console.log('error' + res.payload);
        }
      });
    }
  };
  /* fetch server data when online end*/

  /* update server data when online start*/
  const updateSongsServer = async (userKey, userId, userName) => {
    if (userKey && userName) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_folder WHERE uId  =?',
          [userId],
          (tx, resultsFiles) => {
            var tempUsrFileData = [];
            for (let i = 0; i < resultsFiles.rows.length; ++i) {
              tempUsrFileData.push(resultsFiles.rows.item(i));
            }

            if (tempUsrFileData.length > 0) {
              db.transaction(tx => {
                tx.executeSql(
                  'SELECT * FROM tbl_user_files where isDeleted = 0 AND serverSGId = 0 AND folder_id = ? AND uId = ?',
                  [tempUsrFileData[0].sufId, userId],
                  (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; i++) {
                      temp.push(results.rows.item(i));
                    }

                    if (temp.length > 0) {
                      temp.map(async sg => {
                        await checkPermissionRead(
                          userName,
                          sg.id,
                          sg.filename,
                          'songs',
                          '',
                          'user_folder',
                        );
                      });
                    } else if (temp.length == 0) {
                      db.transaction(tx => {
                        tx.executeSql(
                          'SELECT * FROM tbl_user_files where isDeleted = 0 AND serverSGId = 0 AND uId = ?',
                          [userId],
                          (tx, results1) => {
                            var fileUser = [];
                            for (let i = 0; i < results1.rows.length; i++) {
                              fileUser.push(results1.rows.item(i));
                            }
                            console.log('kkk' + fileUser.length);
                            if (fileUser.length > 0) {
                              fileUser.map(async sg => {
                                await checkPermissionRead(
                                  userName,
                                  sg.id,
                                  sg.filename,
                                  'songs',
                                  '',
                                  '',
                                );
                              });
                            } else {
                              console.log('No new record found local');
                            }
                          },
                        );
                      });
                    } else {
                      console.log('No new record found local');
                    }
                  },
                );
              });
            } else {
              db.transaction(tx => {
                tx.executeSql(
                  'SELECT * FROM tbl_user_files where isDeleted = 0 AND serverSGId = 0 AND folder_id = 0 AND uId = ?',
                  [userId],
                  (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; i++) {
                      temp.push(results.rows.item(i));
                    }

                    if (temp.length > 0) {
                      temp.map(async sg => {
                        await checkPermissionRead(
                          userName,
                          sg.id,
                          sg.filename,
                          'songs',
                          '',
                          'user_folder',
                        );
                      });
                    } else if (temp.length == 0) {
                      db.transaction(tx => {
                        tx.executeSql(
                          'SELECT * FROM tbl_user_files where isDeleted = 0 AND serverSGId = 0 AND uId = ?',
                          [userId],
                          (tx, results1) => {
                            var fileUser = [];
                            for (let i = 0; i < results1.rows.length; i++) {
                              fileUser.push(results1.rows.item(i));
                            }

                            if (fileUser.length > 0) {
                              fileUser.map(async sg => {
                                await checkPermissionRead(
                                  userName,
                                  sg.id,
                                  sg.filename,
                                  'songs',
                                  '',
                                  '',
                                );
                              });
                            } else {
                              console.log('No new record found local');
                            }
                          },
                        );
                      });
                    } else {
                      console.log('No new record found local');
                    }
                  },
                );
              });
            }
          },
        );
      });
    }
  };
  const updateEditSongsServer = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_files where isDeleted = 0 AND serverSGId != 0 AND uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(usEdit => {
                if (usEdit.serverSGId) {
                  let item = {
                    action: 'edit_song',
                    id: usEdit.serverSGId,
                    link: usEdit.link,
                    title: usEdit.title,
                    key: usEdit.song_key,
                    genre: usEdit.genre,
                    writer: usEdit.writter,
                    interpret: usEdit.interpret,
                    category: usEdit.category,
                    file: usEdit.filename,
                    user_key: userKey,
                    user_name: userName,
                  };

                  dispatch(updateSonganizeAction(item)).then(res => {
                    if (res.type == 'auth/updateSonganize/rejected') {
                      console.log('rejected API');
                    } else {
                      db.transaction(tx => {
                        tx.executeSql(
                          'UPDATE tbl_user_files set lastchange =? where serverSGId =?',
                          [res.payload.lastchange, res.payload.id],
                          (tx, results) => {
                            if (results.rowsAffected > 0) {
                              console.log('local songs updated serverId');
                            } else {
                              console.log('local songs update failed serverId');
                            }
                          },
                        );
                      });
                    }
                  });
                }
              });
            } else {
              console.log('No new record found local');
            }
          },
        );
      });
    }
  };
  const deleteSongServer = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_files where isDeleted = 1 AND uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(us => {
                const updateData = {
                  id: us.serverSGId,
                  user_key: userKey,
                  user_name: userName,
                };

                dispatch(deleteSongAction(updateData)).then(res => {
                  console.log('deleteSongAction' + JSON.stringify(res));
                  if (res.type == 'auth/songanizeDelete/rejected') {
                    console.log('not able to delete data from server');
                  } else {
                    console.log('Song Deleted successfully.');
                  }
                });
              });
            } else {
              console.log('No new record found local');
            }
          },
        );
      });
    }
  };
  const updateHiddenSongsData = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_files_hidden where uId = ? AND ServerhId IS NULL AND isDeleted = 0',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(ush => {
              const user = {
                user_key: userKey,
                user_name: userName,
                songid: ush.file_id
              };
               dispatch(updatehideSonganizeAction(user)).then(res => {
                if (res.type == 'auth/updatehideSonganize/fulfilled') {
                  db.transaction(tx => {
                    tx.executeSql(
                      'UPDATE tbl_user_files_hidden set ServerhId=? where file_id=? AND uId = ?',
                      [res.payload.id, ush.file_id, ush.uId],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          console.log('local hidden list updated');
                        } else console.log('local hidden list update failed');
                      },
                    );
                  });
                }
              });
            });
            } else {
              console.log('No new record found');
            }
          },
        );
      });
    }
  };
  const removeHiddenSongsData = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_files_hidden where uId = ? AND ServerhId != 0 AND isDeleted = 1',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(ush => {
              const user = {
                id: ush.ServerhId,
                user_name: userName,
                user_key: userKey,
              };
               dispatch(hiddenToListSonganizeAction(user)).then(res => {
                if (res.type == 'auth/hiddenToListSonganize/fulfilled') {
                  db.transaction(tx => {
                    tx.executeSql(
                      'DELETE FROM tbl_user_files_hidden WHERE id = ?',
                      [ush.id],
                      (tx, results) => {
                        var len = results.rows.length;
                        console.log('len', len);
                        if (len > 0) {
                          console.log('local database delete record done')
                        } else {
                          console.log('No record found groups');
                        }
                      },
                    );
                  });
               
                }
              });
            });
            } else {
              console.log('No new record found');
            }
          },
        );
      });
    }
  };
  const updateSetListServer = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_setlist where isDeleted = 0 AND serverSLId = 0 AND uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(us => {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM tbl_event_groups where isDeleted = 0 AND evId = ? AND uId = ?',
                    [us.id, userId],
                    (tx, results) => {
                      var tempArray = [];
                      for (let i = 0; i < results.rows.length; i++) {
                        tempArray.push(results.rows.item(i));
                      }

                      var gidArray = [];
                      if (tempArray.length > 0) {
                        tempArray.map(ufs => {
                          var gidIDS = '';
                          gidIDS += ufs.gId;
                          gidIDS.concat(',');
                          gidArray.push(gidIDS);
                        });
                      }
                      console.log('hellogidArray17' + JSON.stringify(gidArray));
                      var setlist = {
                        event: us.event_name,
                        gid: gidArray,
                        event_date: us.date_event,
                        flag: 'create',
                        user_key: userKey,
                        user_name: userName,
                      };

                      dispatch(createSetlist(setlist)).then(res => {
                        if (res.type == 'auth/createsetlist/fulfilled') {
                          db.transaction(tx => {
                            tx.executeSql(
                              'UPDATE tbl_setlist set serverSLId= ? where id= ?',
                              [res.payload.id, us.id],
                              (tx, results) => {
                                if (results.rowsAffected > 0) {
                                  console.log('local setlist updated');
                                } else
                                  console.log('local setlist update failed');
                              },
                            );
                          });
                        }
                      });
                    },
                  );
                });
              });
            } else {
              console.log('No new record found local');
            }
          },
        );
      });
    }
  };
  const updateEditSetlistServer = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_setlist where isDeleted = 0 AND serverSLId != 0 AND uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(us => {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM tbl_event_groups where isDeleted = 0 AND evId = ? AND uId = ?',
                    [us.id, userId],
                    (tx, results) => {
                      var tempArray = [];
                      for (let i = 0; i < results.rows.length; i++) {
                        tempArray.push(results.rows.item(i));
                      }
                      var gidArray = [];
                      if (tempArray.length > 0) {
                        tempArray.map(ufs => {
                          var gidIDS = '';
                          gidIDS += ufs.gId;
                          gidIDS.concat(',');
                          gidArray.push(gidIDS);
                        });
                      }

                      var setlist = {
                        sid: us.serverSLId,

                        event: us.event_name,
                        gid: gidArray,
                        event_date: us.date_event,
                        flag: 'update',
                        user_key: userKey,
                        user_name: userName,
                      };

                      dispatch(createSetlist(setlist)).then(res => {
                        if (res.type == 'auth/createsetlist/fulfilled') {
                          console.log(
                            'Setlist updated successfully to server.',
                          );
                        }
                      });
                    },
                  );
                });
              });
            } else {
              console.log('No new record found local');
            }
          },
        );
      });
    }
  };
  const updateEditUserData = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_wp_users where isDeleted = 0 AND uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              const userDetails = {
                userId: userId,
                firstname: temp[0].user_firstname,
                email: temp[0].user_email,
                familyname: temp[0].user_lastname,
                username: temp[0].user_login,
                user_key: userKey,
                user_name: userName,
              };

              dispatch(updateProfile(userDetails)).then(res => {
                if (res.type == 'auth/updateProfile/fulfilled') {
                  console.log('Profile Updated successfully to server.');
                } else if (res.type == 'auth/updateProfile/pending') {
                  console.log('Profile Updated error to server.');
                }
              });
            } else {
              console.log('No rename record found local');
            }
          },
        );
      });
    }
  };
  const UploadUserProfileImage = async (userKey, userId, userName) => {
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_profile_pic where isDeleted = 0 AND uppId = 0 AND uId = ?',
          [userId],
          async (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              if (temp[0].code) {
                await checkPermissionRead(
                  userName,
                  userId,
                  temp[0].code,
                  'profile',
                  '',
                  'profile_pic',
                );
              }
            } else {
              console.log('No rename record found local');
            }
          },
        );
      });
    }
  };

  /* update server data when end */
  const apiCallforSongsUpload = async (arryObjDatas, userKey, userName) => {
    if (arryObjDatas) {
      arryObjDatas.map(async sg => {
        var ext = sg.fileName.substr(sg.fileName.lastIndexOf('.') + 1);

        const uploadData = {
          file_name: sg.fileName,
          uploadFile: 'data:' + ext + ';base64,' + sg.fileData, //sg.image_data,
          user_key: userKey,
          user_name: userName,
        };

        if (sg.usrFldr == 'user_folder') {
          await dispatch(uploadDocumentation(uploadData)).then(res => {
            console.log('uploadDocumentation1' + JSON.stringify(res));
            if (res.type == 'auth/uploadDoc/fulfilled') {
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE tbl_user_files set serverSGId =?, folder_id  =?, code =? where id=?',
                  [
                    res.payload.id,
                    res.payload.folderid,
                    res.payload.fcode,
                    sg.id,
                  ],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      db.transaction(tx => {
                        tx.executeSql(
                          'SELECT * FROM tbl_user_folder where isDeleted = 0 AND uId = ?',
                          [userId],
                          (tx, results) => {
                            var userFoldr = [];
                            for (let i = 0; i < results.rows.length; i++) {
                              userFoldr.push(results.rows.item(i));
                            }

                            if (userFoldr.length == 0) {
                              let sql1 =
                                'INSERT INTO tbl_user_folder (sufId, uId, year, week, isDeleted, date_last_change) values (?, ?, ?, ?, ?, ?)';
                              let params1 = [
                                res.payload.folderid,
                                userId,
                                res.payload.year,
                                res.payload.week,
                                0,
                                new Date().toISOString(),
                              ]; //storing user data in an array
                              db.executeSql(
                                sql1,
                                params1,
                                result1 => {
                                  setFileArryObjData('');
                                },
                                error => {
                                  console.log(
                                    'Create song error in local db',
                                    error,
                                  );
                                },
                              );
                            } else {
                              setFileArryObjData('');
                              console.log('local songs update not available');
                            }
                          },
                        );
                      });
                    } else {
                      console.log('local songs update failed');
                    }
                  },
                );
              });
            }
          });
        } else if (sg.usrFldr == 'profile_pic') {
          const userPic = {
            img_name: sg.fileName,
            profile_img: 'data:' + ext + ';base64,' + sg.fileData,
            user_key: userKey,
            user_name: userName,
          };

          await dispatch(uploadProfileImage(userPic)).then(res => {
            if (res.type == 'auth/uploadProfilePicture/fulfilled') {
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE tbl_user_profile_pic set uppId = ? , year = ?, week= ?, code =? where uId= ?',
                  [
                    res.payload.id,
                    res.payload.year,
                    res.payload.week,
                    res.payload.img,
                    sg.id,
                  ],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      setFileArryObjData('');
                      console.log('local profile picture updated in db');
                    } else console.log('local setlist update failed');
                  },
                );
              });
            } else if (res.type == 'auth/uploadProfilePicture/pending') {
              console.log('Profile Updated pending to server.');
            }
          });
        } else {
          await dispatch(uploadDocumentation(uploadData)).then(res => {
            if (res.type == 'auth/uploadDoc/fulfilled') {
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE tbl_user_files set serverSGId =?, folder_id  =?, code =? where id=?',
                  [
                    res.payload.id,
                    res.payload.folderid,
                    res.payload.fcode,
                    sg.id,
                  ],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      setFileArryObjData('');
                      console.log('local songs updated serverId');
                    } else {
                      //setFileArryObjData('');
                      console.log('local songs update failed serverId');
                    }
                  },
                );
              });
            }
          });
        }
      });
    }
  };
  /* file permission code start*/
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
  const checkPermissionRead = async (
    userName,
    id,
    filename,
    type,
    img64Bit,
    usrFldr,
  ) => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    const hasPermission = await hasFilesPermission();

    if (!hasPermission) {
      return;
    }
    if (hasPermission) {
      await createPersistedFolder(
        userName,
        id,
        filename,
        type,
        img64Bit,
        usrFldr,
      );
    }
  };
  const createPersistedFolder = async (
    userName,
    id,
    filename,
    type,
    img64Bit,
    usrFldr,
  ) => {
    var folderName = 'songanize';
    if (type == 'profile' || type == 'profilePic') {
      folderName = 'songanizeshare';
    }
    try {
      const filesDir =
        Platform.OS === 'android'
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;
      const folderPath = `${filesDir}/${userName}/${folderName}`;

      console.log('uploadSngPath==' + folderPath);

      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        RNFS.mkdir(folderPath)
          .then(() => {
            console.log('songanizeshare Folder created successfully');
          })
          .catch(error => {
            console.error('Error creating folder:', error);
          });

        if (img64Bit) {
          var path = folderPath + '/' + filename;

          const {config, fs} = RNFetchBlob;
          fs.writeFile(path, img64Bit, 'base64').then(res => {
            console.log('File Id: ', res);
            console.log('File Saved successfully to local folder');
          }).catch;
          err => console.log('err File not saved', err)();
        }
      } else {
        await RNFS.exists(folderPath)
          .then(async result => {
            const chooseFile = 'file:/' + folderPath + '/' + filename;

            await RNFS.exists(chooseFile)
              .then(result => {
                if (result) {
                  RNFetchBlob.fs
                    .readFile(chooseFile, 'base64')
                    .then(async data => {
                      setFileUploadData(data);
                      const arryObj = [
                        {
                          id: id,
                          fileData: data,
                          fileName: filename,
                          type: type,
                          usrFldr: usrFldr,
                        },
                      ];
                      setFileArryObjData(arryObj);
                    });
                } else {
                  console.log('file does not exists');
                }
              })
              .catch(err => {
                console.log(err.message);
              });
            if (img64Bit) {
              var path = folderPath + '/' + filename;

              const {config, fs} = RNFetchBlob;
              fs.writeFile(path, img64Bit, 'base64').then(res => {
                console.log('File Id songsss: ', res + filename);
                console.log('File Saved successfully to local folder');
              }).catch;
              err => console.log('err File not saved', err)();
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    } catch (error) {
      console.error('Error creating persisted folder:', error);
    }
  };

  const checkFileExist = async (code, userid, userKey, userName) => {
    if (code && userName) {
      try {
        const folderName = 'songanize';
        const filesDir =
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : RNFS.DocumentDirectoryPath;
        const folderPath = `${filesDir}/${userName}/${folderName}`;

        var path = folderPath + '/' + code;
        await RNFS.exists(path)
          .then(result => {
            if (result == false) {
              const downloadFile = {
                code: code,
                userid: userid,
                user_key: userKey,
                user_name: userName,
              };
              dispatch(downloadSongAction(downloadFile)).then(resut => {
                if (resut.type == 'auth/downloadSonganize/fulfilled') {
                  var img64Bit = resut.payload.file_data;
                  const {config, fs} = RNFetchBlob;
                  fs.writeFile(path, img64Bit, 'base64').then(res => {
                    console.log('File Id: ', res);
                    console.log('File Saved successfully to local folder');
                  }).catch;
                  err => console.log('err File not saved', err)();
                }
              });
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      } catch (error) {
        console.error('Error creating persisted folder:', error);
      }
    } else {
      console.log('File Does not exist here.');
    }
  };
  const checkFileExistProfilePic = async (
    userKey,
    userName,
    shareimgName,
    sharedSong,
    img64Bit,
  ) => {
    if (userKey) {
      try {
        const folderName = 'songanizeshare';
        const filesDir =
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : RNFS.DocumentDirectoryPath;
        const folderPath = `${filesDir}/${userName}/${folderName}`;

        const folderExists = await RNFS.exists(folderPath);
        if (!folderExists) {
          RNFS.mkdir(folderPath)
            .then(() => {
              console.log('songanizeshare Folder created successfully');
              const userPic = {
                //userId: userId,
                user_key: userKey,
                user_name: userName,
              };

              dispatch(getProfileImage(userPic)).then(res => {
                if (res.type == 'auth/getProfilePicture/fulfilled') {
                  if (res.payload.file_data) {
                    var prfImage = res.payload.file_data.split(',');
                    var path = folderPath + '/' + res.payload.image_code;
                    var img64BitData = prfImage[1];
                    const {config, fs} = RNFetchBlob;
                    fs.writeFile(path, img64BitData, 'base64').then(res => {
                      console.log('File Id profilepic2: ', res);
                      console.log('File Saved successfully to local folder');
                    }).catch;
                    err => console.log('err File not saved', err)();
                  }
                }
              });
            })
            .catch(error => {
              console.error('Error creating folder:', error);
            });
        } else {
          await RNFS.exists(folderPath)
            .then(result => {
              if (result) {
                const userPic = {
                  user_key: userKey,
                  user_name: userName,
                };
                dispatch(getProfileImage(userPic)).then(res => {
                  if (res.type == 'auth/getProfilePicture/fulfilled') {
                    if (res.payload.file_data) {
                      var prfImage = res.payload.file_data.split(',');
                      var path = folderPath + '/' + res.payload.image_code;
                      var img64Bit = prfImage[1];
                      const {config, fs} = RNFetchBlob;
                      fs.writeFile(path, img64Bit, 'base64').then(res => {
                        console.log('File Id profilepic1: ', res);
                        console.log('File Saved successfully to local folder');
                      }).catch;
                      err => console.log('err File not saved', err)();
                    }
                  }
                });
              }
            })
            .catch(err => {
              console.log(err.message);
            });
        }
      } catch (error) {
        console.error('Error creating persisted folder:', error);
      }
    } else {
      try {
        const folderName = 'songanizeshare';
        const filesDir =
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : RNFS.DocumentDirectoryPath;
        const folderPath = `${filesDir}/${userName}/${folderName}`;

        const folderExists = await RNFS.exists(folderPath);
        if (!folderExists) {
          RNFS.mkdir(folderPath)
            .then(() => {
              console.log('songanizeshare Folder created successfully');
              if (img64Bit) {
                var path = folderPath + '/' + shareimgName;
                const {config, fs} = RNFetchBlob;
                fs.writeFile(path, img64Bit, 'base64').then(res => {
                  console.log('File Id proImg: ', res + sharedSong);
                  console.log('File Saved successfully to local folder');
                }).catch;
                err => console.log('err File not saved', err)();
              }
            })
            .catch(error => {
              console.error('Error creating folder:', error);
            });
        } else {
          await RNFS.exists(folderPath)
            .then(result => {
              if (result) {
                if (img64Bit) {
                  var path = folderPath + '/' + shareimgName;
                  const {config, fs} = RNFetchBlob;
                  fs.writeFile(path, img64Bit, 'base64').then(res => {
                    console.log('File Id proImg: ', res + sharedSong);
                    console.log('File Saved successfully to local folder');
                  }).catch;
                  err => console.log('err File not saved', err)();
                }
              }
            })
            .catch(err => {
              console.log(err.message);
            });
        }
      } catch (error) {
        console.error('Error creating persisted folder:', error);
      }
    }
  };
  /* file permission code end*/
  return <>{loading ? <Loader loading={loading} /> : ''}</>;
};
export default AppWrapper;
