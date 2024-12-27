import * as Urls from '../../constant/ConstantVariables/Urls';
import {createAsyncThunk} from '@reduxjs/toolkit';
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

// get setlist lists
export const getsetLists = createAsyncThunk(
  'auth/setlists',
  async ({userId, user_key, user_name}, {rejectWithValue}) => {
    try {
     var params = {
      action:'get_set_list',
      user_key:user_key,
      user_name :user_name
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
export const createSetlist = createAsyncThunk(
  'auth/createsetlist',
  async ({event, gid, event_date, sid, flag, user_key, user_name}, {rejectWithValue}) => {
    try {
      var auth = {
        action: 'update_set_list',
          user_key:user_key,
          user_name :user_name
      };  
      if (flag == 'create') {
        var postJson = {
            event: event,
            gid: gid,
            event_date: event_date
        };  
      } else {
        var postJson = {
            event: event,
            gid: gid,
            sid: sid,
            event_date: event_date
        };  
      }
     
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
//get setlist
export const getSingleSetlist = createAsyncThunk(
  'auth/setlistSingle',
  async ({songId, user_key, user_name}, {rejectWithValue}) => {
    try {
      var params = {
        action:'get_single_set_list',
        user_key:user_key,
        user_name :user_name,
        id: songId
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
    console.log('error' + error);
    if (error && error.message) {
      return rejectWithValue(error.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
  },
);
// create setlist
export const songShareAction = createAsyncThunk(
  'auth/songShare',
  async ({event_id, songs, user_key, user_name}, {rejectWithValue}) => {
    try {
      var auth = {
        action: 'set_song_list',
          user_key:user_key,
          user_name :user_name
      };  
      const postJson = {
        event_id: event_id,
        songs: songs,
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
// get setlist added songs lists
export const getAddedSongLists = createAsyncThunk(
  'auth/addedsonglists',
  async ({sId, user_key, user_name}, {rejectWithValue}) => {
    try {

      var params = {
        action:'get_setlist_songs',
        sid: sId,
        user_key:user_key,
        user_name :user_name
    };  

      let authStr = JSON.stringify(params);
      let encrypted = await RSA.encrypt(authStr, Config.AuthToken);
    
      let data  = await fetchWithEmptyBody(encrypted);

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
// get setlist added songs lists
export const saveSongsOrderListsAction = createAsyncThunk(
  'auth/saveSongsOrderLists',
  async ({event_songs, user_key, user_name}, {rejectWithValue}) => {
    try {

      var params = {
        action:'set_event_order',
        event_songs: event_songs,
        user_key:user_key,
        user_name :user_name
    };  

    let authStr = JSON.stringify(params);
    let encrypted = await RSA.encrypt(authStr, Config.AuthToken);

      let postBody = JSON.stringify(params);

    let data  = await fetchWithBody(encrypted, postBody);

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
// delete songlist
export const deleteSetlistSongsAction = createAsyncThunk(
  'auth/songsDelete',
  async ({event_songid, user_key, user_name}, {rejectWithValue}) => {
    try {

      const auth = {
        action: 'delete_setlist_songs',
        event_songid: event_songid,
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
//get setlist songs
export const getEventSongsListAction = createAsyncThunk(
  'auth/eventSongsList',
  async ({eventid, user_key, user_name}, {rejectWithValue}) => {
    try {;
      var params = {
        action:'get_event_songs',
        user_key:user_key,
        user_name :user_name,
        eventid: eventid
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
//get search songanize
export const getSearchSetListAction = createAsyncThunk(
  'auth/setlistSearch',
  async ({input, user_key, user_name}, {rejectWithValue}) => {
    try {
     
      var params = {
        action: 'search_set_list',
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
const setlistService = {
  getsetLists,
  createSetlist,
  getSingleSetlist,
  songShareAction,
  getAddedSongLists,
  deleteSetlistSongsAction,
  getEventSongsListAction,
  getSearchSetListAction,
  saveSongsOrderListsAction
};

export default setlistService;
