import * as Urls from '../../constant/ConstantVariables/Urls';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {Config} from '../../constant/ConstantVariables/config';
import {RSA} from 'react-native-rsa-native';

const fetchWithEmptyBody = async encryptedAuthHeader => {
  try {
    encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
    encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

    let response = await fetch(Urls.apiUrl, {
      method: 'GET',
      headers: new Headers({
        Authorization: encryptedAuthHeader,
      }),
      body: '',
    });

    let jsonObj = await response.json();

    if (jsonObj !== undefined && jsonObj !== null) {
      return jsonObj;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
};
const fetchWithBody = async (encryptedAuthHeader, postBody) => {
  try {
    encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
    encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

    let response = await fetch(Urls.apiUrl, {
      method: 'POST',
      headers: new Headers({
        Authorization: encryptedAuthHeader,
      }),
      body: postBody,
    });

    let jsonObj = await response.json();

    if (jsonObj !== undefined && jsonObj !== null) {
      return jsonObj;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
};
const fetchWithEmptyBodyWithPUT = async encryptedAuthHeader => {
  try {
    encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
    encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

    let response = await fetch(Urls.apiUrl, {
      method: 'PUT',
      headers: new Headers({
        Authorization: encryptedAuthHeader,
      }),
      body: '',
    });

    let jsonObj = await response.json();

    if (jsonObj !== undefined && jsonObj !== null) {
      return jsonObj;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
};

// get group lists
export const getProfile = createAsyncThunk(
  'auth/profileView',
  async ({userId, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'get_user_profile',
        user_key: user_key,
        user_name: user_name,
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        return data;
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// create group
export const createGroup = createAsyncThunk(
  'auth/createGroup',
  async ({group_name, userid}, {rejectWithValue}) => {
    try {
      const userData = {
        action: 'create_new_group',
        group_name: group_name,
        userid: userid,
      };

      const {data} = await axios.post(Urls.createGroup, userData);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// create group
export const uploadProfileImage = createAsyncThunk(
  'auth/uploadProfilePicture',
  async ({img_name, profile_img, user_key, user_name}, {rejectWithValue}) => {
    try {
      const userData = {
        action: 'upload_profile_image',
        user_key: user_key,
        user_name: user_name,
      };
      const postJson = {
        img_name: img_name,
        profile_img: profile_img,
      };
      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// get profile image
export const getProfileImage = createAsyncThunk(
  'auth/getProfilePicture',
  async ({user_key, user_name}, {rejectWithValue}) => {
    try {
      const userData = {
        action: 'get_profile_image',
        user_key: user_key,
        user_name: user_name,
      };
      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
//get group
export const getGroup = createAsyncThunk(
  'auth/group',
  async ({groupId}, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(Urls.getGroup + '&id=' + groupId);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue('Username and password do not match');
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    {userId, firstname, email, familyname, username, user_key, user_name},
    {rejectWithValue},
  ) => {
    try {
      var params = {
        action: 'set_user_profile',
        firstname: firstname,
        email: email,
        familyname: familyname,
        username: username,
        user_key: user_key,
        user_name: user_name,
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBodyWithPUT(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// delete group
export const deleteGroup = createAsyncThunk(
  'auth/deleteGroup',
  async ({id, uid}, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(
        Urls.deleteGroup + '&id=' + id + '&uid=' + uid,
      );

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
const profileService = {
  getProfile,
  createGroup,
  getGroup,
  updateProfile,
  deleteGroup,
  uploadProfileImage,
  getProfileImage,
};

export default profileService;
