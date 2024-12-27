import {
  uploadDocumentation,
  updateSonganizeAction,
  deleteSongAction,
  hiddenToListSonganizeAction,
  updatehideSonganizeAction,
} from '../redux/services/songanizeAction';
import {openDatabase} from 'react-native-sqlite-storage';

const uploadFiletoServer = async (
  res,
  randomName,
  getExtension,
  userKey,
  userId,
  userName,
  dispatch,
  id,
) => {
  return new Promise(async (resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    const uploadData = {
      file_name: randomName,
      uploadFile: 'data:' + getExtension + ';base64,' + res,
      user_key: userKey,
      user_name: userName,
    };
    await dispatch(uploadDocumentation(uploadData)).then(res => {
      if (res.type == 'auth/uploadDoc/fulfilled') {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE tbl_user_files set serverSGId =?, folder_id  =?, code =? where id=?',
            [res.payload.id, res.payload.folderid, res.payload.fcode, id],
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
                            resolve('success');
                          },
                          function (error) {
                            reject(undefined);
                            throw new Error('error: ' + error.message);
                          },
                          function () {
                            console.log('ok');
                          },
                        );
                      } else {
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
  });
};
export async function updateSongsServerAPI(
  res,
  randomName,
  getExtension,
  userKey,
  userId,
  userName,
  dispatch,
) {
  var db = openDatabase({name: 'Songanizeoffline.db'});
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
                  console.log('results.rows.length76-->' + results.rows.length);
                  var temp = [];
                  for (let i = 0; i < results.rows.length; i++) {
                    temp.push(results.rows.item(i));
                  }

                  if (temp.length > 0) {
                    temp.map(async sg => {
                      await uploadFiletoServer(
                        res,
                        randomName,
                        getExtension,
                        userKey,
                        userId,
                        userName,
                        dispatch,
                        sg.id,
                      );
                    });
                    //}
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
                              await uploadFiletoServer(
                                res,
                                randomName,
                                getExtension,
                                userKey,
                                userId,
                                userName,
                                dispatch,
                                sg.id,
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
                      await uploadFiletoServer(
                        res,
                        randomName,
                        getExtension,
                        userKey,
                        userId,
                        userName,
                        dispatch,
                        sg.id,
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
                              await uploadFiletoServer(
                                res,
                                randomName,
                                getExtension,
                                userKey,
                                userId,
                                userName,
                                dispatch,
                                sg.id,
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
}
export async function updateHiddenSongsServerAPI(
  itemId,
  userKey,
  userId,
  userName,
  dispatch,
) {
  var db = openDatabase({name: 'Songanizeoffline.db'});
  if (userKey && userName) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_files_hidden where uId = ? AND ufhId = ? AND isDeleted = 0',
        [userId, itemId],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            temp.map(ush => {
              if (ush.file_id) {
                const user = {
                  user_key: userKey,
                  user_name: userName,
                  songid: ush.file_id,
                };
                dispatch(updatehideSonganizeAction(user)).then(res => {
                  console.log('updatehideSonganizeAction-->' + JSON.stringify(res));
                  if (res.type == 'auth/updatehideSonganize/fulfilled') {
                    console.log('updatehideSonganizeAction-->' + 'success');
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
              }
            });
          } else {
            console.log('No new record found');
          }
        },
      );
    });
  }
}
export async function removeHiddenSongsServerAPI(
  itemId,
  userKey,
  userId,
  userName,
  dispatch,
) {
  var db = openDatabase({name: 'Songanizeoffline.db'});
  if (userKey && userName) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_files_hidden where uId = ? AND ufhId = ? AND isDeleted = 1',
        [userId, itemId],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            console.log('hiddenToListSonganizeAction' + JSON.stringify(temp));
            temp.map(ush => {
              if (ush.ServerhId) {
                const item = {
                  id: ush.ServerhId,
                  user_name: userName,
                  user_key: userKey,
                };
                dispatch(hiddenToListSonganizeAction(item)).then(res => {
                  console.log('hidetolist' + JSON.stringify(res));
                  if (res.type == 'auth/hiddenToListSonganize/fulfilled') {
                    console.log('hiddenToListSonganize -> success');
                    db.transaction(tx => {
                      tx.executeSql(
                        'UPDATE tbl_user_files_hidden set ServerhId=? where file_id=? AND uId = ?',
                        [0, ush.file_id, ush.uId],
                        (tx, results) => {
                          if (results.rowsAffected > 0) {
                            console.log('local hidden list updated');
                          } else console.log('local hidden list update failed');
                        },
                      );
                    });
                  }
                });
              }
            });
          } else {
            console.log('No new record found');
          }
        },
      );
    });
  }
}
export async function updateEditSongsServerAPI(
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
) {
  var db = openDatabase({name: 'Songanizeoffline.db'});
  if (userKey) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_files where isDeleted = 0 AND serverSGId != 0 AND uId = ? AND id = ?',
        [userId, itemId],
        (tx, results) => {
          var leng = results.rows.length;
          var temp = [];
          if (leng > 0) {
            for (let i = 0; i < leng; i++) {
              let row = results.rows.item(i);

              let item = {
                action: 'edit_song',
                id: row.serverSGId,
                link: youtubeLink,
                title: titleData,
                key: key,
                genre: generate,
                writer: writterBy,
                interpret: interpreet,
                category: type,
                file: file,
                user_key: userKey,
                user_name: userName,
              };

              dispatch(updateSonganizeAction(item)).then(res => {
                if (res.type == 'auth/updateSonganize/rejected') {
                  //setErrortext(res.payload);
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
          }
        },
      );
    });
  }
}

export async function deleteSongsServerAPI(
  songDelete,
  userKey,
  userId,
  userName,
  dispatch,
) {
  if (userKey) {
    var db = openDatabase({name: 'Songanizeoffline.db'});
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_files where isDeleted = 1 AND uId = ? AND id = ?',
        [userId, songDelete],
        (tx, results) => {
          for (let i = 0; i < results.rows.length; i++) {
            let row = results.rows.item(i);
            const updateData = {
              id: row.serverSGId,
              user_key: userKey,
              user_name: userName,
            };

            dispatch(deleteSongAction(updateData)).then(res => {
              if (res.type == 'auth/songanizeDelete/rejected') {
                console.log('not able to delete data from server');
              } else {
                console.log('Song Deleted successfully.');
              }
            });
          }
        },
      );
    });
  }
}
