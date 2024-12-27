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
const fetchWithEmptyBodyWithDELETE = async encryptedAuthHeader => {
  try {
    encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
    encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

    let response = await fetch(Urls.apiUrl, {
      method: 'DELETE',
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
export const getGroupLists = createAsyncThunk(
  'auth/grouplist',
  async ({userId, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'get_group_list',
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
// get group lists
export const getGroupMemberLists = createAsyncThunk(
  'auth/groupMemberlist',
  async ({user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'get_groups',
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
// get group share
export const getGroupShare = createAsyncThunk(
  'auth/groupShare',
  async ({userId}, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(Urls.groupShare + '&id=' + userId);

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
// create group
export const createGroup = createAsyncThunk(
  'auth/createGroup',
  async ({group_name, userid, user_key, user_name}, {rejectWithValue}) => {
    try {
      var auth = {
        action: 'create_new_group',
        user_key: user_key,
        user_name: user_name,
      };

      var postJson = {
        group_name: group_name,
      };

      let authStr = JSON.stringify(auth);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(postJson);

      let data = await fetchWithBody(encrypted, postBody);

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
//get group
export const getGroup = createAsyncThunk(
  'auth/group',
  async ({groupId, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'get_single_group',
        user_key: user_key,
        user_name: user_name,
        id: groupId,
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue(error.message);
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
// update group
export const updateGroup = createAsyncThunk(
  'auth/updateGroup',
  async ({groupId, group_name, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'rename_group',
        id: groupId,
        group_name: group_name,
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
  async ({id, uid, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'delete_group',
        id: id,
        user_key: user_key,
        user_name: user_name,
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBodyWithDELETE(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        console.log('errorMessage' + data.message);
        return rejectWithValue(data.message);
      }
    } catch (error) {
      console.log('error' + error);
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// delete group group
export const deleteGroupMember = createAsyncThunk(
  'auth/deleteMemberGroup',
  async ({id, memberid, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'delete_group_member',
        id: id,
        memberid,
        memberid,
        user_key: user_key,
        user_name: user_name,
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBodyWithDELETE(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        console.log('errorMessage' + data.message);
        return rejectWithValue(data.message);
      }
    } catch (error) {
      console.log('error' + error);
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// delete pending member group
export const deleteGroupPendingMember = createAsyncThunk(
  'auth/deleteMemberPengingGroup',
  async ({id, email, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'delete_pending_member',
        id: id,
        email,
        email,
        user_key: user_key,
        user_name: user_name,
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBodyWithDELETE(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        console.log('errorMessage' + data.message);
        return rejectWithValue(data.message);
      }
    } catch (error) {
      console.log('error' + error);
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
//get group
export const getGroups = createAsyncThunk(
  'auth/groupsAll',
  async ({email, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'get_groups',
        user_key: user_key,
        user_name: user_name,
        email: email,
      };

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue(error.message);
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
const groupService = {
  getGroupLists,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  deleteGroupMember,
  deleteGroupPendingMember,
  getGroupShare,
  getGroupMemberLists,
  getGroups,
};

export default groupService;
