import {Alert, Platform, PermissionsAndroid} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

//SQLite.enablePromise(true);
SQLite.DEBUG(true);

const database_name = 'Songanizeoffline.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Offline Database';
const database_size = 200000;

const db = SQLite.openDatabase(
  {
    name: database_name,
    version: database_version,
    displayName: database_displayname,
    size: database_size,
    location: 'default',
  },
  () => {
    //console.log('database created success');
  },
  error => {
    //console.log(error);
  },
);
export default db;

//create Group table function
export const createGroupTable = () => {};

//create Setlist table function
export const createSetlistTable = () => {
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_setlist (id INTEGER PRIMARY KEY AUTOINCREMENT, serverSLId INT(10) NOT NULL, uId INT(10) NOT NULL, event_name VARCHAR(30) NOT NULL, isDeleted BOOLEAN default 0, date_event datetime default current_timestamp)',
    [],
    result => {
      //console.log('Table SetList created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_event_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, serverEGId INT(10) NOT NULL, uId INT(10) NOT NULL, gId INT(10) NOT NULL, evId INT(10) NOT NULL, isDeleted BOOLEAN default 0)',
    [],
    result => {
      //console.log('Table SetList Event Groups created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_event_songs (id INTEGER PRIMARY KEY AUTOINCREMENT, serverESId INT(10) NOT NULL, evId INT(10) NOT NULL, uId INT(10) NOT NULL, songId INT(10) NOT NULL, isDeleted BOOLEAN default 0, date_song datetime default current_timestamp)',
    [],
    result => {
      //console.log('Table SetList Event Songs created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, serverId INT(10) NOT NULL, uId INT(10) NOT NULL, g_name VARCHAR(20) NOT NULL, isDeleted BOOLEAN default 0, date_created datetime default current_timestamp)',
    [],
    result => {
      //console.log('Table Group created successfully');
    },
    error => {
      //console.log('Create table error', error);
    },
  );
};
//create Setlist table function
export const createSongsTable = () => {
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_user_files (id INTEGER PRIMARY KEY AUTOINCREMENT, serverSGId INT(10) NOT NULL, uId INT(10) NOT NULL, folder_id INT(10) NOT NULL, code VARCHAR(30) NOT NULL, filename VARCHAR(30) NOT NULL, title VARCHAR(30) NOT NULL, interpret VARCHAR(30) NOT NULL, writer VARCHAR(30) NOT NULL, link VARCHAR(30) NOT NULL, song_key VARCHAR(30) NOT NULL, type VARCHAR(30) NOT NULL, file_type VARCHAR(30) NULL, share_image_type VARCHAR(30) NULL, category VARCHAR(30) NOT NULL, genre VARCHAR(30) NOT NULL, shared_user_profile_image_name VARCHAR(30) NULL, shared_song BOOLEAN default 0, isDeleted BOOLEAN default 0, date_timestamp datetime NOT NULL, lastchange datetime default current_timestamp)',
    [],
    result => {
      //console.log('Table User Files created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );

  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_user_files_hidden (id INTEGER PRIMARY KEY AUTOINCREMENT, ufhId INT(10) NOT NULL UNIQUE, ServerhId INT(10) NULL, uId INT(10) NOT NULL, file_id INT(10) NOT NULL, date_timestamp datetime default current_timestamp, isDeleted BOOLEAN default 0)',
    [],
    result => {
      //console.log('Table User Files Hidden created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_song_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, ufId INT(10) NOT NULL, ufhId INT(10) NOT NULL, gId INT(10) NOT NULL, songId INT(10) NOT NULL, date_timestamp datetime default current_timestamp, isDeleted BOOLEAN default 0)',
    [],
    result => {
      //console.log('Table Songs Groups created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_groups_users (id INTEGER PRIMARY KEY AUTOINCREMENT, ufId INT(10) NOT NULL, uId INT(10) NOT NULL, gId INT(10) NOT NULL,added_by_user_id INT(10) NOT NULL, date_timestamp datetime default current_timestamp, isDeleted BOOLEAN default 0)',
    [],
    result => {
      //console.log('Table Group Users created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
};
//create Users table function
export const createUsersTable = () => {
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_wp_users (id INTEGER PRIMARY KEY AUTOINCREMENT, uId INT(10) NOT NULL, user_status INT(10) default 0, user_login VARCHAR(60) NOT NULL, user_pass VARCHAR(255) NOT NULL, user_nicename VARCHAR(50) NOT NULL, user_email VARCHAR(100) NOT NULL, user_url VARCHAR(100) NOT NULL, display_name VARCHAR(250) NOT NULL, user_activation_key VARCHAR(255) NOT NULL, user_firstname VARCHAR(50) NOT NULL, user_lastname VARCHAR(50) NOT NULL, postal_code VARCHAR(30) NOT NULL, city VARCHAR(50) NOT NULL, country_code VARCHAR(50) NOT NULL, country VARCHAR(30) NOT NULL, user_key TEXT NULL,isDeleted BOOLEAN default 0, user_registered datetime NOT NULL)',
    [],
    result => {
      //console.log('Table User created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_user_folder (id INTEGER PRIMARY KEY AUTOINCREMENT, sufId INT(10) NOT NULL, uId INT(10) NOT NULL UNIQUE, year INT(10) NOT NULL, week INT(10) NOT NULL, date_last_change datetime default current_timestamp, isDeleted BOOLEAN default 0)',
    [],
    result => {
      //console.log('Table User Folder created successfully');
    },
    error => {
      //console.log('Create SetList table error', error);
    },
  );
  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_user_profile_pic (id INTEGER PRIMARY KEY AUTOINCREMENT, uId INT(10) NOT NULL, uppId INT(10) NOT NULL, year INT(10) NOT NULL, week INT(10) NOT NULL, code VARCHAR(30) NOT NULL, file_type VARCHAR(30) NULL, date_last_change datetime default current_timestamp, isDeleted BOOLEAN default 0)',
    [],
    result => {
      //console.log('Table User Profile Pic created successfully');
    },
    error => {
      //console.log('Create User table error', error);
    },
  );

  db.executeSql(
    'CREATE TABLE IF NOT EXISTS tbl_user_app (id INTEGER PRIMARY KEY AUTOINCREMENT, uId INT(10) NOT NULL, user_key VARCHAR(255) NOT NULL, device_info VARCHAR(255) NOT NULL, app_public_key VARCHAR(255) NOT NULL, timestamp datetime default current_timestamp, isDeleted BOOLEAN default 0)',
    [],
    result => {
      //console.log('Table User Profile Pic created successfully');
    },
    error => {
      //console.log('Create User table error', error);
    },
  );
};

export const dropSetlistTable = () => {
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_setlist;',
    [],
    result => {
      console.log('Table dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_event_groups;',
    [],
    result => {
      console.log('Table dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_event_songs;',
    [],
    result => {
      console.log('Table Event Songs dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE tbl_groups;',
    [],
    result => {
      console.log('Table dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );

  //db.close();
};

//create Setlist table function
export const dropSongsTable = () => {
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_user_files;',
    [],
    result => {
      console.log('Table dropped User Files successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_user_files_hidden;',
    [],
    result => {
      console.log('Table dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_song_groups;',
    [],
    result => {
      console.log('Table dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_groups_users;',
    [],
    result => {
      console.log('Table dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );

  //db.close();
};
//create Users table function
export const dropUsersTable = () => {
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_wp_users;',
    [],
    result => {
      console.log('Table wp_users dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_user_folder;',
    [],
    result => {
      console.log('Table User Folder dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_user_profile_pic;',
    [],
    result => {
      console.log('Table Profile picture dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
  db.executeSql(
    'DROP TABLE IF EXISTS tbl_user_app;',
    [],
    result => {
      console.log('Table user app dropped successfully');
    },
    error => {
      console.log('drop table error', error);
    },
  );
};

//insert a new user record
export const addSQLGroups = (
  serverId,
  uId,
  user_id,
  g_name,
  isDeleted,
  date_created,
  flag,
) => {
  if (flag == true) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_groups where serverId = ? AND uId = ?',
        [serverId, uId],
        (tx, results) => {
          var temp = [];
          var leng = results.rows.length;
          if (leng > 0) {
            temp.push(results.rows.item(0));
          }
          if (temp.length > 0) {
            let sql2 =
              'INSERT INTO tbl_groups_users (ufId, uId, gId, added_by_user_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?, ?)';
            let params2 = [temp[0].id, user_id, serverId, uId, 0, date_created]; //storing user data in an array

            db.executeSql(
              sql2,
              params2,
              result2 => {
                //console.log(JSON.stringify(result));
              },
              error => {
                //console.log('Create user error', error);
              },
            );
          }
        },
      );
    });
  } else {
    let sql =
      'INSERT INTO tbl_groups (serverId, uId, g_name, isDeleted, date_created) values (?, ?, ?, ?, ?)';
    let params = [serverId, uId, g_name, isDeleted, date_created]; //storing user data in an array

    db.executeSql(
      sql,
      params,
      result => {
        let sql2 =
          'INSERT INTO tbl_groups_users (ufId, uId, gId, added_by_user_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?, ?)';
        let params2 = [
          result.insertId,
          user_id,
          serverId,
          uId,
          0,
          date_created,
        ]; //storing user data in an array

        db.executeSql(
          sql2,
          params2,
          result2 => {
            //console.log(JSON.stringify(result));
          },
          error => {
            //console.log('Create user error', error);
          },
        );
        //Alert.alert('Success', 'Group created successfully.');
      },
      error => {
        console.log('Create user error', error);
      },
    );
  }
};
//insert a new user record
export const addSQLGroupsMember = async (
  serverId,
  uId,
  g_name,
  isDeleted,
  date_created,
  mem_data,
  pending_member,
) => {
  let sql1 =
    'INSERT INTO tbl_groups (serverId, uId, g_name, isDeleted, date_created) values (?, ?, ?, ?, ?)';
  let params1 = [serverId, uId, g_name, isDeleted, date_created]; //storing user data in an array

  db.executeSql(
    sql1,
    params1,
    result1 => {
      let sql2 =
        'INSERT INTO tbl_groups_users (ufId, uId, gId, added_by_user_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?, ?)';
      let params2 = [result1.insertId, uId, serverId, uId, 0, date_created]; //storing user data in an array

      db.executeSql(
        sql2,
        params2,
        result2 => {
          if (pending_member.length > 0) {
            pending_member.map(acreln => {
              let sql3 =
                'INSERT INTO tbl_access_relations (serverFId, invitation_status, invitation_from_id, receiver_id, receiver_email, invitation_to_group_id, canc_by_id, isDeleted, invitation_date, updated) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              let params3 = [
                acreln.acessid,
                'P',
                uId,
                0,
                acreln.email,
                serverId,
                0,
                0,
                acreln.invitation_date,
                acreln.invitation_date,
              ]; //storing user data in an array

              db.executeSql(
                sql3,
                params3,
                result3 => {
                  console.log(
                    'access relation table inserted' + JSON.stringify(result3),
                  );
                },
                error => {
                  //console.log('Create user error', error);
                },
              );
            });
          }
          if (mem_data.length > 0) {
            mem_data.map(grpMembr => {
              console.log('grpMembr--' + JSON.stringify(grpMembr));
              //Call SQLite method to insert
              if (grpMembr.id) {
                addSQLGroupsUsers(
                  result1.insertId,
                  grpMembr.id,
                  serverId,
                  uId,
                  date_created,
                );
                addSQLUserPic(
                  grpMembr.id,
                  grpMembr.username,
                  grpMembr.firstname,
                  grpMembr.familyname,
                  grpMembr.email,
                  'abcdefgh',
                  grpMembr.nicename,
                  'abc',
                  'abcd',
                  grpMembr.display_name,
                  grpMembr.postal_code,
                  grpMembr.city,
                  grpMembr.country_code,
                  grpMembr.country,
                  'abcd',
                  0,
                  grpMembr.registered,
                  grpMembr.image_id,
                  grpMembr.year,
                  grpMembr.week,
                  grpMembr.image_code,
                  grpMembr.image_type,
                  grpMembr.last_change,
                  grpMembr.file_data,
                );
              }
            });
          }
        },
        error => {
          //console.log('Create user error', error);
        },
      );
      //Alert.alert('Success', 'Group created successfully.');
    },
    error => {
      console.log('Create user error', error);
    },
  );
};
//insert a new user record
export const addSQLGroupsUsers = (
  insertId,
  added_by_user_id,
  gId,
  uId,
  date_created,
) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tbl_groups_users WHERE uId = ? AND gId = ?',
      [added_by_user_id, gId],
      (tx, result) => {
        var temp = [];
        for (let i = 0; i < result.rows.length; ++i) {
          temp.push(result.rows.item(i));
        }

        if (temp.length == 0) {
          let sql2 =
            'INSERT INTO tbl_groups_users (ufId, uId, gId, added_by_user_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?, ?)';
          let params2 = [insertId, added_by_user_id, gId, uId, 0, date_created]; //storing user data in an array

          db.executeSql(
            sql2,
            params2,
            result2 => {
              console.log(
                'memeber group user inserted' + JSON.stringify(result2),
              );
            },
            error => {
              //console.log('Create user error', error);
            },
          );
        } else {
          console.log('already user exist in local');
        }
      },
    );
  });
};
export const addSQLInviteFriend = (
  acessid,
  receiver_email,
  groupid,
  added_by_user_id,
  receiver_id,
  invitation_date,
  user_id,
  group_user_id,
) => {
  let sql =
    'INSERT INTO tbl_access_relations (serverFId, invitation_status, invitation_from_id, receiver_id, receiver_email, invitation_to_group_id, canc_by_id, isDeleted, invitation_date, updated) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  let params = [
    acessid,
    'A',
    user_id,
    receiver_id,
    receiver_email,
    0,
    0,
    0,
    invitation_date,
    invitation_date,
  ]; //storing user data in an array

  db.executeSql(
    sql,
    params,
    result => {
      let sql2 =
        'INSERT INTO tbl_groups_users (ufId, uId, gId, added_by_user_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?, ?)';
      let params2 = [
        group_user_id,
        receiver_id,
        groupid,
        added_by_user_id,
        0,
        invitation_date,
      ]; //storing user data in an array

      db.executeSql(
        sql2,
        params2,
        result2 => {
          console.log(JSON.stringify(result) + '==' + JSON.stringify(result2));
        },
        error => {
          //console.log('Create user error', error);
        },
      );
      //Alert.alert('Success', 'Group created successfully.');
    },
    error => {
      console.log('Create user error', error);
    },
  );
};
export const addSQLInviteFriendNewGroup = (
  acessid,
  receiver_email,
  groupid,
  added_by_user_id,
  receiver_id,
  invitation_date,
  user_id,
  invitation_from_id,
  group_user_id_1,
  group_name,
  invitation_to_group_id,
  group_user_id_2,
  registered,
  created_by_user_id,
  created,
) => {
  let sql =
    'INSERT INTO tbl_groups (serverId, uId, g_name, mId, isDeleted, date_created) values (?, ?, ?, ?, ?, ?)';
  let params = [
    group_user_id_1,
    created_by_user_id,
    group_name,
    '131',
    0,
    created,
  ]; //storing user data in an array
  db.executeSql(
    sql,
    params,
    result => {
      let sql1 =
        'INSERT INTO tbl_access_relations (serverFId, invitation_status, invitation_from_id, receiver_id, receiver_email, invitation_to_group_id, canc_by_id, isDeleted, invitation_date, updated) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      let params1 = [
        acessid,
        'A',
        invitation_from_id,
        receiver_id,
        receiver_email,
        invitation_to_group_id,
        0,
        0,
        invitation_date,
        invitation_date,
      ]; //storing user data in an array

      db.executeSql(
        sql1,
        params1,
        result1 => {
          let sql2 =
            'INSERT INTO tbl_groups_users (ufId, uId, gId, added_by_user_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?, ?)';
          let params2 = [
            group_user_id_1,
            user_id,
            groupid,
            added_by_user_id,
            0,
            invitation_date,
          ]; //storing user data in an array

          db.executeSql(
            sql2,
            params2,
            result2 => {
              let sql3 =
                'INSERT INTO tbl_groups_users (ufId, uId, gId, added_by_user_id, isDeleted, date_timestamp) values (?, ?, ?, ?, ?, ?)';
              let params3 = [
                group_user_id_2,
                receiver_id,
                groupid,
                added_by_user_id,
                0,
                invitation_date,
              ]; //storing user data in an array

              db.executeSql(
                sql3,
                params3,
                result3 => {
                  console.log(JSON.stringify(result3));
                },
                error => {
                  //console.log('Create user error', error);
                },
              );
            },
            error => {
              //console.log('Create user error', error);
            },
          );
          //Alert.alert('Success', 'Group created successfully.');
        },
        error => {
          console.log('Create user error', error);
        },
      );
    },
    error => {
      console.log('Create user error', error);
    },
  );
};
export const addSQLSongGroups = (
  serverId,
  ufhId,
  song_id,
  group_id,
  timestamp,
) => {
  let sql =
    'INSERT INTO tbl_song_groups (ufId, ufhId, songId, gId, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?)';
  let params = [serverId, ufhId, song_id, group_id, timestamp, 0]; //storing user data in an array

  db.executeSql(
    sql,
    params,
    result => {
      console.log(
        'song groups table inserted in local db' + JSON.stringify(result),
      );
      //Alert.alert('Success', 'Group created successfully.');
    },
    error => {
      console.log('Create user error', error);
    },
  );
};

//insert a new user record
export const addSQLSetLists = (
  serverSLId,
  uId,
  event_name,
  isDeleted,
  date_event,
  group_names,
  group_ids,
) => {
  let sql1 =
    'INSERT INTO tbl_setlist (serverSLId, uId, event_name, isDeleted, date_event) values (?, ?, ?, ?, ?)';
  let params1 = [serverSLId, uId, event_name, isDeleted, date_event]; //storing user data in an array
  db.executeSql(sql1, params1, result => {
    group_ids.map(
      gid => {
        let sql2 =
          'INSERT INTO tbl_event_groups (serverEGId, uId, gId, evId, isDeleted) values (?, ?, ?, ?, ?)';

        let params2 = [0, uId, gid, result.insertId, 0]; //storing user data in an array
        db.executeSql(
          sql2,
          params2,
          result => {},
          error => {
            //console.log('Create user error', error);
          },
        );
      },
      error => {
        //console.log('Create user error', error);
      },
    );
  });
};
export const addSQLUser = async (
  uId,
  username,
  firstname,
  familyname,
  email,
  user_pass,
  user_nicename,
  user_url,
  user_activation_key,
  display_name,
  postal_code,
  city,
  country_code,
  country,
  userKey,
  isDeleted,
  user_registered,
) => {
  let sql1 =
    'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  let params1 = [
    uId,
    username,
    firstname,
    familyname,
    email,
    user_pass,
    user_nicename,
    user_url,
    user_activation_key,
    display_name,
    postal_code,
    city,
    country_code,
    country,
    userKey,
    isDeleted,
    user_registered,
  ]; //storing user data in an array

  db.executeSql(
    sql1,
    params1,
    result1 => {
      console.log('Success', 'User created successfully to local.');
    },
    error => {
      //console.log('Create user error', error);
    },
  );
};
export const addSQLUserProfilePic = (
  loggedUser,
  uId,
  image_id,
  year,
  week,
  image_code,
  image_type,
  last_change,
  file_data,
  prfFlag,
) => {
  if (prfFlag == 1) {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE tbl_user_profile_pic set uppId = ? , year = ?, week= ?, code =?, date_last_change =?, file_type =?   where uId = ?',
        [image_id, year, week, image_code, last_change, image_type, uId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            if (file_data) {
              var prfImage = file_data.split(',');

              checkPermissionDownload(
                loggedUser,
                image_code,
                1,
                prfImage[1],
                'img',
              );
            }
          } else console.log('local profile picture failed');
        },
      );
    });
  } else {
    console.log('no data in user folder');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_profile_pic where uId = ?',
        [uId],
        (tx, resultUF) => {
          var leng = resultUF.rows.length;
          if (leng == 0) {
            let sql2 =
              'INSERT INTO tbl_user_profile_pic (uId, uppId, year, week, code, file_type, date_last_change, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?)';
            let params2 = [
              uId,
              image_id,
              year,
              week,
              image_code,
              image_type,
              last_change,
              0,
            ]; //storing user data in an array

            db.executeSql(
              sql2,
              params2,
              result2 => {
                if (file_data) {
                  var prfImage = file_data.split(',');

                  checkPermissionDownload(
                    loggedUser,
                    image_code,
                    1,
                    prfImage[1],
                    'img',
                  );
                }
              },
              error => {
                console.log('Create song error in local db', error);
              },
            );
          } else {
            console.log('user pic already exist');
          }
        },
      );
    });
  }
};
export const addSQLUserPic = (
  uId,
  username,
  firstname,
  familyname,
  email,
  user_pass,
  user_nicename,
  user_url,
  user_activation_key,
  display_name,
  postal_code,
  city,
  country_code,
  country,
  userKey,
  isDeleted,
  user_registered,
  image_id,
  year,
  week,
  image_code,
  image_type,
  last_change,
  file_data,
) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tbl_wp_users WHERE uId = ?',
      [uId],
      (tx, res) => {
        const len = res.rows.length;
        if (len == 0) {
          let sql1 =
            'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          let params1 = [
            uId,
            username,
            firstname,
            familyname,
            email,
            user_pass,
            user_nicename,
            user_url,
            user_activation_key,
            display_name,
            postal_code,
            city,
            country_code,
            country,
            userKey,
            isDeleted,
            user_registered,
          ]; //storing user data in an array

          db.executeSql(
            sql1,
            params1,
            result1 => {
              db.transaction(tx => {
                tx.executeSql(
                  'SELECT * FROM tbl_user_profile_pic WHERE uId  =?',
                  [uId],
                  (tx, results) => {
                    var tempPic = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                      tempPic.push(results.rows.item(i));
                    }

                    if (tempPic.length > 0) {
                      tempPic.map(pictur => {
                        console.log('found data in user folder');

                        if (pictur.id != '') {
                          db.transaction(tx => {
                            tx.executeSql(
                              'UPDATE tbl_user_profile_pic set uppId = ? , year = ?, week= ?, code =?, date_last_change =?, file_type =?   where uId = ?',
                              [
                                image_id,
                                year,
                                week,
                                image_code,
                                last_change,
                                image_type,
                                uId,
                              ],
                              (tx, results) => {
                                console.log('Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {
                                  checkPermissionDownload(
                                    username,
                                    image_code,
                                    1,
                                    file_data,
                                    'img',
                                  );
                                } else
                                  console.log('local profile picture failed');
                              },
                            );
                          });
                        }
                      });
                    } else {
                      console.log('no data in user folder');
                      let sql2 =
                        'INSERT INTO tbl_user_profile_pic (uId, uppId, year, week, code, file_type, date_last_change, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?)';
                      let params2 = [
                        uId,
                        image_id,
                        year,
                        week,
                        image_code,
                        image_type,
                        last_change,
                        0,
                      ]; //storing user data in an array

                      db.executeSql(
                        sql2,
                        params2,
                        result2 => {
                          checkPermissionDownload(
                            username,
                            image_code,
                            1,
                            file_data,
                            'img',
                          );

                          console.log('picture uploaded saved in local.');
                        },
                        error => {
                          console.log('Create song error in local db', error);
                        },
                      );
                    }
                  },
                );
              });
            },
            error => {
              //console.log('Create user error', error);
            },
          );
        } else {
          console.log('already user exist in local');
        }
      },
    );
  });
};
//insert a new user record
export const addSQLSongs = async (
  sId,
  userid,
  title,
  interpret,
  link,
  writer,
  genre,
  filename,
  category,
  filetype,
  year,
  week,
  code,
  key,
  folderid,
  img_data,
  shared_img_name,
  shared_song,
  firstname,
  lastname,
  username,
  email,
  registered,
  lastchange,
  timestamp,
  folder_lastchange,
  img64Bit,
  ufFlag,
  ufhidden,
  serverHid,
  shared_by_userid,
  song_group_id,
  imgtype,
  loggedUser,
) => {
  if (ufFlag == 1 && ufhidden == 0) {
    let sql1 =
      'INSERT INTO tbl_user_folder (sufId, uId, year, week, isDeleted, date_last_change) values (?, ?, ?, ?, ?, ?)';
    let params1 = [folderid, userid, year, week, 0, folder_lastchange]; //storing user data in an array

    db.executeSql(
      sql1,
      params1,
      result1 => {
        let sql2 =
          'INSERT INTO tbl_user_files (serverSGId, folder_id, uId, title, interpret, link, writer, genre, filename, share_image_type, category, type, code, song_key, shared_user_profile_image_name, shared_song, lastchange, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?)';
        let params2 = [
          sId,
          folderid,
          userid,
          title,
          interpret,
          link,
          writer,
          genre,
          filename,
          imgtype,
          category,
          filetype,
          code,
          key,
          shared_img_name,
          shared_song,
          lastchange,
          timestamp,
          0,
        ]; //storing user data in an array
        db.executeSql(
          sql2,
          params2,
          async result2 => {
            if (shared_song == 1) {
              let sql3 =
                'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              let params3 = [
                userid,
                username,
                firstname,
                lastname,
                email,
                'local',
                firstname,
                'local',
                'local',
                username,
                'local',
                'local',
                'local',
                'local',
                'local',
                0,
                registered,
              ];

              db.executeSql(
                sql3,
                params3,
                result3 => {
                  addSQLUserProfilePic(
                    loggedUser,
                    userid,
                    0,
                    0,
                    0,
                    shared_img_name,
                    imgtype,
                    new Date(),
                    img_data,
                    0,
                  );
                  addSQLSongGroups(
                    0,
                    result2.insertId,
                    sId,
                    song_group_id,
                    new Date(),
                  );
                },
                error => {
                  console.log('Create user error', error);
                },
              );

              var strImage = img_data.split(',');
              await checkPermissionDownload(
                loggedUser,
                shared_img_name,
                shared_song,
                strImage[1],
                'img',
              );
            }
            if (code == '') {
              await checkPermissionDownload(
                loggedUser,
                filename,
                shared_song,
                img64Bit,
                'file',
              );
            } else {
              await checkPermissionDownload(
                loggedUser,
                code,
                shared_song,
                img64Bit,
                'file',
              );
            }
          },
          error => {
            console.log('Create song error in local db21', error);
          },
        );
      },
      error => {
        //console.log('Create user error', error);
      },
    );
  } else if (ufFlag == 1 && ufhidden == 1) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_files where serverSGId = ? AND uId = ?',
        [sId, shared_by_userid],
        async (tx, results) => {
          var temp = [];
          var leng = results.rows.length;

          if (leng > 0) {
            temp.push(results.rows.item(0));
          }

          if (temp.length > 0) {
            if (shared_song == 1) {
              let sql3 =
                'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              let params3 = [
                userid,
                username,
                firstname,
                lastname,
                email,
                'local',
                firstname,
                'local',
                'local',
                username,
                'local',
                'local',
                'local',
                'local',
                'local',
                0,
                registered,
              ];

              db.executeSql(
                sql3,
                params3,
                result3 => {
                  addSQLUserProfilePic(
                    loggedUser,
                    userid,
                    0,
                    0,
                    0,
                    shared_img_name,
                    imgtype,
                    new Date(),
                    img_data,
                    0,
                  );
                  addSQLSongGroups(
                    0,
                    temp[0].id,
                    sId,
                    song_group_id,
                    new Date(),
                  );
                },
                error => {
                  console.log('Create user error1', error);
                },
              );

              var strImage = img_data.split(',');

              await checkPermissionDownload(
                loggedUser,
                shared_img_name,
                shared_song,
                strImage[1],
                'img',
              );
            }
            if (ufhidden == 1) {
              let sql4 =
                'INSERT INTO tbl_user_files_hidden (ufhId, uId, file_id, ServerhId, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?)';
              let params4 = [temp[0].id, userid, sId, serverHid, new Date(), 0]; //storing user data in an array

              db.executeSql(
                sql4,
                params4,
                result4 => {
                  console.log('Song created successfully in hidden table.');
                },
                error => {
                  console.log('Create song error in local db', error);
                },
              );
            }
            if (code == '') {
              await checkPermissionDownload(
                loggedUser,
                filename,
                shared_song,
                img64Bit,
                'file',
              );
            } else {
              await checkPermissionDownload(
                loggedUser,
                code,
                shared_song,
                img64Bit,
                'file',
              );
            }
          } else {
            let sql1 =
              'INSERT INTO tbl_user_folder (sufId, uId, year, week, isDeleted, date_last_change) values (?, ?, ?, ?, ?, ?)';
            let params1 = [
              folderid,
              shared_by_userid,
              year,
              week,
              0,
              folder_lastchange,
            ]; //storing user data in an array

            db.executeSql(
              sql1,
              params1,
              result1 => {
                let sql2 =
                  'INSERT INTO tbl_user_files (serverSGId, folder_id, uId, title, interpret, link, writer, genre, filename, share_image_type, category, type, code, song_key, shared_user_profile_image_name, shared_song, lastchange, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                let params2 = [
                  sId,
                  folderid,
                  shared_by_userid,
                  title,
                  interpret,
                  link,
                  writer,
                  genre,
                  filename,
                  imgtype,
                  category,
                  filetype,
                  code,
                  key,
                  shared_img_name,
                  shared_song,
                  lastchange,
                  timestamp,
                  0,
                ]; //storing user data in an array
                db.executeSql(
                  sql2,
                  params2,
                  async result2 => {
                    if (shared_song == 1) {
                      let sql3 =
                        'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                      let params3 = [
                        userid,
                        username,
                        firstname,
                        lastname,
                        email,
                        'local',
                        firstname,
                        'local',
                        'local',
                        username,
                        'local',
                        'local',
                        'local',
                        'local',
                        'local',
                        0,
                        registered,
                      ];

                      db.executeSql(
                        sql3,
                        params3,
                        result3 => {
                          addSQLUserProfilePic(
                            loggedUser,
                            userid,
                            0,
                            0,
                            0,
                            shared_img_name,
                            imgtype,
                            new Date(),
                            img_data,
                            0,
                          );
                          addSQLSongGroups(
                            0,
                            result2.insertId,
                            sId,
                            song_group_id,
                            new Date(),
                          );
                        },
                        error => {
                          console.log('Create user error1', error);
                        },
                      );

                      var strImage = img_data.split(',');

                      await checkPermissionDownload(
                        loggedUser,
                        shared_img_name,
                        shared_song,
                        strImage[1],
                        'img',
                      );
                    }
                    if (ufhidden == 1) {
                      let sql4 =
                        'INSERT INTO tbl_user_files_hidden (ufhId, uId, file_id, ServerhId, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?)';
                      let params4 = [
                        result2.insertId,
                        userid,
                        sId,
                        serverHid,
                        new Date(),
                        0,
                      ]; //storing user data in an array

                      db.executeSql(
                        sql4,
                        params4,
                        result4 => {
                          console.log(
                            'Song created successfully in hidden table.',
                          );
                        },
                        error => {
                          console.log('Create song error in local db', error);
                        },
                      );
                    }
                    if (code == '') {
                      await checkPermissionDownload(
                        loggedUser,
                        filename,
                        shared_song,
                        img64Bit,
                        'file',
                      );
                    } else {
                      await checkPermissionDownload(
                        loggedUser,
                        code,
                        shared_song,
                        img64Bit,
                        'file',
                      );
                    }
                    //console.log('Song created successfully.');
                  },
                  error => {
                    console.log('Create song error in local db', error);
                  },
                );
              },
              error => {
                console.log('Create user error', error);
              },
            );
          }
        },
      );
    });
  } else if (ufFlag == 0 && ufhidden == 1) {
    //try{
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_user_files where serverSGId = ? AND uId = ?',
        [sId, shared_by_userid],
        async (tx, results) => {
          var temp = [];
          var leng = results.rows.length;

          if (leng > 0) {
            temp.push(results.rows.item(0));
          }

          if (temp.length > 0) {
            if (shared_song == 1) {
              let sql3 =
                'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              let params3 = [
                userid,
                username,
                firstname,
                lastname,
                email,
                'local',
                firstname,
                'local',
                'local',
                username,
                'local',
                'local',
                'local',
                'local',
                'local',
                0,
                registered,
              ];

              db.executeSql(
                sql3,
                params3,
                result3 => {
                  console.log(
                    'shared user inserted in local DB' +
                      JSON.stringify(result3),
                  );
                  addSQLUserProfilePic(
                    loggedUser,
                    userid,
                    0,
                    0,
                    0,
                    shared_img_name,
                    imgtype,
                    new Date(),
                    img_data,
                    0,
                  );
                  addSQLSongGroups(
                    0,
                    temp[0].id,
                    sId,
                    song_group_id,
                    new Date(),
                  );
                },
                error => {
                  console.log('Create user error', error);
                },
              );
              var strImage = img_data.split(',');

              await checkPermissionDownload(
                loggedUser,
                shared_img_name,
                shared_song,
                strImage[1],
                'img',
              );
            }
            if (ufhidden == 1) {
              let sql4 =
                'INSERT INTO tbl_user_files_hidden (ufhId, uId, file_id, ServerhId, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?)';
              let params4 = [temp[0].id, userid, sId, serverHid, new Date(), 0]; //storing user data in an array

              db.executeSql(
                sql4,
                params4,
                result4 => {
                  console.log('Song created successfully in hidden table.');
                },
                error => {
                  console.log('Create song error in local db', error);
                },
              );
            }
            if (code == '') {
              await checkPermissionDownload(
                loggedUser,
                filename,
                shared_song,
                img64Bit,
                'file',
              );
            } else {
              await checkPermissionDownload(
                loggedUser,
                code,
                shared_song,
                img64Bit,
                'file',
              );
            }
          } else {
            let sql1 =
              'INSERT INTO tbl_user_files (serverSGId, folder_id, uId, title, interpret, link, writer, genre, filename, share_image_type, category, type, code, song_key, shared_user_profile_image_name, shared_song, lastchange, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let params1 = [
              sId,
              folderid,
              shared_by_userid,
              title,
              interpret,
              link,
              writer,
              genre,
              filename,
              imgtype,
              category,
              filetype,
              code,
              key,
              shared_img_name,
              shared_song,
              lastchange,
              timestamp,
              0,
            ]; //storing user data in an array

            db.executeSql(
              sql1,
              params1,
              async result1 => {
                if (shared_song == 1) {
                  let sql3 =
                    'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                  let params3 = [
                    userid,
                    username,
                    firstname,
                    lastname,
                    email,
                    'local',
                    firstname,
                    'local',
                    'local',
                    username,
                    'local',
                    'local',
                    'local',
                    'local',
                    'local',
                    0,
                    registered,
                  ];

                  db.executeSql(
                    sql3,
                    params3,
                    result3 => {
                      addSQLUserProfilePic(
                        loggedUser,
                        userid,
                        0,
                        0,
                        0,
                        shared_img_name,
                        imgtype,
                        new Date(),
                        img_data,
                        0,
                      );
                      addSQLSongGroups(
                        0,
                        result1.insertId,
                        sId,
                        song_group_id,
                        new Date(),
                      );
                    },
                    error => {
                      console.log('Create user error', error);
                    },
                  );
                  var strImage = img_data.split(',');

                  await checkPermissionDownload(
                    loggedUser,
                    shared_img_name,
                    shared_song,
                    strImage[1],
                    'img',
                  );
                }
                if (ufhidden == 1) {
                  let sql4 =
                    'INSERT INTO tbl_user_files_hidden (ufhId, uId, file_id, ServerhId, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?)';
                  let params4 = [
                    result1.insertId,
                    userid,
                    sId,
                    serverHid,
                    new Date(),
                    0,
                  ]; //storing user data in an array

                  db.executeSql(
                    sql4,
                    params4,
                    result4 => {
                      console.log('Song created successfully in hidden table.');
                    },
                    error => {
                      console.log('Create song error in local db', error);
                    },
                  );
                }
                if (code == '') {
                  await checkPermissionDownload(
                    loggedUser,
                    filename,
                    shared_song,
                    img64Bit,
                    'file',
                  );
                } else {
                  await checkPermissionDownload(
                    loggedUser,
                    code,
                    shared_song,
                    img64Bit,
                    'file',
                  );
                }
              },
              error => {
                console.log('Create song error in local db11', error);
              },
            );
          }
        },
      );
    });
  } else {
    let sql1 =
      'INSERT INTO tbl_user_files (serverSGId, folder_id, uId, title, interpret, link, writer, genre, filename, share_image_type, category, type, code, song_key, shared_user_profile_image_name, shared_song, lastchange, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let params1 = [
      sId,
      folderid,
      userid,
      title,
      interpret,
      link,
      writer,
      genre,
      filename,
      imgtype,
      category,
      filetype,
      code,
      key,
      shared_img_name,
      shared_song,
      lastchange,
      timestamp,
      0,
    ]; //storing user data in an array

    db.executeSql(
      sql1,
      params1,
      async result1 => {
        if (shared_song == 1) {
          let sql3 =
            'INSERT INTO tbl_wp_users (uId, user_login, user_firstname, user_lastname, user_email, user_pass, user_nicename, user_url, user_activation_key, display_name, postal_code, city, country_code, country, user_key, isDeleted, user_registered) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          let params3 = [
            userid,
            username,
            firstname,
            lastname,
            email,
            'local',
            firstname,
            'local',
            'local',
            username,
            'local',
            'local',
            'local',
            'local',
            'local',
            0,
            registered,
          ];

          db.executeSql(
            sql3,
            params3,
            result3 => {
              addSQLUserProfilePic(
                loggedUser,
                userid,
                0,
                0,
                0,
                shared_img_name,
                imgtype,
                new Date(),
                img_data,
                0,
              );
              addSQLSongGroups(
                0,
                result1.insertId,
                sId,
                song_group_id,
                new Date(),
              );
            },
            error => {
              console.log('Create user error', error);
            },
          );

          var strImage = img_data.split(',');

          await checkPermissionDownload(
            loggedUser,
            shared_img_name,
            shared_song,
            strImage[1],
            'img',
          );
        }
        if (code == '') {
          await checkPermissionDownload(
            loggedUser,
            filename,
            shared_song,
            img64Bit,
            'file',
          );
        } else {
          await checkPermissionDownload(
            loggedUser,
            code,
            shared_song,
            img64Bit,
            'file',
          );
        }
      },
      error => {
        console.log('Create song error in local db', error);
      },
    );
  }
};

const hasFilesPermission = async () => {
  // if (Platform.OS === 'ios') {
  //   const hasPermission = await hasPermissionIOS();
  //   return hasPermission;
  // }

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
const checkPermissionDownload = async (
  username,
  code,
  share,
  img64Bit,
  type,
) => {
  // Function to check the platform
  // If iOS then start downloading
  // If Android then ask for permission

  const hasPermission = await hasFilesPermission();

  if (!hasPermission) {
    return;
  }
  if (hasPermission) {
    await createPersistedFolder(username, code, share, img64Bit, type);
  }
};
const createPersistedFolder = async (username, code, share, img64Bit, type) => {
  var folderName = 'songanize';

  if (type == 'file') {
    var folderName = 'songanize';
  }
  if (share == 1 && type == 'img') {
    folderName = 'songanizeshare';
  }

  if (username) {
    try {
      const filesDir =
        Platform.OS === 'android'
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;

      const folderPath = `${filesDir}/${username}/${folderName}`;

      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        RNFS.mkdir(folderPath)
          .then(() => {
            console.log('Songanize Folder created successfully');
          })
          .catch(error => {
            console.error('Error creating folder:', error);
          });
      } else {
        console.log('Persisted folder already exists:', folderPath);
      }

      var path = folderPath + '/' + code;

      const {config, fs} = RNFetchBlob;
      fs.writeFile(path, img64Bit, 'base64').then(res => {
        console.log('File Id: ', res);
        console.log('File Saved successfully to local folder');
      }).catch;
      err => console.log('err File not saved', err)();
    } catch (error) {
      console.error('Error creating persisted folder:', error);
    }
  } else {
    console.log('user does not exist', err);
  }
};
