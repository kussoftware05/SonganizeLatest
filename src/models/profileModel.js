import {Alert} from 'react-native';

import {openDatabase} from 'react-native-sqlite-storage';

export async function fetchProfileModel(userKey, userName, userId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM tbl_wp_users where uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
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
export async function fetchProfilePictureModel(userKey, userName, userId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_profile_pic where uId = ?',
          [userId],
          (tx, results) => {
            var temp = [];
            var len = results.rows.length;
            if (len > 0) {
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
export async function updateProfileDataModel(
    username, email, firstname, familyname, userId
) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
            'UPDATE tbl_wp_users set user_login=?, user_email =?, user_firstname =?, user_lastname =? where uId=?',
            [username, email, firstname, familyname, userId],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              resolve(results);
            } else Alert.alert('Updation Failed');
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
export async function uploadPictureDataModel(uploadPictureName, pictureType, userId) {
  return new Promise((resolve, reject) => {
    var db = openDatabase({name: 'Songanizeoffline.db'});

    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM tbl_user_profile_pic WHERE uId  =?',
          [userId],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            console.log('upload-->' + '--' + temp.length);
            if (temp.length > 0) {
              temp.map(pictur => {
                console.log('found data in user folder');

                var year = pictur.year;
                var week = pictur.week;

                if (pictur.id != '') {
                  db.transaction(
                    tx => {
                      tx.executeSql(
                        'UPDATE tbl_user_profile_pic set uppId =?, year= ?, week =?, code =?, file_type =?, date_last_change =?  where uId = ?',
                        [0, year, week, uploadPictureName, pictureType, new Date(), userId],
                        async (tx, results) => {
                          console.log('Results', results.rowsAffected);
                          resolve(results);
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
              });
            } else {
              console.log('no data in user folder');
              let sql2 =
                'INSERT INTO tbl_user_profile_pic (uId, uppId, year, week, code, file_type, date_last_change, isDeleted) values (?, ?, ?, ?, ?, ?, ?, ?)';
              let params2 = [
                userId,
                0,
                0,
                0,
                uploadPictureName,
                pictureType,
                new Date().toISOString(),
                0,
              ]; //storing user data in an array

              console.log('params2-->' + params2);
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
                  throw new Error('Error: ' + error);
                },
              );
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
  });
}
