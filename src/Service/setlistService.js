import {
  createSetlist
} from '../redux/services/setlistAction';
import {openDatabase} from 'react-native-sqlite-storage';

export async function createSetListServerAPI(
  sid,
  userKey,
  userId,
  userName,
  dispatch,
) {
  if (userKey) {
    var db = openDatabase({name: 'Songanizeoffline.db'});
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_setlist where isDeleted = 0 AND serverSLId = 0 AND uId = ? AND id = ?',
        [userId, sid],
        (tx, result) => {
          for (let i = 0; i < result.rows.length; i++) {
            let row = result.rows.item(i);
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM tbl_event_groups where isDeleted = 0 AND evId = ? AND uId = ?',
                [row.id, userId],
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
                    event: row.event_name,
                    gid: gidArray, 
                    event_date: row.date_event,
                    flag: 'create',
                    user_key: userKey,
                    user_name: userName,
                  };

                  
                  dispatch(createSetlist(setlist)).then(res => {
                    
                    if (res.type == 'auth/createsetlist/fulfilled') {
                      db.transaction(tx => {
                        tx.executeSql(
                          'UPDATE tbl_setlist set serverSLId= ? where id= ?',
                          [res.payload.id, row.id],
                          (tx, results) => {
                            if (results.rowsAffected > 0) {
                              console.log('local setlist updated');
                            } else console.log('local setlist update failed');
                          },
                        );
                      });
                    }
                  });
                },
              );
            });
          }
        },
      );
    });
  }
}
export async function updateSetListServerAPI(
  sid,
  userKey,
  userId,
  userName,
  dispatch,
) {
  if (userKey) {
    var db = openDatabase({name: 'Songanizeoffline.db'});
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_setlist where isDeleted = 0 AND serverSLId != 0 AND uId = ? AND id = ?',
        [userId, sid],
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
}
