import * as Urls from '../../constant/ConstantVariables/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk} from '@reduxjs/toolkit';
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

export const userLogin = createAsyncThunk(
  'auth/login',
  async ({email, password}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'check_user_login',
        user_name: email,
        user_password: password,
        mobileDeviceInfo: 'test',
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        try {
          await AsyncStorage.setItem('user_id', JSON.stringify(data.userid));
          await AsyncStorage.setItem(
            'user_name',
            JSON.stringify(data.user_name),
          );
          await AsyncStorage.setItem('user_key', JSON.stringify(data.user_key));
          await AsyncStorage.setItem('user_loggedIn', JSON.stringify(true));
        } catch (error) {
          return null;
        }
        return data;
      } else if (data.code == 401) {
        return rejectWithValue(data.message);
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      // return custom error message from API if any
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const userRegister = createAsyncThunk(
  'auth/register',
  async (
    {username, email, password, firstname, lastname},
    {rejectWithValue},
  ) => {
    try {
      const userData = {
        action: 'register',
        username: username,
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
      };

      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
      let postJson = userData;

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);

      if (data && data.code == 200) {
        return data;
      } else if (data.code == 401) {
        return rejectWithValue(data.message);
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
export const changePassword = createAsyncThunk(
  'auth/changePass',
  async ({userId, password, user_key, user_name}, {rejectWithValue}) => {
    try {
      const auth = {
        action: 'change_password',
        user_key: user_key,
        user_name: user_name,
      };
      const postJson = {
        password: password,
      };

      let authStr = JSON.stringify(auth);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);

      if (data && data.code == 200) {
        return data;
      } else if (data.code == 401) {
        return rejectWithValue(data.message);
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
export const resetPassword = createAsyncThunk(
  'auth/resetPass',
  async ({userId, password}, {rejectWithValue}) => {
    try {
      const userData = {
        action: 'reset_password',
        userid: userId,
        password: password,
      };
      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
      let postJson = userData;

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);

      if (data && data.code == 200) {
        return data;
      } else if (data.code == 401) {
        return rejectWithValue(data.message);
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      // return custom error message from API if any
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({email}, {rejectWithValue}) => {
    try {
      const userData = {
        action: 'forgot_password',
        user_email: email,
      };
      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        return data;
      } else if (data.code == 401) {
        return rejectWithValue(data.message);
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      // return custom error message from API if any
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
const authService = {
  userLogin,
  userRegister,
  resetPassword,
  forgotPassword,
  changePassword,
};

export default authService;
