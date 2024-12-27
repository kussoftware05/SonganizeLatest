import {createSlice, createAction} from '@reduxjs/toolkit';
import {
  getProfile,
  updateProfile,
  getProfileImage,
} from '../services/profileAction';

const initialState = {
  group_name: null,
  loadingStart: false,
  error: null,
  success: false,
  status: null,
  results: [],
  records: {},
};
// profile list
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // get Profile
    builder.addCase(getProfile.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //update profile
    builder.addCase(updateProfile.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.status = 'success';
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    // get Profile Image
    builder.addCase(getProfileImage.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getProfileImage.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(getProfileImage.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export default profileSlice.reducer;
