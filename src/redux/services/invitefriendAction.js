import * as Urls from '../../constant/ConstantVariables/Urls';
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

// get group lists
export const getCheckUsers = createAsyncThunk(
  'auth/checkUsers',
  async ({email_id, user_key, user_name}, {rejectWithValue}) => {
    try {
      const userData = {
        action: 'check_invite_friend',
        email: email_id,
        user_key: user_key,
        user_name: user_name,
      };

      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBody(encrypted);

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
// get group share
export const getSendInvitation = createAsyncThunk(
  'auth/sendInvitation',
  async (
    {invite_email, user_key, user_name, message_from_user},
    {rejectWithValue},
  ) => {
    try {
      const userData = {
        action: 'send_invitation',
        user_key: user_key,
        user_name: user_name,
      };
      const postJson = {
        invite_email: invite_email,
        message_from_user: message_from_user,
      };

      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);
      console.log('sent mail' + JSON.stringify(data));

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
// invite existing group
export const inviteExistingGroup = createAsyncThunk(
  'auth/innviteExistGroup',
  async ({invite_email, user_key, user_name, groups}, {rejectWithValue}) => {
    try {
      const userData = {
        action: 'invite_existing_group',
        user_key: user_key,
        user_name: user_name,
      };

      const postJson = {
        invite_email: invite_email,
        groups: groups,
      };

      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);

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
// invite with create group
export const inviteNewGroup = createAsyncThunk(
  'auth/invitenewgroup',
  async (
    {invite_email, user_key, user_name, group_name},
    {rejectWithValue},
  ) => {
    try {
      const userData = {
        action: 'invite_new_group',
        user_key: user_key,
        user_name: user_name,
      };

      const postJson = {
        invite_email: invite_email,
        group_name: group_name,
      };

      let authStr = JSON.stringify(userData);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);

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

const friendService = {
  getCheckUsers,
  getSendInvitation,
  inviteExistingGroup,
  inviteNewGroup,
};

export default friendService;
