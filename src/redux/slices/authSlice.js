import {createSlice, createAction} from '@reduxjs/toolkit';
import {
  userLogin,
  userRegister,
  resetPassword,
  forgotPassword,
  changePassword,
} from '../services/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isLoggedIn: false,
  email: null,
  password: null,
  loadingStart: false,
  error: null,
  success: false,
  status: null,
  results: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  //reducers: {},
  reducers: {
    logout: state => {
      //AsyncStorage.removeItem('persist:root');
      AsyncStorage.removeItem('user_id'); // deletes id from storage
      AsyncStorage.removeItem('user_key'); // deletes key from storage
      AsyncStorage.removeItem('user_name'); // deletes key from storage
      state.loading = false;
      state.username = null;
      state.userid = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    //userlogin
    builder.addCase(userLogin.pending, state => {
      //console.log("pending");
      state.status = 'pending';
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      console.log('fulfilled');
      console.log(JSON.stringify(action.payload) + '--action.payload--');
      state.status = 'success';
      state.isLoggedIn = true;
      state.userid = action.payload.userid;
      state.user_key = action.payload.user_key;
      state.user_name = action.payload.user_name;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      console.log('failed' + JSON.stringify(state.error));
      state.status = 'failed';
      state.isLoggedIn = false;
      state.error = action.payload;
    });
    //register
    builder.addCase(userRegister.pending, state => {
      //console.log("pending");
      state.status = 'pending';
    });
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(userRegister.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //reset password
    builder.addCase(resetPassword.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      //console.log("fulfilled");
      console.log(JSON.stringify(state) + '--action.payload--');
      state.status = 'success';
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.status = 'failed';
      state.isLoggedIn = false;
      state.error = action.payload;
    });
    //forgot password
    builder.addCase(forgotPassword.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.status = 'success';
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.status = 'failed';
      state.isLoggedIn = false;
      state.error = action.payload;
    });
    //change password
    builder.addCase(changePassword.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.status = 'success';
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.status = 'failed';
      state.isLoggedIn = false;
      state.error = action.payload;
    });
  },
});

export const {logout} = authSlice.actions;

export const selectIsLoggedIn = state => state.auth.isLoggedIn;
export const selectUserName = state => state.auth.user_name;
export const selectUserId = state => state.auth.userid;
export const selectUserKey = state => state.auth.user_key;
export const selectLoading = state => state.auth.loadingStart;
export const selectError = state => state.auth.error;

export default authSlice.reducer;
