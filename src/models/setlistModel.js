import {Alert} from 'react-native';

import {openDatabase} from 'react-native-sqlite-storage';

export async function fetchSetListingsModel(userKey, userName, userId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT DISTINCT s.id AS sid, event_name as event, groups as group_names, date_event as event_date FROM tbl_setlist AS s inner join (SELECT DISTINCT evId, eg.isDeleted, GROUP_CONCAT(DISTINCT g_name) AS groups FROM tbl_event_groups AS eg inner join tbl_groups AS g on g.serverId = gId where eg.isDeleted=0 GROUP BY evId) AS e on e.evId = s.id WHERE uId = ? ORDER BY date_event DESC',
          [userId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
            }
            resolve(temp);
          },
          function (error) {
            reject(false);
            throw new Error('Error: ' + error);
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
  });
}

export async function updateSetListDataModel(
  userId,
  eventName,
  eventDate,
  itemId,
  gid,
) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    if (gid.length > 0) {
      let sql2 = 'UPDATE tbl_event_groups set isDeleted=? where evId=?';
      let params2 = [1, itemId]; //storing user data in an array
      db.executeSql(
        sql2,
        params2,
        result => {
          console.log('local event group delete sucessfully');
        },
        error => {
          console.log('Create user error', error);
        },
      );
    }

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tbl_setlist set event_name=? , date_event = ? where id= ?',
        [eventName, eventDate, itemId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM tbl_event_groups WHERE evId= ? AND gId= ? AND isDeleted = 0',
                [itemId, gid],
                (tx, result) => {
                  var leng = result.rows.length;

                  if (leng == 0) {
                    let sql3 =
                      'INSERT INTO tbl_event_groups (serverEGId, uId, gId, evId, isDeleted) values (?, ?, ?, ?, ?)';
                    let params3 = [0, userId, gid, itemId, 0]; //storing user data in an array
                    db.executeSql(
                      sql3,
                      params3,
                      result => {
                        //console.log('local event group updated sucessfully');
                      },
                      error => {
                        //console.log('Create user error', error);
                      },
                    );
                  }
                },
              );
            });
            db.transaction(
              tx => {
                tx.executeSql(
                  'SELECT s.id AS sid, event_name, groups, date_event FROM tbl_setlist AS s inner join (SELECT evId, eg.isDeleted, GROUP_CONCAT(g_name) AS groups FROM tbl_event_groups AS eg inner join tbl_groups AS g on g.serverId = gId where eg.isDeleted=0 GROUP BY evId) AS e on e.evId = s.id WHERE s.id = ? ORDER BY date_event DESC',
                  [itemId],
                  (tx, resultsedit) => {
                    var setListED = [];
                    for (let i = 0; i < resultsedit.rows.length; ++i) {
                      setListED.push(resultsedit.rows.item(i));
                    }
                    resolve(setListED);
                  },
                  function (error) {
                    reject(false);
                    throw new Error('Error: ' + error);
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
          } else Alert.alert('Updation Failed');
        },
      );
    });
  });
}

export async function createSetListDataModel(
  userId,
  eventName,
  eventDate,
  resArray,
) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    let sql1 =
      'INSERT INTO tbl_setlist (serverSLId, uId, event_name, isDeleted, date_event) values (?, ?, ?, ?, ?)';
    let params1 = [0, userId, eventName, 0, eventDate];
    db.executeSql(
      sql1,
      params1,
      result => {
        if (resArray.length > 0) {
          resArray.map(gid => {
            let sql2 =
              'INSERT INTO tbl_event_groups (serverEGId, uId, gId, evId, isDeleted) values (?, ?, ?, ?, ?)';
            let params2 = [0, userId, gid, result.insertId, 0]; //storing user data in an array
            db.executeSql(
              sql2,
              params2,
              result2 => {
                db.transaction(
                  tx => {
                    tx.executeSql(
                      'SELECT s.id AS sid, event_name, groups, date_event FROM tbl_setlist AS s inner join (SELECT evId, GROUP_CONCAT(g_name) AS groups FROM tbl_event_groups inner join tbl_groups AS g on g.serverId = gId GROUP BY evId) AS e on e.evId = s.id WHERE s.id = ? ORDER BY date_event DESC',
                      [result.insertId],
                      (tx, resultsedit) => {
                        var setListED = [];
                        for (let i = 0; i < resultsedit.rows.length; ++i) {
                          setListED.push(resultsedit.rows.item(i));
                        }
                        resolve(setListED);
                      },
                      function (error) {
                        reject(false);
                        throw new Error('Error: ' + error);
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
              },
              error => {
                console.log('Create user error', error);
              },
            );
          });
        } else {
          db.transaction(
            tx => {
              tx.executeSql(
                'SELECT s.id AS sid, event_name, date_event FROM tbl_setlist AS s WHERE s.id = ? ORDER BY date_event DESC',
                [result.insertId],
                (tx, resultsedit) => {
                  var setListED = [];
                  for (let i = 0; i < resultsedit.rows.length; ++i) {
                    setListED.push(resultsedit.rows.item(i));
                  }
                  resolve(setListED);
                },
                function (error) {
                  reject(false);
                  throw new Error('Error: ' + error);
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
        }
      },
      error => {
        console.log('Create user error', error);
      },
    );
  });
}

export async function searchSetListDataModel(userId, input) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT s.id AS sid, event_name as event, groups as group_names, date_event as event_date FROM tbl_setlist AS s inner join (SELECT evId, eg.isDeleted, GROUP_CONCAT(g_name) AS groups FROM tbl_event_groups AS eg inner join tbl_groups AS g on g.serverId = gId where eg.isDeleted=0 GROUP BY evId) AS e on e.evId = s.id WHERE uId = ? AND (event_name LIKE ? OR group_names LIKE ?)  ORDER BY date_event DESC',
          [userId, `%${input}%`, `%${input}%`],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
            }
            resolve(temp);
          },
          function (error) {
            reject(false);
            throw new Error('Error: ' + error);
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
  });
}

export async function getSingleDataModel(songId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT DISTINCT s.id AS sid, event_name as event, groups, date_event as event_date, serverSLId as serverSetlistID FROM tbl_setlist AS s LEFT JOIN (SELECT evId, GROUP_CONCAT(DISTINCT serverId) AS groupids, GROUP_CONCAT(DISTINCT g_name) AS groups FROM tbl_event_groups AS eg inner join tbl_groups AS g on gId = g.serverId where eg.isDeleted=0 GROUP BY evId) AS e on e.evId = s.id WHERE s.id = ? ORDER BY date_event DESC',
          [songId],
          (tx, results) => {
            var temp = [];
            var leng = results.rows.length;
            if (leng > 0) {
              temp.push(results.rows.item(0));
            }
            resolve(temp);
          },
          function (error) {
            reject(false);
            throw new Error('Error: ' + error);
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
  });
}

export async function getSingleEditDataModel(itemId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT s.id AS sid, event_name, groups, groupids, date_event FROM tbl_setlist AS s inner join (SELECT evId, eg.isDeleted, GROUP_CONCAT(gId) AS groupids, GROUP_CONCAT(g_name) AS groups FROM tbl_event_groups AS eg inner join tbl_groups AS g on g.serverId = gId where eg.isDeleted=0 GROUP BY evId) AS e on e.evId = s.id WHERE s.id = ? ORDER BY date_event DESC',
          [itemId],
          (tx, results) => {
            var temp = [];
            var leng = results.rows.length;
            if (leng > 0) {
              temp.push(results.rows.item(0));
            }
            resolve(temp);
          },
          function (error) {
            reject(false);
            throw new Error('Error: ' + error);
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
  });
}

export async function fetchGroupsNamesModel(userKey, userName, userId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_groups_users AS u LEFT JOIN tbl_groups AS g ON u.gId  = g.serverId WHERE u.uId = ?  AND u.isDeleted = 0 AND g.isDeleted = 0 ORDER BY g_name ASC',
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

                    db.transaction(tx => {
                      tx.executeSql(
                        'SELECT * FROM tbl_event_groups WHERE id= ? AND gId= ? AND isDeleted = 0',
                        [itemId, value],
                        (tx, result) => {
                          var leng = result.rows.length;
                          if (leng > 0) {
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
  });
}
