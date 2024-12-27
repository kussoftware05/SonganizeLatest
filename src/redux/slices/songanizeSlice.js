import {createSlice, createAction} from '@reduxjs/toolkit';
import {
  getSonganizeLists,
  updateSonganizeAction,
  getSonganizeAction,
  hiddenSonganizeAction,
  updatehideSonganizeAction,
  fetchGroupShareAction,
} from '../services/songanizeAction';

const initialState = {
  title: null,
  loadingStart: false,
  error: null,
  success: false,
  status: null,
  results: [],
  hiddenResults: [],
  records: {},
  isAuthenticated: false,
  groups: [],
};
// songanize list
const songanizeSlice = createSlice({
  name: 'songanize',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // songanize lists
    builder.addCase(getSonganizeLists.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getSonganizeLists.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload.res_data;
    });
    builder.addCase(getSonganizeLists.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    //get single song
    builder.addCase(getSonganizeAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getSonganizeAction.fulfilled, (state, action) => {
      state.status = 'success';
      state.isAuthenticated = true;
      state.title = action.payload.title;
    });
    builder.addCase(getSonganizeAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //update songs
    builder.addCase(updateSonganizeAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(updateSonganizeAction.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(updateSonganizeAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //get hidden songs
    builder.addCase(hiddenSonganizeAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(hiddenSonganizeAction.fulfilled, (state, action) => {
      state.status = 'success';
      state.hiddenResults = action.payload.res_data;
    });
    builder.addCase(hiddenSonganizeAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //update hidden songs
    builder.addCase(updatehideSonganizeAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(updatehideSonganizeAction.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload;
    });
    builder.addCase(updatehideSonganizeAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    //fetch group share songs
    builder.addCase(fetchGroupShareAction.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(fetchGroupShareAction.fulfilled, (state, action) => {
      state.status = 'success';
      state.results = action.payload.res_data;
    });
    builder.addCase(fetchGroupShareAction.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});
export default songanizeSlice.reducer;
