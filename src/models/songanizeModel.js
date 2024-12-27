import {Alert} from 'react-native';

import {openDatabase} from 'react-native-sqlite-storage';

export async function fetchSongsListingsModel(userKey, userName, userId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});
   
      db.transaction(
          (tx) => {
            tx.executeSql(
              //'SELECT DISTINCT f.serverSGId as id,f.id AS user_file_id,f.uId AS file_user_id, f.type AS type, f.title AS title, f.filename AS filename, f.interpret AS interpret, f.category AS category, f.genre AS genre, f.song_key AS song_key, f.link AS link, f.code AS fcode, f.writer AS writer, f.folder_id AS folderid, f.lastchange AS lastchange, f.date_timestamp AS timestamp, uf.year AS fyear,uf.week AS fweek, uf.date_last_change AS fl_lastchange, sg.gId AS group_id, g.uId AS  group_user_id, h.uId AS hidden_user_id, h.file_id AS hidden_file_id, p.year As year, p.week AS week, p.code AS code, u.user_firstname AS firstname, u.user_lastname AS lastname FROM tbl_user_files AS f LEFT JOIN tbl_song_groups AS sg ON sg.songId = f.id LEFT JOIN tbl_groups_users AS g ON g.gId = sg.gId LEFT JOIN tbl_user_files_hidden AS h ON h.uId = ? AND h.file_id= f.serverSGId LEFT JOIN tbl_user_profile_pic AS p ON p.uId = f.uId LEFT JOIN tbl_wp_users AS u ON u.ID = f.uId LEFT JOIN tbl_user_folder AS uf ON uf.id = f.folder_id WHERE (f.uId= ? OR  g.uId = ?) AND h.file_id is null AND f.isDeleted = 0 GROUP BY f.id ORDER BY f.lastchange DESC',        
              'SELECT DISTINCT f.id as id, f.serverSGId as serverSGID, f.id AS user_file_id,f.uId AS file_user_id, f.type AS type, f.file_type as offline_type, f.title AS title, f.filename AS filename, f.interpret AS interpret, f.category AS category, f.genre AS genre, f.song_key AS song_key, f.link AS link, f.code AS fcode, f.writer AS writer, f.folder_id AS folderid, f.lastchange AS lastchange, f.date_timestamp AS timestamp, f.shared_song AS shared_song, f.shared_user_profile_image_name as shared_pic,f.share_image_type as share_image_type, uf.year AS fyear,uf.week AS fweek, uf.date_last_change AS fl_lastchange, sg.gId AS group_id, g.uId AS  group_user_id, h.uId AS hidden_user_id, h.ufhId AS hidden_file_id, h.isDeleted as hidden_song, p.year As year, p.week AS week, p.code AS code, u.user_firstname AS firstname, u.user_lastname AS lastname FROM tbl_user_files AS f LEFT JOIN tbl_song_groups AS sg ON sg.ufhId = f.id LEFT JOIN tbl_groups_users AS g ON g.gId = sg.gId LEFT JOIN tbl_user_files_hidden AS h ON h.uId = ? AND h.ufhId= f.id LEFT JOIN tbl_user_profile_pic AS p ON p.uId = f.uId LEFT JOIN tbl_wp_users AS u ON u.uId = f.uId LEFT JOIN tbl_user_folder AS uf ON uf.sufId = f.folder_id WHERE (f.uId= ? OR  g.uId = ?) AND (h.ufhId is null OR h.isDeleted = 1) AND f.isDeleted = 0 GROUP BY f.id ORDER BY f.lastchange DESC',
            //'SELECT DISTINCT f.serverSGId as id, f.category as category, f.writer as writer, f.id AS user_file_id, f.uId AS file_uId, f.type AS filetype, f.title AS title, f.filename AS filename,f.interpret AS interpret,f.category AS category,f.genre AS genre,f.song_key AS song_key,f.link AS link,sg.gId AS gId,g.uId AS  group_uId, h.uId AS hidden_uId,h.file_id AS hidden_file_id, p.year As year, p.week AS week, p.code AS code, w.user_firstname AS firstname, w.user_lastname AS lastname FROM tbl_user_files AS f LEFT JOIN tbl_song_groups AS sg ON sg.songId = f.id LEFT JOIN tbl_groups_users AS g ON g.gId = sg.gId LEFT JOIN tbl_user_files_hidden AS h ON h.uId = ? AND h.file_id = f.id LEFT JOIN tbl_user_profile_pic AS p ON p.uId = f.uId LEFT JOIN tbl_wp_users AS w ON w.ID = f.uId WHERE (f.uId= ? OR  g.uId = ?) AND h.file_id IS NULL GROUP BY f.id ORDER BY f.lastchange DESC',
            [userId, userId, userId],
            (tx, results) => {
              var temp = [];
              var len = results.rows.length;
              if (len > 0) {
                for (let i = 0; i < results.rows.length; ++i) 
                {
                  temp.push(results.rows.item(i));
                }
              }
              resolve(temp);
            },
            function (error) {
                reject(false);
                throw new Error(
                    'Error: ' + error
                );
            });
          },
          function (error) {
              reject(undefined);
              throw new Error('error: ' + error.message);
          },
          function () {
              console.log('ok');
          }
        )
  });
};

export async function updateSongsDataModel(titleData,
  interpreet,
  youtubeLink,
  writterBy,
  generate,
  file,
  type,
  key,
  itemId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

      db.transaction(
          (tx) => {
            tx.executeSql(
              'UPDATE tbl_user_files set title =?, interpret =? , link =? , writer =? , genre =? , filename =? , category =? , song_key=?, lastchange =? where id=?',
              [
                titleData,
                interpreet,
                youtubeLink,
                writterBy,
                generate,
                file,
                type,
                key,
                new Date().toISOString(),
                itemId,
              ],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                resolve(results);
              } else Alert.alert('Updation Failed');
            },
            function (error) {
                reject(false);
                throw new Error(
                    'Error: ' + error
                );
            });
          },
          function (error) {
              reject(undefined);
              throw new Error('error: ' + error.message);
          },
          function () {
              console.log('ok');
          }
        )
  });
};

export async function uploadSongsDataModel(userId,randomName, getExtension, uploadFileType) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});
 
      db.transaction(
          (tx) => {
            tx.executeSql(
              'SELECT * FROM tbl_user_folder WHERE uId  =?',
              [userId],
              (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                }
                if (temp.length > 0) {
                  temp.map(song => {
                    console.log('found data in user folder');
                    var folderid = song.sufId;
                    var year = song.year;
                    var week = song.week;

                    if (song.id != '') {
                      let sql2 =
                        'INSERT INTO tbl_user_files (serverSGId, folder_id, uId, title, interpret, link, writer, genre, filename, category, type, file_type, code, song_key, date_timestamp, lastchange, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                      let params2 = [
                        0,
                        folderid,
                        userId,
                        '',
                        '',
                        '',
                        '',
                        '',
                        randomName,
                        '',
                        getExtension,
                        uploadFileType,
                        '',
                        '',
                        new Date().toISOString(),
                        new Date().toISOString(),
                        0,
                      ]; //storing user data in an array

                      db.executeSql(
                        sql2,
                        params2,
                        async result2 => {
                          resolve(result2);
                        },
                        error => {
                          console.log('Create song error in local db', error);
                        },
                        function (error) {
                          reject(false);
                          throw new Error(
                              'Error: ' + error
                          );
                      });
                    }
                  });
                } else 
                {
                  console.log('no data in user folder');
                  let sql2 =
                    'INSERT INTO tbl_user_files (serverSGId, folder_id, uId, title, interpret, link, writer, genre, filename, category, type, file_type, code, song_key, date_timestamp, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                  let params2 = [
                    0,
                    0,
                    userId,
                    '',
                    '',
                    '',
                    '',
                    '',
                    randomName,
                    '',
                    getExtension,
                    uploadFileType,
                    '',
                    '',
                    new Date().toISOString(),
                    0,
                  ]; //storing user data in an array

                  db.executeSql(
                    sql2,
                    params2,
                    async result2 => {
                      resolve(result2);
                    },
                    error => {
                      console.log('Create song error in local db', error);
                    },
                    function (error) {
                        reject(false);
                        throw new Error(
                            'Error: ' + error
                        );
                    });
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
          }
        )
  });
};

export async function searchSongsDataModel(userId,input) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

      db.transaction(
          (tx) => {
            tx.executeSql(
              'SELECT DISTINCT f.id as id, f.serverSGId as serverSGID, f.id AS user_file_id,f.uId AS file_user_id, f.type AS type, f.file_type as offline_type, f.title AS title, f.filename AS filename, f.interpret AS interpret, f.category AS category, f.genre AS genre, f.song_key AS song_key, f.link AS link, f.code AS fcode, f.writer AS writer, f.folder_id AS folderid, f.lastchange AS lastchange, f.date_timestamp AS timestamp, f.shared_song AS shared_song, f.shared_user_profile_image_name as shared_pic,f.share_image_type as share_image_type, uf.year AS fyear,uf.week AS fweek, uf.date_last_change AS fl_lastchange, sg.gId AS group_id, g.uId AS  group_user_id, h.uId AS hidden_user_id, h.ufhId AS hidden_file_id, h.isDeleted as hidden_song, p.year As year, p.week AS week, p.code AS code, u.user_firstname AS firstname, u.user_lastname AS lastname FROM tbl_user_files AS f LEFT JOIN tbl_song_groups AS sg ON sg.ufhId = f.id LEFT JOIN tbl_groups_users AS g ON g.gId = sg.gId LEFT JOIN tbl_user_files_hidden AS h ON h.uId = ? AND h.ufhId= f.id LEFT JOIN tbl_user_profile_pic AS p ON p.uId = f.uId LEFT JOIN tbl_wp_users AS u ON u.uId = f.uId LEFT JOIN tbl_user_folder AS uf ON uf.sufId = f.folder_id WHERE (f.uId= ? OR  g.uId = ?) AND (h.ufhId is null OR h.isDeleted = 1) AND f.isDeleted = 0 AND (title LIKE ? OR interpret LIKE ? OR genre LIKE ? OR category LIKE ? OR song_key LIKE ?) GROUP BY f.id ORDER BY f.lastchange DESC',
              //'SELECT * FROM tbl_user_files WHERE uId = ? AND (title LIKE ? OR interpret LIKE ? OR genre LIKE ? OR category LIKE ? OR song_key LIKE ?)',
              [
                userId,userId, userId,
                `%${input}%`,
                `%${input}%`,
                `%${input}%`,
                `%${input}%`,
                `%${input}%`,
              ],
            (tx, results) => {
              var temp = [];
              var len = results.rows.length;
              if (len > 0) {
                for (let i = 0; i < results.rows.length; ++i) 
                {
                  temp.push(results.rows.item(i));
                }
              }
              resolve(temp);
            },
            function (error) {
                reject(false);
                throw new Error(
                    'Error: ' + error
                );
            });
          },
          function (error) {
              reject(undefined);
              throw new Error('error: ' + error.message);
          },
          function () {
              console.log('ok');
          }
        )
  });
};

export async function fetchSongsListingsHiiddenModel(userKey, userName, userId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});
   
      db.transaction(
          (tx) => {
            tx.executeSql(
                //'SELECT DISTINCT f.serverSGId as id,f.id AS user_file_id,f.uId AS file_user_id, f.type AS type, f.title AS title, f.filename AS filename, f.interpret AS interpret, f.category AS category, f.genre AS genre, f.song_key AS song_key, f.link AS link, f.code AS fcode, f.writer AS fwriter, f.folder_id AS folderid, f.lastchange AS lastchange, f.date_timestamp AS date_timestamp, f.shared_user_profile_image_name AS shared_pic, f.shared_song AS shared_song, uf.year AS fyear, uf.week AS fweek, uf.date_last_change AS fl_lastchange, sg.gId AS group_id, g.uId AS  group_user_id, h.uId AS hidden_user_id, h.file_id AS hidden_file_id, h.isDeleted as hidden_song, p.year As year, p.week AS week, p.code AS code, u.user_firstname AS firstname, u.user_lastname AS lastname FROM tbl_user_files AS f LEFT JOIN tbl_song_groups AS sg ON sg.songId = f.serverSGId LEFT JOIN tbl_groups_users AS g ON g.gId = sg.gId LEFT JOIN tbl_user_files_hidden AS h ON h.uId = ? AND h.file_id= f.serverSGId LEFT JOIN tbl_user_profile_pic AS p ON p.uId = f.uId LEFT JOIN tbl_wp_users AS u ON u.ID = f.uId LEFT JOIN tbl_user_folder AS uf ON uf.id = f.folder_id WHERE (f.uId= ? OR  g.uId = ?) AND (h.file_id IS NOT NULL AND h.isDeleted = 0) AND f.isDeleted = 0 GROUP BY f.serverSGId ORDER BY f.lastchange DESC',
              'SELECT DISTINCT f.id as id, f.serverSGId as serverSGID, f.id AS user_file_id,f.uId AS file_user_id, f.type AS type, f.file_type as offline_type, f.title AS title, f.filename AS filename, f.interpret AS interpret, f.category AS category, f.genre AS genre, f.song_key AS song_key, f.link AS link, f.code AS fcode, f.writer AS writer, f.folder_id AS folderid, f.lastchange AS lastchange, f.date_timestamp AS timestamp, f.shared_song AS shared_song, f.shared_user_profile_image_name as shared_pic,f.share_image_type as share_image_type, uf.year AS fyear, uf.week AS fweek, uf.date_last_change AS fl_lastchange, sg.gId AS group_id, g.uId AS  group_user_id, h.uId AS hidden_user_id, h.ufhId AS hidden_file_id, h.isDeleted as hidden_song, p.year As year, p.week AS week, p.code AS code, u.user_firstname AS firstname, u.user_lastname AS lastname FROM tbl_user_files AS f LEFT JOIN tbl_song_groups AS sg ON sg.ufhId = f.id LEFT JOIN tbl_groups_users AS g ON g.gId = sg.gId LEFT JOIN tbl_user_files_hidden AS h ON h.uId = ? AND h.ufhId= f.id LEFT JOIN tbl_user_profile_pic AS p ON p.uId = f.uId LEFT JOIN tbl_wp_users AS u ON u.uId = f.uId LEFT JOIN tbl_user_folder AS uf ON uf.sufId = f.folder_id WHERE (f.uId= ? OR  g.uId = ?) AND (h.ufhId IS NOT NULL AND h.isDeleted = 0) AND f.isDeleted = 0 GROUP BY f.id ORDER BY f.lastchange DESC',
              
              //'SELECT DISTINCT f.id as id,f.id AS user_file_id,f.uId AS file_user_id, f.type AS type, f.title AS title, f.filename AS filename, f.interpret AS interpret, f.category AS category, f.genre AS genre, f.song_key AS song_key, f.link AS link, f.code AS fcode, f.writer AS writer, f.folder_id AS folderid, f.lastchange AS lastchange, f.date_timestamp AS timestamp, f.shared_song AS shared_song, uf.year AS fyear,uf.week AS fweek, uf.date_last_change AS fl_lastchange, sg.gId AS group_id, g.uId AS  group_user_id, h.uId AS hidden_user_id, h.file_id AS hidden_file_id, h.isDeleted as hidden_song, p.year As year, p.week AS week, p.code AS code, u.user_firstname AS firstname, u.user_lastname AS lastname FROM tbl_user_files AS f LEFT JOIN tbl_song_groups AS sg ON sg.ufhId = f.id LEFT JOIN tbl_groups_users AS g ON g.gId = sg.gId LEFT JOIN tbl_user_files_hidden AS h ON h.uId = ? AND h.ufhId= f.id LEFT JOIN tbl_user_profile_pic AS p ON p.uId = f.uId LEFT JOIN tbl_wp_users AS u ON u.ID = f.uId LEFT JOIN tbl_user_folder AS uf ON uf.id = f.folder_id WHERE (f.uId= ? OR  g.uId = ?) AND h.file_id is null AND f.isDeleted = 0 GROUP BY f.id ORDER BY f.lastchange DESC',
       
              [userId, userId, userId],
            (tx, results) => {
              var tempArry = [];
              var len = results.rows.length;
              if (len > 0) {
                for (let i = 0; i < results.rows.length; ++i) 
                {
                  tempArry.push(results.rows.item(i));
                }
              }
              resolve(tempArry);
            },
            function (error) {
                reject(false);
                throw new Error(
                    'Error: ' + error
                );
            });
          },
          function (error) {
              reject(undefined);
              throw new Error('error: ' + error.message);
          },
          function () {
              console.log('ok');
          }
        )
  });
};

export async function deleteSongsDataModel(songDelete) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

      db.transaction(
          (tx) => {
            tx.executeSql(
              'UPDATE tbl_user_files set isDeleted=? where id=?',
              [true, songDelete],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                resolve(results);
              } else Alert.alert('Delete Failed');
            },
            function (error) {
                reject(false);
                throw new Error(
                    'Error: ' + error
                );
            });
          },
          function (error) {
              reject(undefined);
              throw new Error('error: ' + error.message);
          },
          function () {
              console.log('ok');
          }
        )
  });
};
