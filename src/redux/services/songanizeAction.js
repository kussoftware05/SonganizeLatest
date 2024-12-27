import * as Urls from '../../constant/ConstantVariables/Urls';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

import {Config} from '../../constant/ConstantVariables/config';
import { RSA } from 'react-native-rsa-native';

const fetchWithEmptyBody = async (encryptedAuthHeader) => {
  try{

      encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
      encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

      let response = await fetch(Urls.apiUrl, { 
          method: 'GET', 
          headers: new Headers({
              'Authorization': encryptedAuthHeader
          }),
          body: '',
      });
     
      let jsonObj = await response.json();

      if(jsonObj !== undefined && jsonObj !== null){
          return jsonObj;
      }
  }
  catch(err){
      console.log(err);            
  }

  return null;
}
const fetchWithBody = async(encryptedAuthHeader, postBody)=>{
  try{
      encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
      encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

      let response = await fetch(Urls.apiUrl, { 
          method: 'POST', 
          headers: new Headers({
              'Authorization': encryptedAuthHeader,
          }),
          body: postBody,
      });            
      
      let jsonObj = await response.json();

      if(jsonObj !== undefined && jsonObj !== null){
          return jsonObj;
      }
  }
  catch(err){
      console.log(err);            
  }

  return null;
}
const fetchWithEmptyBodyWithPUT = async (encryptedAuthHeader) => {
  try{

      encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
      encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

      let response = await fetch(Urls.apiUrl, { 
          method: 'PUT', 
          headers: new Headers({
              'Authorization': encryptedAuthHeader
          }),
          body: '',
      });
     
      let jsonObj = await response.json();

      if(jsonObj !== undefined && jsonObj !== null){
          return jsonObj;
      }
  }
  catch(err){
      console.log(err);            
  }

  return null;
}
const fetchWithEmptyBodyWithDELETE = async (encryptedAuthHeader) => {
  try{

      encryptedAuthHeader = encryptedAuthHeader.replace(/\n/g, '');
      encryptedAuthHeader = encryptedAuthHeader.replace(/\r/g, '');

      let response = await fetch(Urls.apiUrl, { 
          method: 'DELETE', 
          headers: new Headers({
              'Authorization': encryptedAuthHeader
          }),
          body: '',
      });
      let jsonObj = await response.json();

      if(jsonObj !== undefined && jsonObj !== null){
          return jsonObj;
      }
  }
  catch(err){
      console.log(err);            
  }

  return null;
}

// get group lists
export const getSonganizeLists = createAsyncThunk(
  'auth/songanizeList',
  async ({userId, user_key, user_name}, {rejectWithValue}) => {
        try {
          var params = {
            action: 'get_songs',
            user_key:user_key,
            user_name :user_name
          };  
          let authStr = JSON.stringify(params);
          let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
      
          let data  = await fetchWithEmptyBody(encrypted);

          if (data && data.code == 200) {
            return data;
          } else {
            console.log('errorMessage33' + data.message);
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
export const uploadDocumentation = createAsyncThunk(
  'auth/uploadDoc',
  async ({file_name, uploadFile, user_key, user_name}, {rejectWithValue}) => {
    try {
      const auth = {
        action: 'add_song',
        user_key: user_key,
        user_name : user_name
      };
      const postJson = {
        name: file_name,
        image: uploadFile,
      };
      let authStr = JSON.stringify(auth);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

       let postBody = JSON.stringify(postJson);

      let data  = await fetchWithBody(encrypted, postBody);

      if (data && data.code == 200) {
        return data;
      } else {
        console.log('errorMessage' + data.message);
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
//get songanize single
export const getSonganizeAction = createAsyncThunk(
  'auth/getSonganize',
  async ({itemId}, {rejectWithValue}) => {
    try {
      const {data} = await axios.get(Urls.getSonganize + '&id=' + itemId);
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
// update songanize data
export const updateSonganizeAction = createAsyncThunk(
  'auth/updateSonganize',
  async ({id, link, title, key, genre, writer, interpret, category, file, user_key, user_name},{rejectWithValue},) => {
    try {
      const songDetails = {
        action: 'update_song',
        id: id,
        link: link,
        title: title,
        key: key,
        genre: genre,
        writer: writer,
        interpret: interpret,
        category: category,
        filename: file,
        user_key: user_key,
        user_name : user_name
      };

      let authStr = JSON.stringify(songDetails);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
  
      let data  = await fetchWithEmptyBodyWithPUT(encrypted);

      if (data && data.code == 200) {
        return data;
      } else {
        return rejectWithValue('msg' + data.message);
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue('message' + error.message);
      } else {
        return rejectWithValue('mes' + error.message);
      }
    }
  },
);
// get hidden songs
export const hiddenSonganizeAction = createAsyncThunk(
  'auth/hiddenSonganize',
  async ({id, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'get_hidden_songs',
        user_key:user_key,
        user_name :user_name
      };  

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
  
      let data  = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        return data;
      }
      else {
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
// hidden group
export const updatehideSonganizeAction = createAsyncThunk(
  'auth/updatehideSonganize',
  async ({songid, user_key, user_name}, {rejectWithValue}) => {
    try {
      const auth = {
        action: 'hide_song',
        user_key: user_key,
        user_name : user_name
      };
      const postJson = {
        songid: songid
      };
      let authStr = JSON.stringify(auth);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
      //let postJson = docData;

       let postBody = JSON.stringify(postJson);
       let data  = await fetchWithBody(encrypted, postBody);
      //const {data} = await axios.get(Urls.getHiddenSonganize + '&id=' + id);

      if (data && data.code == 200) {
        return data;
      } else {
        //console.log('errorMessage' + data.message);
        return rejectWithValue(data.message);
      }
    } catch (error) {
      //console.log('error' + error);
      // return custom error message from API if any
      if (error && error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
//get search songanize
export const getSearchSongAction = createAsyncThunk(
  'auth/songanizeSearch',
  async ({id, input, user_key, user_name}, {rejectWithValue}) => {
    try {
    
      var params = {
        action: 'search_song',
        user_key:user_key,
        user_name :user_name,
        s:input
      };  
      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
  
      let data  = await fetchWithEmptyBody(encrypted);

      if (data && data.code == 200) {
        return data;
      }
     
      else {
        console.log('errorMessage' + data.message);
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
// delete songlist
export const deleteSongAction = createAsyncThunk(
  'auth/songanizeDelete',
  async ({id, user_key, user_name}, {rejectWithValue}) => {
    try {

      const auth = {
        action: 'delete_song',
        id: id,
        user_key: user_key,
        user_name : user_name
      };
      
      let authStr = JSON.stringify(auth);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
     
      let data  = await fetchWithEmptyBodyWithDELETE(encrypted);

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
// create setlist
export const groupShareAction = createAsyncThunk(
  'auth/groupShare',
  async ({song_id, gid, user_key, user_name}, {rejectWithValue}) => {
    try {
      const auth = {
        action: 'file_share',
        user_key: user_key,
        user_name : user_name
      };
      const postJson = {
        song_id: song_id,
        gid: gid,
      };
      let authStr = JSON.stringify(auth);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(postJson);

      let data  = await fetchWithBody(encrypted, postBody);

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
// create song groups names
export const getSongGroupsAction = createAsyncThunk(
  'auth/getSongGroups',
  async ({songid, user_key, user_name}, {rejectWithValue}) => {
    try {
     
      const params = {
        action: 'get_song_groups',
        user_key: user_key,
        user_name : user_name,
        songid: songid,
      };
     
      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
  
      let data  = await fetchWithEmptyBody(encrypted);

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
// create setlist
export const fetchGroupShareAction = createAsyncThunk(
  'auth/fetchgroupShare',
  async ({groupid, user_key, user_name}, {rejectWithValue}) => {
    try {
     
      const auth = {
        action: 'get_shared_songs',
        user_key: user_key,
        user_name : user_name,
        groupid: groupid
      };
      
      let authStr = JSON.stringify(auth);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let data  = await fetchWithEmptyBody(encrypted);

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
//get songanize single
export const downloadSongAction = createAsyncThunk(
  'auth/downloadSonganize',
  async ({code, userid, user_key, user_name}, {rejectWithValue}) => {
    try {
        var params = {
        action: 'file_download',
        user_key: user_key,
        user_name : user_name,
        fna: code,
        userid: userid
      };  
      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
  
      let data  = await fetchWithEmptyBody(encrypted);

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
// set hidden to list songs
export const hiddenToListSonganizeAction = createAsyncThunk(
  'auth/hiddenToListSonganize',
  async ({id, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action: 'set_hidden_song_to_list',
        user_key:user_key,
        user_name :user_name,
        id: id
      };  

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
  
      let data  = await fetchWithEmptyBodyWithDELETE(encrypted);

      if (data && data.code == 200) {
        return data;
      }
     
      else {
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
const songanizeService = {
  getSonganizeLists,
  uploadDocumentation,
  getSonganizeAction,
  updateSonganizeAction,
  hiddenSonganizeAction,
  updatehideSonganizeAction,
  getSearchSongAction,
  deleteSongAction,
  groupShareAction,
  downloadSongAction,
  fetchGroupShareAction,
  hiddenToListSonganizeAction,
  getSongGroupsAction
};

export default songanizeService;
