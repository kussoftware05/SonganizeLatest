import {
  createGroup,
  deleteGroup,
  updateGroup
} from '../redux/services/groupAction';
import {openDatabase} from 'react-native-sqlite-storage';

  /* update data from local to server when online start*/
  export async function updateGroupServerAPI(
    userKey, userId, userName, dispatch
  ) {
    var db = openDatabase({name: 'Songanizeoffline.db'});
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_groups where isDeleted = 0 AND serverId = 0 AND uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(us => {
                const group = {
                  group_name: us.g_name,
                  userid: us.uId,
                  user_key: userKey,
                  user_name: userName,
                };
                dispatch(createGroup(group)).then(res => {
                  
                  if (res.type == 'auth/createGroup/fulfilled') {
                    // console.log('Group Created successfully to server.');
                    db.transaction(tx => {
                      tx.executeSql(
                        'UPDATE tbl_groups set serverId=? where id=?',
                        [res.payload.id, us.id],
                        (tx, results) => {
                          //console.log('Results', results.rowsAffected);
                          if (results.rowsAffected > 0) {
                            //console.log('local group updated');
                            db.transaction(tx => {
                              tx.executeSql(
                                'UPDATE tbl_groups_users set gId =? where ufId =?',
                                [res.payload.id, us.id],
                                (tx, results) => {
                                  //console.log('Results', results.rowsAffected);
                                  // if (results.rowsAffected > 0) {
                                  //   console.log('local group user updated');
                                  // } else console.log('local group update failed');
                                },
                              );
                            });
                          } else console.log('local group update failed');
                        },
                      );
                    });
                  }
                });
              });
              //}
            } else {
              console.log('No new record found local');
            }
          },
        );
      });
    }
  };
  export async function updateEditGroupServerAPI(
    userKey, userId, userName, dispatch
  ) {
    db = openDatabase({name: 'Songanizeoffline.db'});
    if (userKey) {
      
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_groups where isDeleted = 0 AND uId = ?',
          [userId],
          (tx, results) => {
            //console.log('results.rows.length-->' + results.rows.length);
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              //console.log('temp.length-->' + JSON.stringify(temp));
              temp.map(us => {
                const updateData = {
                  group_name: us.g_name,
                  groupId: us.serverId,
                  user_key: userKey,
                  user_name: userName,
                };
                dispatch(updateGroup(updateData)).then(res => {
                  if (res.type == 'auth/updateGroup/fulfilled') {
                    //console.log('Songs successfully updated to server.');
                  }
                });
              });
            } else {
              //console.log('No rename record found local');
            }
          },
        );
      });
    }
  };
  export async function deleteGroupServerAPI(
    userKey, userId, userName, dispatch
  ) {
    db = openDatabase({name: 'Songanizeoffline.db'});
    if (userKey) {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_groups where isDeleted = 1 AND uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; i++) {
              temp.push(results.rows.item(i));
            }
            if (temp.length > 0) {
              temp.map(us => {
                const updateData = {
                  id: us.serverId,
                  uid: us.uId,
                  user_key: userKey,
                  user_name: userName,
                };
                dispatch(deleteGroup(updateData)).then(res => {
                 // console.log("deleteGroup45"+ JSON.stringify(res))
                  if (res.type == 'auth/deleteGroup/rejected') {
                    console.log('not able to delete data from server');
                  } else {
                    console.log('Group Deleted successfully.');
                  }
                });
              });
              //}
            } else {
              //console.log('No new record found local');
            }
          },
        );
      });
    }
  };
    /* update data from local to server when online end*/
