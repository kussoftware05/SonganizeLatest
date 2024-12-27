import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import backgroundImage from '../../images/background.png';
import LogoImage from '../../components/logo_image';
import {useNavigation} from '@react-navigation/native';
import TextForm from '../../components/forms/TextForm';
import Loader from '../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userLogin} from '../../redux/services/authActions';

import {COLORS} from '../../constant/Colors';
import AppButton from '../../components/forms/AppButton';
import {verticalScale} from '../../components/scale';
import {getsetLists} from '../../redux/services/setlistAction';
import {getGroupLists} from '../../redux/services/groupAction';
import {
  getSonganizeLists,
  hiddenSonganizeAction,
  downloadSongAction,
} from '../../redux/services/songanizeAction';
import {getProfile, getProfileImage} from '../../redux/services/profileAction';
import {
  addSQLGroups,
  addSQLSetLists,
  addSQLUser,
  addSQLSongs,
  addSQLUserProfilePic,
} from '../../util/DBManager';
import {openDatabase} from 'react-native-sqlite-storage';
// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

var db = openDatabase({name: 'Songanizeoffline.db'});

const LoginScreens = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errortext, setErrortext] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [userKey, setUserKey] = useState('');
  const [userName, setUserName] = useState('');

  const emailInput = useRef();
  const passwordInput = useRef();

  // redirect authenticated user to profile screen
  useEffect(() => {
    readUserId('user_id');
    readUserKey('user_key');
    readUserName('user_name');
  }, [userKey, userName, userId]);

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (userKey !== '' && userKey !== '' && userId !== '') {
      navigation.replace('LoadingScreen');
    }
  }, [userKey, userName, userId]);

  // read storage data userID

  const readUserId = async user_id => {
    try {
      const userId1 = await AsyncStorage.getItem(user_id);
      if (userId1 !== null) {
        setUserId(userId1);
      }
    } catch (e) {
      alert('Failed to fetch the data from storage');
    }
  };
  const readUserName = async user_name => {
    try {
      const username1 = await AsyncStorage.getItem(user_name);
      if (username1 !== null) {
        setUserName(username1);
      }
    } catch (e) {
      Alert.alert('Failed to fetch the data from storage');
    }
  };
  const readUserKey = async user_key => {
    try {
      const userKey1 = await AsyncStorage.getItem(user_key);
      if (userKey1 !== null) {
        setUserKey(userKey1);
      }
    } catch (e) {
      alert('Failed to fetch the data from storage');
    }
  };

  const handleSubmitPress = async () => {
    if (!email) {
      emailInput.current.validateEmail();
    } else if (!password) {
      passwordInput.current.validateEmail();
    } else {
      const user = {
        //isLoggedIn: true,
        email: email,
        password: password,
      };
      setLoading(true);
      //dispatch(userLogin(user));
      setLoading(false);

      await dispatch(userLogin(user)).then(async res => {
        //setLoading(true);
        if (res.type == 'auth/login/rejected') {
          setLoading(false);
          setErrortext(res.payload);
        } else if (res.type == 'auth/login/fulfilled') {
          // navigation.replace('DrawerNavigationRoutes');
          navigation.replace('LoadingScreen');

          //RNRestart.restart();

          setUserId(res.payload.userid);
          setUserKey(res.payload.user_key);
          setUserName(res.payload.user_name);
          try {
            if (
              res.payload.userid &&
              res.payload.user_key &&
              res.payload.user_name
            ) {
              //console.log("login-userid"+ userid+ user_key +'======'+user_name);
              await allFunctions(
                res.payload.user_key,
                res.payload.userid,
                res.payload.user_name,
              );
              setLoading(false);
            }
          } catch (error) {
            console.log('error' + error);
            // return custom error message from API if any
          }
        }
      });
    }
  };
  const allFunctions = async (userKey, userId, userName) => 
  {
    await fetchUserData(userKey, userId, userName);
    await fetchGroupData(userKey, userId, userName);
    await fetchSongsData(userKey, userId, userName);
    await fetchSetListData(userKey, userId, userName);
    await fetchHiddenSongsData(userKey, userId, userName);
  };
  /* fetch server data after login start */

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
                      user_key: userKey,
                      user_name: userName,
                    };
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
            //console.log('No user found in server');
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
                      console.log('mapSonglist13-->' + len);
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
                                        userName,
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
                                        userName,
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
                            '',
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
                    [grp.id, grp.userid],
                    async (tx, results) => {
                      var len = results.rows.length;

                      if (len == 0) {
                        db.transaction(tx => {
                          tx.executeSql(
                            'SELECT * FROM tbl_user_files where serverSGId = ? AND uId = ?',
                            [grp.id, grp.shared_by_userid],
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
                                        console.log(
                                          'Create song error in local db',
                                          error,
                                        );
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
                                                userName,
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
                                                userName,
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
                        console.log('No new record found in table');
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
  /* fetch server data after login end */

  const checkFileExist = async (code, userid, userKey, userName) => {
    if (code) {
      try {
        const folderName = 'songanize';
        const filesDir =
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : RNFS.DocumentDirectoryPath;
        const folderPath = `${filesDir}/${folderName}`;

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
        const folderPath = `${filesDir}/${folderName}`;

        const folderExists = await RNFS.exists(folderPath);
        if (!folderExists) {
          RNFS.mkdir(folderPath)
            .then(() => {
              console.log('songanizeshare Folder created successfully');
              const userPic = {
                user_key: userKey,
                user_name: userName,
              };

              dispatch(getProfileImage(userPic)).then(res => {
                if (res.type == 'auth/getProfilePicture/fulfilled') {
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
              });
            })
            .catch(error => {
              console.error('Error creating folder:', error);
            });
        } else {
          await RNFS.exists(folderPath)
            .then(result => {
              console.log(result);
              if (result) {
                const userPic = {
                  user_key: userKey,
                  user_name: userName,
                };
                dispatch(getProfileImage(userPic)).then(res => {
                  if (res.type == 'auth/getProfilePicture/fulfilled') {
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
        const folderPath = `${filesDir}/${folderName}`;

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
              console.log(result);
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
  return (
    <View style={styles.wholePage}>
      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="always">
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImageStyle}
          resizeMode="cover">
          <View style={styles.innerContainer}>
            <View style={styles.middleArea}>
              <LogoImage />
              <View style={styles.innerBox}>
                <TextForm
                  placeholder="E-Mail or Username"
                  type="text"
                  isRequired={true}
                  ref={emailInput}
                  onChangeText={setEmail}
                  className="inputViewTextIcon"
                  returnKeyType="next"
                  onSubmitEditing={e => passwordInput.current.focus(e)}
                  blurOnSubmit={false}
                />
                <TextForm
                  placeholder="Password"
                  type="password"
                  isRequired={true}
                  secureTextEntry={true}
                  ref={passwordInput}
                  onChangeText={setPassword}
                />
                {errortext != '' ? (
                  <Text style={styles.errorTextStyle}> {errortext} </Text>
                ) : null}
                <View style={styles.forgotPassword}>
                  <TouchableOpacity>
                    <Text
                      style={styles.forgotPasswordText}
                      onPress={() => navigation.navigate('ForgotPassword')}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.loginButton}>
                  <AppButton
                    onPress={() => handleSubmitPress()}
                    title="LOGIN"
                    backgroundColor={COLORS.editButtonColor}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.registrationButton}
                onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.registrationText}>FREE REGISTRATION</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};
export default LoginScreens;

const styles = StyleSheet.create({
  wholePage: {
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '70%',
  },
  textInputStyle: {
    width: '80%',
    marginTop: 16,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  loginButtonsStyle: {
    width: '50%',
    marginTop: 16,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#FE6518',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registrationButton: {
    marginTop: 20,
    padding: 2,
    width: '100%',
    height: verticalScale(35),
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 6,
    backgroundColor: COLORS.registratioButton,
  },
  registrationText: {
    color: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
    letterSpacing: 1,
    justifyContent: 'space-between',
  },
  middleArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  innerBox: {
    width: '100%',
    marginTop: 50,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 10,
    backgroundColor: '#141414',
    opacity: 0.9,
  },
  forgotPassword: {
    marginTop: -7,
    width: '100%',
    alignItems: 'flex-end',
  },
  loginButton: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#fff',
    marginTop: 0,
    fontSize: 17,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
