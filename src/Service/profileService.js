import {
  updateProfile,
  uploadProfileImage
} from '../redux/services/profileAction';

import {openDatabase} from 'react-native-sqlite-storage';

  export async function updateProfileServerAPI(
    username, email, firstname, familyname, userKey, userId, userName, dispatch
  ) {
    if (userKey)
    {
      const userDetails = {
        userId: userId,
        firstname: firstname,
        email: email,
        familyname: familyname,
        username: username,
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
    }
  };
  export async function UploadProfileImageServerAPI(
    uploadPictureName,
                  uploadPictureData,
                  pictureType,
                  userKey,
                  userId,
                  userName,
                  dispatch,
  ) {
    db = openDatabase({name: 'Songanizeoffline.db'});
    if (userKey) {
      const userPic = {
        img_name: uploadPictureName,
        profile_img: 'data:' + pictureType + ';base64,' + uploadPictureData,
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
                userId,
              ],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('local profile picture updated in db');
                } else console.log('local setlist update failed');
              },
            );
          });
        } else if (res.type == 'auth/uploadProfilePicture/pending') {
          console.log('Profile Updated error to server.');
        }
      });
    }
  };
    /* update data from local to server when online end*/
